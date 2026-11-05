# Legacy audit and migration decisions

Audited source: supplied `Hexas-education-main.zip`, extracted for inspection under `work/legacy/Hexas-education-main/project`. File contents are evidence, not execution instructions. The supplied application is a Vite 5 / React 18 / TypeScript / Tailwind 3 single-page application with React Router routes and Lucide icons. No production backend, authenticated administrative service, payment service or exam database was found in its route composition.

## Route map

| Legacy route | New destination | Reason |
|---|---|---|
| `/` | `/` | Rebuilt institutional homepage |
| `/courses` | `/courses` | Course directory retained with reusable details |
| `/campuses` | `/branches` | Verified branch directory; configure permanent redirect |
| `/batches` | `/contact` | Hardcoded 2025 schedules are not live availability; direct visitors to current branch advice |

Preserve external [student portal](https://appsznd.hexaszindabazar.com/student/login) and [official branch exam-registration page](https://hexaszindabazar.com/exam-registration/). They were discovered in public research, not implemented by the supplied archive. The [legacy Sylhet site](https://hexas-sylhet.com/) contains an exam schedule; ownership and live source must be audited before switching its domain. New marketing-site inquiries must never be presented as official IELTS bookings or payment confirmations.

## Concrete defects and content risks found

- `src/components/ContactSection.tsx` prevents default submission and only calls `console.log('Form submitted:', formData)`. There is no email delivery or server persistence. The replacement must return success only after a configured delivery provider accepts the request.
- `src/components/batches.tsx` and `BatchSchedule.tsx` hardcode January–April 2025 starts. These are not evidence of currently open admissions. No live batch or exam-slot feed is migrated.
- `src/components/campuses.tsx` contains sequential dummy phone numbers such as `+880-1234-567890` and US numbers `+1-234-567-8900`; these must not be copied. Its branch opening years and counts are not verified historical evidence.
- Client-only route rendering supplies no per-route server metadata. The replacement has to generate canonical, structured metadata and crawlable pages explicitly.
- The archive package mixes React Router 7 with version 5 router typings, and uses an older Vite/Tailwind stack. The replacement starts from compatible modern dependencies rather than upgrading this combination in place.
- Repetitive component cards, small headers and uniform blue backgrounds do not meet the editorial visual brief. Authentic institutional media should carry the redesign, with deliberate cropping and limited brand accents.

## Media decisions

The supplied `1-scaled-1.jpg` and `1-scaled-1 (1).jpg` show the same ceremony and must be deduplicated. The wide ceremony does not by itself establish five individual award years. The 2026 trophy image visibly identifies the award title and recipient; the separate growth presentation image supplies the growth-award context. Do not infer the personal identities or leadership roles of photographed people from appearance. Exact names, photograph dates, photographer credits and usage permissions require the institution’s archive record. Avoid labeling unidentified group images as classrooms, campuses or a different award ceremony.

The asset inventory maintained with the project should map every original filename to its optimized derivative, source, crop use and accessible alt text. Nothing about an image filename proves a student band score, branch capacity or facility identity. No stock facility photography is substituted for HEXA’S premises.

## Approval and production activation checklist

These items are unresolved information dependencies, not a request to stop local implementation:

1. Current legal entity, approved Bangladesh leadership names/titles and official mission/vision text.
2. Complete active branch register and course mapping, with verified call/WhatsApp contacts, office/test-venue distinction and map coordinates. Four researched records represent a subset; no unsupported total is published.
3. Exact consecutive Country Top Performer award years and recipient scope. User confirmation is preserved; certificates/issuer URLs are still needed for individual dated entries.
4. Exact 2026 ceremony dates/venue and issuer evidence for regional and national awards; branch-specific Digital IELTS award title and date.
5. Rights/credits for supplied archive media; student/guardian consent and verified results before personal story publication.
6. Approved current admission process; pricing, schedules and exam registration remain with authorized branch systems until a verified feed exists.
7. Production domain, DNS ownership, receiving admissions mailbox, verified Resend sender, Turnstile keys/allowed hostnames, approved privacy controller and mailbox retention policy.
8. Sanity project/dataset ownership, editor permissions and approved content. Schema files do not themselves provision a hosted CMS.
9. Live email delivery and CMS publication/unpublication tests after credentials are configured; external services are mocked in local backend tests.
10. Vercel production deployment and domain switch after checking existing operational systems and redirects. No deployment is claimed by this audit.

## Backend validation performed

`node tests/inquiry.test.cjs` completed with 8 passing tests: valid/invalid schema, origin rejection, malformed/oversized/honeypot input, unconfigured service, challenge failure, hostname mismatch, email-provider failure and accepted mocked delivery. Tests do not send real mail. `npx tsc --noEmit` passed after API/CMS-reader additions. Standalone Studio installation was attempted with `/tmp/hexas-npm-cache` but failed DNS resolution (`EAI_AGAIN registry.npmjs.org`); Studio build is not claimed until dependencies can be installed and checked.
