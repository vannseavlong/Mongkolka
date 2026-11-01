# Web-vendor-firebase-hosting

- **ID:** T-0037
- **Repo:** apps/vendor
- **Owner:** SNLRLONG
- **Tier:** T3 · release/deploy files, hosting release (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/vendor-firebase-hosting/` · **Branch:** `feat/vendor-firebase-hosting` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-11-02
- **Docs:** Tasks/6-deploy/Admin-firebase-hosting.md
- **Depends on:** none (site `vendor-mongkolka` already exists; API is live)
- **Touches:** apps/vendor/next.config.ts, firebase.json, .firebaserc, root package.json scripts

## Goal
Serve the vendor portal from `vendor-mongkolka.web.app` the same way as admin and couple (static export, free Spark).

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog
Skipped G3: config-only, no logic.

## Done when
- [ ] Scan vendor for server-only features (middleware, route handlers, server actions, dynamic routes); not scanned yet. If any, split them out or host elsewhere
- [ ] `output: "export"`, `images.unoptimized`, `vendor` target in firebase.json and `.firebaserc`, `deploy:vendor` script
- [ ] `apps/vendor/.env.production` has the API URL (done locally); `VENDOR_FRONTEND_URL` on Render already points here
- [ ] Deployed, vendor login works against the live API
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
