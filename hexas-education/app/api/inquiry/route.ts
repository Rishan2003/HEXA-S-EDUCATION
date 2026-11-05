import { inquirySchema } from "@/lib/inquiry";

export const runtime = "nodejs";
export const maxDuration = 30;
const unavailable =
  "Online inquiries are temporarily unavailable. Please call your chosen branch.";
const json = (data: object, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const expected =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");
  let expectedOrigin: string;
  try {
    expectedOrigin = new URL(expected).origin;
  } catch {
    return json({ error: unavailable }, 503);
  }
  if (!origin || origin !== expectedOrigin)
    return json({ error: "Request origin is not permitted." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return json({ error: "Expected a JSON request." }, 415);
  // Limit the actual streamed payload; do not trust Content-Length alone.
  const reader = request.body?.getReader();
  if (!reader) return json({ error: "No inquiry received." }, 400);
  let bytes = 0;
  const chunks: Uint8Array[] = [];
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16_384) {
        await reader.cancel();
        return json({ error: "Inquiry is too large." }, 413);
      }
      chunks.push(value);
    }
  } catch {
    return json({ error: "Could not read your inquiry." }, 400);
  }
  const merged = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  let input: unknown;
  try {
    input = JSON.parse(new TextDecoder().decode(merged));
  } catch {
    return json({ error: "Invalid inquiry format." }, 400);
  }
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success)
    return json(
      {
        error: "Please check the form fields.",
        fields: parsed.error.flatten().fieldErrors,
      },
      400,
    );
  const data = parsed.data;
  if (data.website)
    return json({ error: "This inquiry could not be accepted." }, 400);
  const {
    RESEND_API_KEY,
    INQUIRY_FROM_EMAIL,
    INQUIRY_TO_EMAIL,
    TURNSTILE_SECRET_KEY,
  } = process.env;
  if (
    !RESEND_API_KEY ||
    !INQUIRY_FROM_EMAIL ||
    !INQUIRY_TO_EMAIL ||
    !TURNSTILE_SECRET_KEY
  )
    return json({ error: unavailable }, 503);
  if (!data.turnstileToken)
    return json({ error: "Please complete the security check." }, 400);
  try {
    const verification = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: TURNSTILE_SECRET_KEY,
          response: data.turnstileToken,
        }),
        signal: AbortSignal.timeout(8000),
        cache: "no-store",
      },
    );
    if (!verification.ok) return json({ error: unavailable }, 503);
    const challenge = (await verification.json()) as {
      success?: boolean;
      hostname?: string;
    };
    if (
      !challenge.success ||
      challenge.hostname !== new URL(expectedOrigin).hostname
    )
      return json(
        { error: "Security check expired or failed. Please try again." },
        400,
      );
    const delivery = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: INQUIRY_FROM_EMAIL,
        to: [INQUIRY_TO_EMAIL],
        reply_to: data.email,
        subject: "New HEXA’S Education admissions inquiry",
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone || "Not supplied"}`,
          `Program: ${data.program || "Guidance requested"}`,
          `Branch: ${data.branch || "Guidance requested"}`,
          "",
          data.message,
          "",
          "Consent: agreed to be contacted about this inquiry.",
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });
    if (!delivery.ok) return json({ error: unavailable }, 502);
    const result = (await delivery.json()) as { id?: string };
    if (!result.id) return json({ error: unavailable }, 502);
    return json({
      success: true,
      message:
        "Your inquiry has been accepted for delivery to our admissions team.",
    });
  } catch {
    return json({ error: unavailable }, 503);
  }
}
