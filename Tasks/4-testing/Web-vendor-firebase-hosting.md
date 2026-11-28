# Web-vendor-firebase-hosting

- **ID:** T-0037
- **Repo:** apps/vendor
- **Owner:** SNLRLONG
- **Tier:** T3 · release/deploy files, hosting release (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/vendor-firebase-hosting/` · **Branch:** `feat/vendor-firebase-hosting`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** Tasks/6-deploy/Admin-firebase-hosting.md
- **Depends on:** none (site `vendor-mongkolka` already exists; API is live)
- **Touches:** apps/vendor/next.config.ts, apps/vendor/src/app/(dashboard)/layout.tsx, firebase.json, .firebaserc, root package.json scripts

## Goal
Serve the vendor portal from `vendor-mongkolka.web.app` the same way as admin and couple (static export, free Spark).

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog
Skipped G3: config-only, no logic.

## Done when
- [x] Scan vendor for server-only features (middleware, route handlers, server actions, dynamic routes); scanned, none found. If any, split them out or host elsewhere
- [x] `output: "export"`, `images.unoptimized`, `vendor` target in firebase.json and `.firebaserc`, `deploy:vendor` script
- [ ] `apps/vendor/.env.production` has the API URL (done locally); `VENDOR_FRONTEND_URL` on Render already points here
- [ ] Deployed, vendor login works against the live API
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-28)
Built in the worktree, not committed, not deployed.
- Added to scope: a hard load of a vendor page redirected to Overview (token read as signed out during hydration). Same fix as couple.
- Static export, `vendor` hosting target, `deploy:vendor`, vendor added to `deploy:all`.
- G2: tsc, eslint, static build pass; bundle holds the live API URL, no localhost. G4 (dev server, stub API): /services and /profile stay on a direct load; signed out goes to `/`. Not run: the exported build in a browser, login against the live API.
- Open: G5, G6, G8, G10 approval, G11.
- G10 draft: deploy with `pnpm deploy:vendor`. The site is empty today, so rollback is `firebase hosting:disable --site vendor-mongkolka`. No API change.
- Overlap: Admin-datatable-header (T-0082) also edits the vendor layout, different lines. If vendor is deployed before it merges, the live site has the old page headers until the next deploy.

## Merged (2026-11-28)
Committed and merged to `main` (a50f0c7), not pushed. Owner asked for merge then deploy; the reviews had been flagged as not run. On merged `main`: tsc, lint (0 errors), tests (admin 15/15, couple 88/88) and the admin, couple, vendor builds pass.
Deploy not done: Claude Code's auto-mode check blocked `firebase deploy`. To run: `firebase deploy --only hosting:admin,hosting:couple,hosting:vendor` from the repo root, builds are in each app's `out/`.
Worktree and branch removed.

## Deployed (2026-11-28)
Owner ran the deploy. admin, couple and vendor respond 200 (last modified 00:08 UTC); vendor `/services` 200. Why still in `4-testing`: signed-in use of the live sites not checked, reviews not run.
