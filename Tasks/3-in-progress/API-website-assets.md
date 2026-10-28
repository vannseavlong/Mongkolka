# API-website-assets

- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · file upload, storage driver, new couple-sheet table (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (API-website-assets), 2026-10-28
- **Worktree:** `Mongkolka/website-assets/` · **Branch:** `feat/website-assets` 
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** none (release needs `API-s3-storage-verify` for production (or the Drive driver))
- **Touches:** apps/api/src/modules/website-assets (new), config/database table registration, services/storage (reuse only), Docs/backend-schema.md

## Storage rules (decided 2026-10-28, see plan)
- Never call the global `photoStorage()`. Go through `storageFor(coupleId)` (introduced here, returns the default local/s3 driver until `API-couple-drive-storage` adds Drive).
- Every storage key starts with the couple id: `couples/<coupleId>/assets/<assetId>.<ext>`.
- Keep all data-layer calls in the module's model file; the row stores only `asset_id`, `couple_id`, `storage_key`, `url`, `mime`, `size_bytes`, dimensions. This keeps a later move from Sheets to Postgres cheap.
- Return asset URLs as given by the driver; the frontend must not build URLs itself (Drive assets are served through a media proxy).

## Goal
Couple asset library API: list, upload (multipart, MIME allowlist, size and count limits), delete, and usage lookup (which sections reference an asset). Reuse `photoStorage()` and `ALLOWED_MIME`; follow config/controllers/models/modules/services/middlewares/utils layering.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] `website_assets` table in the couple sheet, documented in `Docs/backend-schema.md`
- [ ] Upload rejects wrong MIME, oversize, over-quota; filenames never trusted
- [ ] `GET /:id/usage` lists sections using the URL; delete with `force` strips the URL from those sections' content and invalidates `PublicSiteCache`
- [ ] Couple A cannot read or delete couple B's assets (test)
- [ ] Edge-case tests: concurrent uploads, delete of in-use asset, storage failure
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
