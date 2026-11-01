# API-render-hardening

- **ID:** T-0036
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · hosting config, secrets/.env, storage drivers, CORS (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/api-render-hardening/` · **Branch:** `feat/api-render-hardening` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-11-02
- **Docs:** render.yaml, Tasks/6-deploy/Admin-firebase-hosting.md
- **Depends on:** needs R2/S3 credentials from the owner (see API-s3-storage-verify)
- **Touches:** apps/api/src/index.ts (CORS), apps/api/src/services/storage/*, render.yaml

## Goal
Make the free Render deploy safe for real users: it must not lose uploads on restart, accept calls only from our sites, and not feel dead after idling.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] `PHOTO_STORAGE=s3` (Cloudflare R2) set on Render; guest photos and builder assets survive a redeploy (finish API-s3-storage-verify first or together)
- [ ] CORS limited to the `.web.app` origins (and later the custom domain) instead of `cors()` open to all
- [ ] Free uptime pinger hitting `/health` about every 10 minutes (cold start is 30-60 s after 15 min idle)
- [ ] Google redirect URIs for the Render URL confirmed on the OAuth client, Google sign-in tested on admin and couple
- [ ] Sheets read quota checked under a few users at once (15 s cache is the only protection)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
