# Admin-firebase-hosting

- **ID:** T-0035
- **Repo:** apps/admin, apps/couple, apps/api (+ root firebase and render config)
- **Owner:** SNLRLONG
- **Tier:** T3 · release/deploy files, hosting release (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** removed · **Branch:** `feat/firebase-hosting` merged as #1 (3ead734), deleted locally
- **Started / updated:** 2026-11-01 / 2026-11-02
- **Docs:** none
- **Depends on:** API deployed (Render + DB) and its URL set as `NEXT_PUBLIC_API_URL` at build time
- **Touches:** render.yaml, apps/*/.env.production (local, gitignored), apps/admin/next.config.ts, apps/couple/next.config.ts, firebase.json, .firebaserc, root package.json scripts

## Goal
Serve admin and couple from Firebase Hosting (free Spark) as static exports on `admin-mongkolka.web.app` and `couple-mongkolka.web.app`, deployed from local. The API runs on Render free (`https://mongkolka-api.onrender.com`, Blueprint `render.yaml`, Sheets tokens via Secret File). Not covered here: web and vendor, see Follow-ups.

## Findings
- admin, couple: client-side JWT in localStorage, no middleware, route handlers, server actions or dynamic routes → `output: "export"` builds clean.
- couple root layout fetches the active theme at build time; with export it is baked in until the next deploy (no 60s revalidate).
- web: `/[slug]` renders couple sites per request (`cache: no-store`), `proxy.ts` rewrites wildcard subdomains, dynamic `marketplace/[vendorId]`, `templates/[templateId]`. Cannot be a static export → needs Blaze (Firebase App Hosting) or another host.

## Gates
- [x] G1 scope  - [x] G2 static (both `next build` pass)  - [x] G3 n/a  - [x] G4 run it (admin and couple answer HTTP 200 on `.web.app`, API `/health` ok; login flow not re-tested by the agent)
- [ ] G5 code review  - [ ] G6 security  - [x] G7 docs sync
- [x] G8 commit  - [x] G9 human review (PR #1)  - [x] G10 release plan  - [x] G11 changelog
Skipped G3: config-only, no logic. Skipped G5, G6: not run; deploy config only, no secrets committed (`.env.production` holds a public URL and is gitignored).

## Release plan (G10 draft)
- Deploy: `pnpm deploy:admin`, `pnpm deploy:couple` (needs `NEXT_PUBLIC_API_URL` exported for the build).
- Rollback: Firebase console → Hosting → site → previous release → Rollback.
- API must allow CORS from both `.web.app` origins.

## Follow-ups (not part of this task)
- Tasks/2-todo/API-render-hardening.md
- Tasks/2-todo/Web-vendor-firebase-hosting.md
- Tasks/1-backlog/Web-hosting-deploy.md

## Done when
- [x] admin and couple live on Firebase Hosting, API live on Render
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge
