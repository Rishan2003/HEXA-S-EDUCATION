# HEXA’S Education Bangladesh

A working Next.js App Router rebuild inspired by UNext’s dark editorial composition, using HEXA’S supplied institutional photography and sourced branch information.

## Run locally

Requires Node.js 22.13+ (tested on 22.23.1).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. For a production run:

```sh
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

The site runs with curated local content and no external credentials. Without mail/Turnstile settings the form truthfully returns an unavailable state and directs visitors to a branch. It never simulates a successful submission.

## Included

- Homepage with award carousel, program tabs and native accordions, branch selector, timeline and news.
- About, awards, courses, branches, student results, partnerships, facilities, news, gallery, admissions and privacy pages.
- Reusable detail routes for nine programs, four sourced locations, three recognition records and three news/guidance articles.
- Gallery filters and accessible native dialog, mobile navigation, keyboard tabs, reduced motion support.
- Eleven optimized WebP photographs from supplied sources; no stock institutional imagery.
- Server-validated inquiry API, Turnstile verification, Resend delivery adapter, honeypot and request limits.
- Independent Sanity Studio with structured editing and verification/rights/consent fields; server-side CMS adapter and five-minute revalidation.
- Metadata, canonical URLs, Open Graph, sitemap, robots, organization/course/breadcrumb structured data.
- Bengali introduction route with language markup and localization-ready CMS language fields. Full Bengali translation is not claimed.

## Content administration

See [operations](docs/operations.md). The bundled content is in `lib/content.ts` and `lib/research.json`. Sanity configuration lives in `cms/`. A real Sanity project and dataset must be connected before editors can publish remotely. Do not place private tokens in public variables.

## Vercel

Import this folder as the project root; framework Next.js, install `npm ci`, build `npm run build`, Node 22.x. `vercel.json` is supplied. Add the variables from `.env.example` in Vercel project settings. Deploy a preview first and verify it before connecting the production domain.

Leave `NEXT_PUBLIC_SITE_URL` unset for a noindex review deployment; on Vercel, canonical links use the generated deployment hostname. Set it to the approved production origin before public launch. Configure the corresponding Turnstile allowed hostname and verified email sender. Live admissions and CMS publication require the account configuration and acceptance checks in `docs/operations.md`.

## Evidence and handover

- [Research and verification ledger](docs/research.md)
- [Legacy audit and approval register](docs/audit.md)
- [Design system and reference analysis](docs/design-system.md)
- [Asset inventory](docs/asset-inventory.json)
- [Operational setup](docs/operations.md)
- [Verification record](docs/verification.md)
- [Deployment status and access blocker](docs/deployment.md)

The five-consecutive-year Country Top Performer statement is retained as HEXA’S-supplied information; the public branch source supports five-time recognition. Exact years are not invented. Network counts are omitted where sources conflict. Student results are attributed to Zindabazar and do not imply guaranteed outcomes. Photos of awards are never labelled as classrooms.
