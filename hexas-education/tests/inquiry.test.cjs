const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function load(file, env = {}, fetch = global.fetch) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const module = { exports: {} };
  const customRequire = name => name === '@/lib/inquiry' ? load('lib/inquiry.ts') : require(name);
  vm.runInNewContext(code, { module, exports: module.exports, require: customRequire, process: { env }, Response, Request, URL, Uint8Array, TextDecoder, AbortSignal, fetch });
  return module.exports;
}
const valid = { name: 'Test Learner', email: 'learner@example.com', message: 'I would like course guidance.', consent: true };
const request = (body = valid, origin = 'https://hexas.example') => new Request('https://hexas.example/api/inquiry', { method: 'POST', headers: { origin, 'content-type': 'application/json' }, body: JSON.stringify(body) });
const configured = { NEXT_PUBLIC_SITE_URL: 'https://hexas.example', RESEND_API_KEY: 'test-only', INQUIRY_FROM_EMAIL: 'test@example.com', INQUIRY_TO_EMAIL: 'admissions@example.com', TURNSTILE_SECRET_KEY: 'test-only' };
test('validation accepts optional branch/program and rejects unsafe input', () => {
  const { inquirySchema } = load('lib/inquiry.ts');
  assert.equal(inquirySchema.safeParse(valid).success, true);
  for (const invalid of [{ ...valid, consent: false }, { ...valid, email: 'bad' }, { ...valid, message: 'short' }, { ...valid, name: 'a'.repeat(101) }, { ...valid, phone: '<script>' }, { ...valid, program: 'a'.repeat(121) }]) assert.equal(inquirySchema.safeParse(invalid).success, false);
});
test('rejects foreign origin without calling external services', async () => {
  const { POST } = load('app/api/inquiry/route.ts', configured, () => { throw Error('Must not call'); });
  assert.equal((await POST(request(valid, 'https://attacker.example'))).status, 403);
});
test('rejects malformed JSON, oversized request and honeypot', async () => {
  const { POST } = load('app/api/inquiry/route.ts', {NEXT_PUBLIC_SITE_URL:'https://hexas.example'});
  assert.equal((await POST(new Request('https://hexas.example/api/inquiry', { method: 'POST', headers: { origin: 'https://hexas.example', 'content-type': 'application/json' }, body: '{' }))).status, 400);
  assert.equal((await POST(request({ ...valid, message: 'a'.repeat(17000) }))).status, 413);
  assert.equal((await POST(request({ ...valid, website: 'spam.example' }))).status, 400);
});
test('missing configuration returns honest unavailable response', async () => {
  const { POST } = load('app/api/inquiry/route.ts', {NEXT_PUBLIC_SITE_URL:'https://hexas.example'});
  assert.equal((await POST(request())).status, 503);
});
test('failed challenge never sends email', async () => {
  let calls = 0;
  const { POST } = load('app/api/inquiry/route.ts', configured, async () => { calls++; return Response.json({ success: false }); });
  assert.equal((await POST(request({ ...valid, turnstileToken: 'fake-token' }))).status, 400);
  assert.equal(calls, 1);
});
test('hostname mismatch never sends email', async () => {
  const { POST } = load('app/api/inquiry/route.ts', configured, async () => Response.json({ success: true, hostname: 'other.example' }));
  assert.equal((await POST(request({ ...valid, turnstileToken: 'fake-token' }))).status, 400);
});
test('provider rejection never returns success', async () => {
  const { POST } = load('app/api/inquiry/route.ts', configured, async url => url.includes('turnstile') ? Response.json({ success: true, hostname: 'hexas.example' }) : Response.json({ error: 'provider failure' }, { status: 500 }));
  assert.equal((await POST(request({ ...valid, turnstileToken: 'fake-token' }))).status, 502);
});
test('verified inquiry is submitted as plain text and only accepted with provider id', async () => {
  let email;
  const { POST } = load('app/api/inquiry/route.ts', configured, async (url, init) => {
    if (url.includes('turnstile')) return Response.json({ success: true, hostname: 'hexas.example' });
    email = JSON.parse(init.body); return Response.json({ id: 'mock-provider-id' });
  });
  const response = await POST(request({ ...valid, turnstileToken: 'fake-token' }));
  assert.equal(response.status, 200); assert.equal((await response.json()).success, true);
  assert.equal(email.reply_to, valid.email); assert.equal(email.html, undefined); assert.match(email.text, /Test Learner/);
});

test('local and preview origin fallbacks match the visitor origin', async () => {
  for (const [env, origin] of [[{},'http://localhost:3000'],[{VERCEL_URL:'preview.vercel.app'},'https://preview.vercel.app']]) {
    const {POST}=load('app/api/inquiry/route.ts',env);
    const response=await POST(new Request('http://0.0.0.0:3000/api/inquiry',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(valid)}));
    assert.equal(response.status,503);
  }
});
