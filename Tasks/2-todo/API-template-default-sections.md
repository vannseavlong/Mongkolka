# API-template-default-sections

- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · changes what data couples receive when they pick a template, admin-sheet schema field (auto picker) (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/template-default-sections/` · **Branch:** `feat/template-default-sections` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, docs/tasks/template.md, docs/backend-schema.md
- **Depends on:** Web-section-keys-verse-footer (same service file)
- **Touches:** apps/api/schemas/admin/site_templates.ts, apps/api/src/modules/site-templates (service, model, controller), apps/api/src/modules/couple-website/couple-website.service.ts (selectTemplateUncached, reset_all), apps/api/seeds/site-templates.ts, docs/backend-schema.md, docs/tasks/template.md

## Goal
Let a template define its section order and which sections are on by default.

- `site_templates.default_sections`: json array of `{ section_key, enabled }`; null means today's behavior (all section keys in the fixed order, all enabled).
- First template pick for a couple creates `website_sections` rows in that order with those enabled flags. Keys missing from the list are created disabled at the end.
- `mode: reset_all` also resets `display_order` and `enabled` from the template; `keep_content` still leaves order and enabled flags alone (unchanged behavior, document it).
- Validate keys against the known list; ignore unknown keys.
- Seed-only for now (no admin UI); public by-slug response unchanged.
- Run only against mocks in tests; schema sync and the seed update on the live sheet are release steps for the owner.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Couple with no sections picks a template with default_sections: rows follow the order and flags
- [ ] Null default_sections keeps today's behavior (test)
- [ ] reset_all resets order and enabled; keep_content does not (tests)
- [ ] Partial write failure leaves the previous state (same pattern as the existing apply)
- [ ] Release plan lists schema sync and rollback
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
