# API-s3-storage-verify

- **ID:** T-0008
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · storage drivers, secrets/.env, file upload (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/s3-storage-verify/` · **Branch:** `feat/s3-storage-verify` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** docs/tasks/guest-photos.md
- **Depends on:** needs R2/S3 credentials from the owner
- **Touches:** apps/api/src/services/storage/*, config/env.ts

## Goal
The `s3` storage driver (R2/S3) was never run; only `local` is verified. Prove it before production uploads depend on it.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Upload, serve and delete work against a real bucket
- [ ] Cache headers and content-type on served files match the local driver
- [ ] Env vars and bucket policy documented; no secrets committed
- [ ] Decide and record: R2/S3 vs Drive (Drive thumbnails likely throttle at gallery scale)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
