# Configurable image upload limits with WebP conversion

- **Repo:** Mongkolka (apps/api, apps/admin, apps/couple)
- **Owner:** SNLRLONG
- **Tier:** T3 · project signals: new sheet-db schema (`platform_settings`), new admin and couple endpoints, upload path; picked after the work was built, so the gates below were not run in order
- **Claimed by:** none (done)
- **Worktree:** removed · **Branch:** `feat/asset-upload-limits` (deleted) · **PR:** #3
- **Started / updated:** 2026-11-21 / 2026-11-21
- **Depends on:** none
- **Touches:** apps/api website-assets, platform-settings, multipart-upload middleware, config/env + database; apps/admin features/settings; apps/couple website asset library

## Goal
The 8 MB image limit was hardcoded in the API and the couple app, with no admin setting. Limits now come from env (`ASSET_MAX_MB`, `ASSET_MAX_DIMENSION`, `ASSET_MAX_PER_COUPLE`), an admin can override them in Admin > Settings, and the couple upload converts JPEG/PNG to WebP at quality 1.0 before upload.

## Gates
- [x] G1 scope  - [x] G2 static (api typecheck, couple/admin typecheck + eslint; api lint has one old unused import in scripts/seed-mock-couple.ts)  - [x] G3 tests (api: 33 pass, incl. platform-settings and limits tests)
- Skipped G4 run it: admin needs Google login; canvas WebP encoding not tried in a browser
- Skipped G5 code review, G6 security review: not run (T3 asks for both)
- [x] G7 docs: `.env.example` lists the new vars  - [x] G8 commit/PR  - [x] G11 changelog

## Dependency
No new package.

## Done when
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge
- [ ] `lsdb sync` run on the admin sheet (new `platform_settings` table) before using Admin > Settings
- [ ] G4, G5 and G6 run (see Follow-ups)

## Follow-ups
- Try one large JPEG, one transparent PNG and one rotated phone photo in the couple portal; Safari falls back to uploading the original.
- Run G5 and G6 on the merged diff.
- Settings changes have no audit trail (who changed what).
- The API buffers each upload in memory up to the max size; keep `ASSET_MAX_MB` reasonable on small instances.
