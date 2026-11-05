# Deployment status — 5 November 2026

The local production build succeeded. No Vercel deployment was created.

The connected Vercel integration listed the team but rejected project creation with HTTP 403: “You don’t have permission to create a project.” The supported Vercel CLI fallback, targeting the same team, returned “You do not have access to the specified account.” No alternative account or team was used.

To deploy, an authorized team member should import this project folder into Vercel (Next.js, Node 22.x, npm ci, npm run build), or connect an account with permission to create projects in the intended team. Follow README.md and operations.md for environment configuration. A deployment URL cannot be supplied until that access is available.

Before enabling admissions, connect the verified Resend sender, admissions inbox and Turnstile keys. Connect the intended Sanity project/dataset before remote editorial publication. Do not share secrets in chat; configure them in the hosting dashboard. Review the content approval register, approved production origin and privacy contact before public launch.
