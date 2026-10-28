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
- [x] G1 scope (one edit outside Touches: matchesSignature moved to utils/image-signature.ts, shared with guest-photos)  - [x] G2 static (typecheck+build pass; lint: 1 pre-existing error in scripts/seed-mock-couple.ts)  - [x] G3 tests (15/15, fakes)  - [ ] G4 run it (server and live sheet not run)
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

## Status 2026-10-28
Built in commit 68e1f38 on `feat/website-assets`, not merged. Contract: `/couple/api/website/assets` GET, POST (multipart `file`), DELETE `/:id[?force=true]`, GET `/:id/usage` (see agent report; copy into Docs before wave 3).
Not verified: real routes under auth, schema sync creating the `website_assets` tab (run on a non-production sheet), json content update behavior.
Known limits: quota lock is in-process (single instance only); listing reads all rows to count; Sheets write limit ~60/min.
Next: G5 and G6 by a fresh agent, then G9, G10, G11.

## Review 2026-10-28 (fresh agent, G5+G6)
No blockers. Should-fix, sent back to the builder: (1) 413 only after full body read, abort handling; (2) forced delete can overwrite a concurrent section edit; (3) cover_photo_url not covered by usage/strip. Nits: exact-string URL match only, no dimension cap, in-process lock (single instance), possible orphan on crash between put and create.
