# Operations and content editing

## Admissions inquiry service

The Next.js Node Route Handler at `/api/inquiry` accepts JSON fields `name`, `email`, optional `phone`, optional `program`, optional `branch`, `message`, boolean `consent`, empty `website` honeypot and `turnstileToken`. Server-side Zod validation imposes length limits. Actual streamed request bodies are capped at 16 KiB. Requests require a matching Origin and JSON content type; honeypot failures are rejected. No inquiry is stored in the repository, CMS or process memory.

Configure these server-side variables in local `.env.local` and Vercel environment settings:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Exact public origin, e.g. `https://your-approved-domain.example`; set separately for preview deployments |
| `RESEND_API_KEY` | Restricted Resend sending credential |
| `INQUIRY_FROM_EMAIL` | Sender on your verified Resend domain |
| `INQUIRY_TO_EMAIL` | Approved admissions mailbox |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile server credential |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Public widget key; register production and preview hostnames |

The server verifies tokens with Cloudflare and matches the returned hostname. Tokens expire and are single-use: the frontend must reset its widget after every submission attempt. A positive response means Resend accepted the message, not that a human read it or inbox delivery is guaranteed. Missing service settings return HTTP 503 and a branch-call fallback; no fake success is returned. Email provider errors return 502 or 503. Form content is sent as plain text to prevent HTML injection. Secrets and inquiry content are never logged by this implementation.

Configure Vercel Firewall rate limiting for `/api/inquiry` before public launch. Turnstile, origin checks and the honeypot are implemented; there is deliberately no unreliable process-local rate counter in a serverless function. Set retention/access rules in the receiving mailbox. Review privacy copy and the named data controller before launch.

Reference: [Cloudflare server validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/), [Resend send email API](https://resend.com/docs/api-reference/emails/send-email).

## Sanity Studio

`cms/` is an independent Sanity Studio package, kept out of the Next.js application build. Create a Sanity project/dataset with an account owned by HEXA’S; no project has been provisioned or deployed by this repository. Run `npm install` in `cms/`, retain the generated lockfile, copy `.env.example` to `.env.local`, and fill `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. Run `npm run dev`, then `npm run typecheck` and `npm run build` before Studio deployment. Invite authorized editors with minimal required permissions. Configure Studio CORS origins in Sanity settings. Never place private API tokens in `SANITY_STUDIO_*` variables.

Schemas cover courses, branches, achievements, news/announcements, galleries and student stories. Every record has a language (`en` or `bn`), summary, body, slug, primary source URL, verification state and approving editor/date. Photos require alt text and rights confirmation. Branch awards require a recipient branch. Student stories require result verification and consent. An editor can keep incomplete records in drafts; only approved, published records should reach the public site. API-level write permissions can bypass Studio form validation, so restrict write tokens and use the Studio workflow.

Website read settings:

| Variable | Purpose |
|---|---|
| `SANITY_PROJECT_ID` | Same Sanity project ID as Studio |
| `SANITY_DATASET` | Published content dataset |
| `SANITY_READ_TOKEN` | Optional server-only read token for a private dataset |

`lib/cms.ts` provides `getVerifiedContent(type, fallback, adapt, language)`. Call it in a Server Component or server content loader with a typed adapter for the requested schema. It requests the published perspective, excludes drafts, filters the language and requires `verificationStatus == "verified"`. Responses are structurally checked with Zod, cached for five minutes and tagged by content type. Missing configuration or request/validation failure returns the supplied curated local content. A successful empty collection stays empty so withdrawing content does not silently resurrect the fallback. Route data adapters must also respect branch active status and map only supported public fields; do not expose internal evidence notes.

The website adapter in `lib/site-content.ts` merges verified CMS courses, branches, awards and news over the bundled records by matching slug; verified remote galleries replace the bundled gallery when present. Empty datasets retain bundled content. To withdraw a bundled record permanently, remove it from `lib/content.ts` as well; unpublishing a CMS override restores its bundled version. This explicit fallback policy prevents accidental empty datasets erasing the website. Branch records with active=false are excluded from the remote query. The standalone Studio configuration is not itself proof of a connected dataset. English and Bengali records can share a slug when language differs; add translated content rather than claiming an unreviewed translation is approved.

Reference: [Sanity schema configuration](https://www.sanity.io/docs/studio/schemas-and-forms).

## Required live acceptance checks

After adding real credentials, verify a valid inquiry reaches the approved mailbox; exercise an expired challenge, rejected origin, oversized body, invalid email, missing consent, honeypot and mail-provider failure. Publish a reviewed CMS test record and verify its appearance after revalidation; unpublish it and confirm removal. Test Studio image rights and student consent validation. These live-service checks require configured accounts and have not been claimed as completed.
