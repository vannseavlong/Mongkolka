# Web-builder-assets

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new UI for upload (API carries the T3 review) (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-builder-assets), 2026-10-28
- **Worktree:** `Mongkolka/builder-assets/` · **Branch:** `feat/builder-assets`
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** API-website-assets, Web-builder-workspace-variants
- **Touches:** apps/couple/src/features/website/components/asset-library*, asset-picker*, section-content-dialog.tsx (gallery/hero fields only)

## Goal
Asset tab in the section panel plus an asset picker used by gallery (multi-select, reorder) and hero cover. Upload with progress, delete with usage warning, quota display.

## Gates
- [x] G1 scope  - [x] G2 static (tsc, lint 0 errors, next build)  - [ ] G3 tests (no runner in apps/couple)  - [~] G4 run it (stub API; AssetPicker in the gallery dialog NOT opened)
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Upload (drag-drop and picker), progress, error and over-quota states
- [ ] Delete warns when an asset is in use and lists the sections
- [ ] Gallery and hero choose from the library; raw URL input still allowed as advanced option
- [ ] Live canvas updates as soon as an asset is picked
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit c3f05ed on `feat/builder-assets` (based on feat/builder-workspace), not merged. Assets tab (order 30, hero and gallery only via appliesTo), asset library (grid, drag-drop and picker multi-upload with per-file progress via XHR because lib/api.ts forces a JSON Content-Type, quota n/100, delete with in-use confirmation using ?force=true only when in use), AssetPicker modal, gallery and cover pickers, "Add photo by URL" kept as advanced. Gallery saves `photos: string[]` via patchSection; cover via PATCH /couple/api/profile.
Checked in this repo: couple-profile.service accepts any string for cover_photo_url when defined, so "Remove cover" sending "" is stored as an empty string (not null); the website-assets force-delete also writes "".
Not verified: real API (multipart, 413/409/502, quota-full), AssetPicker dialog opened in the browser, keyboard, phone width, true OS drag-drop. Tests deferred (no runner). XHR upload duplicates the API_URL fallback from lib/api.ts.
Next: G5 review, G3 decision, G7, G8, G11.

## Review 2026-10-28 (fresh agent, G5 + security pass; ran the app against a stub; did not run tsc/lint/build)
Not ready for testing until finding 1 is fixed. Verified fine: auth (Bearer token from localStorage, same as lib/api.ts; no cookies so no CSRF), status mapping for 400/409/413/415/502, uploads sequential, client limits match the server, AssetPicker in the gallery dialog works (opens nested, click-order append), delete dialog lists cover and sections, cover "" handled by the templates (falsy), no object-URL leaks, content dialog and Assets tab cannot overwrite each other (modal, mounted fresh).
Sent back: 1 skipped files spin forever after a 409 and Clear list never appears (busy never resets); 2 aria-disabled buttons look enabled (shared Button styles only `disabled:`); 3 delete decides `force` from stale cached usage and shows a generic "in_use" toast on 409; 4 picker appends duplicates of photos already in the form; 5 XHR has no timeout or abort, 12000 px limit not checked client side (a 413 may surface as network error), API_URL duplicated; 6 add-by-URL accepts any scheme (javascript:, data:); 11 non-unique tile labels.
Deferred: stale before-snapshot on rapid toggles (9), cover rollback when cache empty (7), phone layout beyond 500 px, keyboard pass (asked of the builder).
