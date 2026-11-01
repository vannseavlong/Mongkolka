# Admin-firebase-hosting

- **ID:** T-0035
- **Repo:** apps/admin, apps/couple (+ root firebase config)
- **Owner:** SNLRLONG
- **Tier:** T3 · release/deploy files, hosting release (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude session, 2026-11-01
- **Worktree:** `Mongkolka-firebase-hosting/` · **Branch:** `feat/firebase-hosting`
- **Started / updated:** 2026-11-01 / 2026-11-01
- **Docs:** none
- **Depends on:** API deployed (Render + DB) and its URL set as `NEXT_PUBLIC_API_URL` at build time
- **Touches:** apps/admin/next.config.ts, apps/couple/next.config.ts, firebase.json, .firebaserc, root package.json scripts

## Goal
Serve admin and couple from Firebase Hosting (free Spark) as static exports on `admin-mongkolka.web.app` and `couple-mongkolka.web.app`, deployed from local. Web (`mongkolka.web.app`) is blocked: it needs a server (see below).

## Findings
- admin, couple: client-side JWT in localStorage, no middleware, route handlers, server actions or dynamic routes → `output: "export"` builds clean.
- couple root layout fetches the active theme at build time; with export it is baked in until the next deploy (no 60s revalidate).
- web: `/[slug]` renders couple sites per request (`cache: no-store`), `proxy.ts` rewrites wildcard subdomains, dynamic `marketplace/[vendorId]`, `templates/[templateId]`. Cannot be a static export → needs Blaze (Firebase App Hosting) or another host.

## Gates
- [x] G1 scope  - [x] G2 static (both `next build` pass)  - [ ] G3 n/a  - [ ] G4 run it (deployed site + login against live API)
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 commit  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog
Skipped G3: config-only, no logic.

## Release plan (G10 draft)
- Deploy: `pnpm deploy:admin`, `pnpm deploy:couple` (needs `NEXT_PUBLIC_API_URL` exported for the build).
- Rollback: Firebase console → Hosting → site → previous release → Rollback.
- API must allow CORS from both `.web.app` origins.

## Done when
- [ ] Both sites live and login works against the deployed API
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
