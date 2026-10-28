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
- [x] G1 scope  - [x] G2 static (tsc, lint, build pass)  - [ ] G3 tests  - [ ] G4 run it (app never run)
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Slug and description fields in create/edit form with zod validation
- [ ] Server error for duplicate slug shown inline
- [ ] Preview link opens `<slug>.<ROOT_DOMAIN>`
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit e905d22 on `feat/template-slug-field` (based on main), not merged. Edit mode added to the template dialog (admin only had create and delete); Slug column and Preview link; `src/lib/site-url.ts` and `.env.example` (`NEXT_PUBLIC_ROOT_DOMAIN`, force-added because admin ignores .env*). Column header "Preview" (swatches) renamed to "Theme".
Request bodies checked against the API branch controller (feat/template-catalog-apply): match. Description limit of 500 chars is the agent's choice.
Not verified: UI never run, 400/409 inline errors untested, no zod tests.
Must merge together with or after API-template-catalog-apply: admin create without slug returns 400.

## Review 2026-10-28 (fresh agent, G5; ran the admin app against a stub)
No blockers. Verified: PATCH body matches the API; slug lowercased and trimmed; reserved slug shown inline; list refreshes; legacy row without slug shows "Not set" and no preview link; template_id locked in edit.
Should-fix (sent back): editing a legacy row with partial or empty default_components fails zod validation silently (no message, no request). Also: non-slug 400/409 errors shown under the Slug field; add NEXT_PUBLIC_API_URL to .env.example.
Not verified by reviewer: create flow, duplicate-slug 409, short-slug message, description limit (the builder was asked to exercise these).
Deferred: close/reopen 500 ms timer race in dialogs (same pattern as delete dialog); duplicated site-url helper with apps/couple; description limit is client-only.
Deploy: must merge together with or after API-template-catalog-apply.
