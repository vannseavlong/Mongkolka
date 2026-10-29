# Web-grace-skeleton

- **ID:** T-0021
- **Repo:** packages/templates, apps/api seeds
- **Owner:** SNLRLONG
- **Tier:** T2 · registry, i18n and seed rows (auto picker) (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-skeleton), 2026-10-29
- **Worktree:** `Mongkolka/grace-skeleton/` · **Branch:** `feat/grace-skeleton`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, docs/tasks/template.md, docs/backend-schema.md
- **Depends on:** Web-section-keys-verse-footer, Web-grace-primitives
- **Touches:** packages/templates/src/registry.ts, packages/templates/src/i18n.tsx, packages/templates/src/sections/grace/*.tsx (stubs), apps/api/seeds/section-components.ts, apps/api/seeds/site-templates.ts

## Goal
Wire the whole Grace pack once, so the five section tasks only touch their own files.

- Stub components (themed placeholder with the right props) for: `opening_grace`, `hero_grace`, `verse_grace`, `story_grace`, `gallery_grace`, `details_grace`, `rsvp_grace`, `guestbook_grace`, `footer_grace`, each in its own file under `sections/grace/`, registered in `registry.ts`.
- `i18n.tsx` spreads the merged `grace/strings` index into `en` and `kh`.
- `section-components` seed rows for the nine ids (names, preview colors).
- `site_templates` seed row: `grace_blush`, "Grace Blush & Gold", slug `pink-gold-white`, description, default theme from the primitives task, `default_components` pointing at the Grace ids and the existing themed variants for registry (`registry_cards`), timeline (`timeline_vertical_line`) and music (`music_minimal`), `default_sections` if `API-template-default-sections` has landed, `status: inactive`.
- Nothing is run against live sheets; list the seed command for the owner.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean templates, api, couple, web; eslint grace/registry/i18n and api tests clean; next build web and couple compile)  - [x] G3 tests (API 58/58 incl. the new seed test; none for templates: no runner)  - [~] G4 run it (temporary static page and SSR script rendered all nine stubs, en and kh; real /templates, preview route and builder not opened)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] All nine ids resolve through the registry and render a stub in the builder preview
- [ ] String files are wired; the section tasks add no edits to registry.ts, i18n.tsx or seeds
- [ ] Template row is inactive in the seed
- [ ] Typecheck and build pass for templates, couple and web
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit 2ef2855 on `feat/grace-skeleton`, not merged. Nine stub components in `sections/grace/` (GraceOpening, GraceHero, GraceVerse, GraceStory, GraceGallery, GraceDetails, GraceRsvp, GraceGuestbook, GraceFooter; each with a `// STUB: replaced by <task>` comment, final props contract, themed placeholder), registered in registry.ts; i18n.tsx now spreads GRACE_EN/GRACE_KH (dictionary renamed baseDictionary; TranslationKey is `keyof base.en | grace.${string}`, so non-grace keys stay strict; `t` falls back to the key); one stub string key per section in each strings file; nine section_components seed rows; `grace_blush` template row (inactive; slug pink-gold-white; default_theme #fff3f6 / #4a2c35 / #8a6418; default_components as planned; default_sections opening, hero, verse, story, gallery, details, guestbook, rsvp enabled, registry, timeline, music disabled, footer last); new `apps/api/tests/grace-template-seed.test.ts`.
How later tasks plug in: each owns only its files in `sections/grace/` and `strings/`; keep the exported name and props; string keys must start with `grace.<section>.`; do not touch registry.ts, i18n.tsx or the seeds.
Not verified: real /templates, preview route, builder variant browser (template inactive, needs live API), clicking through the opening, seeding (the `default_sections` column comes from API-template-default-sections; Sheets json array acceptance unknown). No seed command was found or run; the usual one is `npx lsdb seed seeds/<file>.ts --upsert` from apps/api.
Next: G5 review, G7, G8, G11.

## Review 2026-10-29 (fresh agent, G5; tsc clean, API tests 58/58, eslint clean; build and a rendered page not run)
Verdict: not yet. BLOCKER: the nine grace_* section_components rows were seeded without `status`, so they default to `active`; /couple/api/website/catalog would list them to couples on ANY template (making the template inactive does not prevent this) and picking one would publish a placeholder section. Sent back: set all nine rows `inactive` and assert it in the seed test; the final Grace launch task flips the rows and the template to active together.
Should-fix sent back: the lsdb seeder silently DROPS a key not in the schema (default_sections) and `--skip-existing` never writes it later, so seed only after API-template-default-sections is deployed and synced, and use `--upsert`; i18n `?? key` hides missing translations (add a dev warning and an en/kh key parity check). Nits sent back: guard `couple` in Hero stub, assert each section_components row's section matches its key in default_components. Skipped: strings bundle size, slug reserved-list (practically fine).
Confirmed OK: stub props match the real components, opening stub keyboard operable, registry groups and ids, `default_sections` shape (12 keys, footer last), later tasks can edit only their own files; the web app is safe (registry only adds keys), the leak path was the catalog only.

## Fixes 2026-10-29 (commit aa7e95a)
Blocker fixed: all nine grace_* section_components rows are `status: "inactive"`; the seed export previously forced `status: "active"` over every row, now `{ status: "active", ...c }` so the new field is honored; the seed test asserts all nine rows and the grace_blush template are inactive. Release ordering written in a seed comment and a new docs/tasks/template.md section: deploy API-template-default-sections, run `lsdb sync`, then seed with `--upsert`. i18n warns once per language and key in non-production when a lookup falls back to the key; `graceKeyMismatches()` in strings/index.ts warns in dev when en and kh differ and an API test asserts no mismatches (first API-to-templates import: `../../../packages/templates/src/...`). Hero stub guards `couple`. Seed test asserts each row's `section` equals the key under which its id is used in default_components.
Results: tsc clean (templates, api, couple, web); eslint clean; API tests 61/61; next build web and couple compile.

## Merged to main 2026-10-29
Merged locally with --no-ff after review and fixes; combined typecheck (api, couple, web, admin, templates), API tests (96/96), couple lint (0 errors) and production builds of couple, web, admin and api pass. Moved to 4-testing, not 5-done: no tests for templates/couple/web (no runner), no fresh re-review of the fix commits, live schema sync and seeding not done and never run against a real sheet or a running app (see CHANGELOG Needs); G9/G10 for the T3 task.
