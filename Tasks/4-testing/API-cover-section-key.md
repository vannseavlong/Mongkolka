# API-cover-section-key

- **Repo:** apps/api + apps/admin + apps/couple + packages/templates (key list only)
- **Owner:** SNLRLONG
- **Tier:** T3 · sheet-db schema enum change, shared key list across 4 apps (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** none (user works in the main checkout)
- **Started / updated:** - / 2026-11-25
- **Docs:** `Tasks/_plans/Web-cover-section.md`, `docs/backend-schema.md`
- **Depends on:** none
- **Touches:** `packages/templates/src/types.ts`, `apps/api/src/utils/section-keys.ts`, `apps/api/src/modules/section-components/section-components.service.ts`, website_sections + section_components schema enums, `apps/admin/src/features/section-components/data/schema.ts`, `apps/couple/src/features/website/data/schema.ts`, `workspace/section-labels.ts`, `apps/api/tests/section-keys.test.ts`

## Goal
Add `cover` as a known section key, ordered before `opening`, everywhere the key list lives, so later tasks can build on it. No behaviour yet.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (`section-keys.test.ts` passes with `cover`)  - [ ] G4 run it (builder lists Cover)
- [ ] G5 code review  - [ ] G6 security (record n/a: no input, auth or personal data)  - [ ] G7 docs sync (`docs/backend-schema.md`)
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan (enum change on the live sheet: rollback = remove key)  - [ ] G11 changelog

## Done when
- [ ] `cover` is in every list above, before `opening`; label "Cover"; `canEditSection("cover")` is false
- [ ] Existing couples still load (a missing `cover` row is appended disabled by `listSections`)
- [ ] Root `CHANGELOG.md` entry added `[API]`

## Status (2026-11-25)
Built in the main checkout. G1 done. G2: api/couple/web/templates `tsc` pass (admin has an unrelated existing error in themes-action-dialog). G3: `apps/api` tests 152/152 incl. `section-keys.test.ts`; seed tests updated (cover is optional per template, listed before opening). G7: `docs/backend-schema.md` enums. Not done: G4 in a browser, G5, G6 (n/a: no input/auth/data), G10 (live sheet enum: run `lsdb sync` if the enum is enforced there), G8, G11.
