# API-template-default-sections

- **ID:** T-0019
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · changes what data couples receive when they pick a template, admin-sheet schema field (auto picker) (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (API-template-default-sections), 2026-10-29
- **Worktree:** `Mongkolka/template-default-sections/` · **Branch:** `feat/template-default-sections`
- **Started / updated:** 2026-10-29 / 2026-10-29
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
- [~] G1 scope (outside Touches: new apps/api/src/utils/section-keys.ts holding the SECTION_KEYS list moved out of couple-website.service to avoid a circular import; tests; drift-test edit)  - [x] G2 static (tsc, eslint src+tests, pnpm build 5/5)  - [x] G3 tests (API 86/86, 30 new, mocks only)  - [ ] G4 run it (never against a real sheet, server not started)
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

## Status 2026-10-29
Built in commit bcfc790 on `feat/template-default-sections`, not merged. `site_templates.default_sections` nullable json `[{section_key, enabled}]`: strict validation on admin create/update (400 on non-array, unknown key, non-boolean enabled, duplicates; [] and null stored as null), lenient read (drops bad items; JSON string accepted). First pick with default_sections and no sections: rows in list order with the flags, missing keys appended disabled. reset_all with default_sections also resets display_order and enabled (omitted keys go disabled at the end); reset_all with null default_sections and keep_content unchanged. Owner decision made by the builder: under keep_content with default_sections set, a key the couple lacks is appended DISABLED (matches listSections); with null it is appended enabled as today. Catalog `getCatalog` now returns default_sections (normalised); public by-slug allowlist unchanged (test checks). selectTemplateUncached gained an optional 4th parameter (template row).
Release plan (from the builder): 1 schema sync for the admin `site_templates` sheet (new nullable json column) before or with the deploy; 2 deploy and sync first, then seed/update the Grace row that carries default_sections; 3 rollback = revert the commit (extra column harmless; empty the cell if a bad value is the problem); 4 existing couples unchanged for templates without default_sections (all today); 5 spot-check one fresh Grace pick and one reset_all on a test couple, and that the catalog returns the field and by-slug does not.
Not verified: real sheets (json column round trip as array vs string, update with null), live app run, client use of the new catalog field.
Next: G5 strict review, G6 security, G9, G10, G11.
