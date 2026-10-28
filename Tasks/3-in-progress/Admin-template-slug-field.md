# Admin-template-slug-field

- **Repo:** apps/admin
- **Owner:** SNLRLONG
- **Tier:** T2 · edits admin catalog form, depends on API contract (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Admin-template-slug-field), 2026-10-28
- **Worktree:** `Mongkolka/template-slug-field/` · **Branch:** `feat/template-slug-field`
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** API-template-catalog-apply
- **Touches:** apps/admin template catalog form and table

## Goal
Admin can set and edit a template's `slug` and `description`, sees a validation error for duplicates or reserved/invalid slugs, and gets a link to the template's live preview URL.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Slug and description fields in create/edit form with zod validation
- [ ] Server error for duplicate slug shown inline
- [ ] Preview link opens `<slug>.<ROOT_DOMAIN>`
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
