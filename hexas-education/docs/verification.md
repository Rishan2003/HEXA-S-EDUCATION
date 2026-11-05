# Verification record

Executed 5 November 2026 (Asia/Dhaka).

## Completed
- Next.js 16.4.5 webpack production compilation and static generation passed (38 generated outputs including framework/system routes).
- Strict TypeScript and ESLint checks passed.
- Nine inquiry tests passed (including local/preview origin fallbacks): field validation, foreign origin rejection, malformed/oversized body, honeypot, unconfigured service, failed challenge, hostname mismatch, mail provider rejection and simulated accepted delivery. Tests use mocked provider responses and send no email.
- Standalone Sanity Studio production build and schema/config TypeScript check passed. This verifies compilation, not connection to a live editorial dataset.
- Separate CMS dependency audit after targeted overrides: no high/critical findings; 13 moderate transitive findings remain and should be reviewed before publishing the editor.
- Browser desktop review: homepage hero, award carousel content changes, program tabs and arrow-key selection, branch selection, timeline changes, gallery filtering, dialog open/Escape close.
- Browser inquiry check confirmed the unavailable response without configured delivery credentials. No email was sent.
- Browser mobile review at 390px: hero layout, menu open/close, navigation to admissions, form layout and no detected horizontal overflow.
- All 40 route checks passed (valid pages, invalid slugs and legacy redirects). Route results are recorded in `route-test-results.json`; valid routes return 200, invalid slugs return 404, legacy aliases redirect with 308.
- Production web dependencies: npm audit --omit=dev reported zero vulnerabilities at check time.

## Issues found and corrected
- Explicit branch typing corrected an empty-array union inference in the course-to-branch mapping.
- Lint corrected a plain internal anchor to Next Link.
- Local request origin fallback corrected from Next’s bound server address to the explicit localhost origin; deployed preview uses VERCEL_URL when a canonical origin is absent.
- Package versions pinned to installed versions instead of mutable latest tags.

## Not claimed
No measured Lighthouse score or Core Web Vitals field data. No live email delivery, real Turnstile challenge, authenticated CMS publication, real student portal login, payment, or official exam booking has been exercised. The main website has no payment collection. No approved production domain has been connected. The final deployment status is recorded separately if a preview is created.

See deployment.md for the access failure preventing a remote preview. No deployed smoke check was possible.
