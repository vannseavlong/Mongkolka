# Web-grace-skeleton

- **Repo:** packages/templates, apps/api seeds
- **Owner:** SNLRLONG
- **Tier:** T2 · registry, i18n and seed rows (auto picker) (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/grace-skeleton/` · **Branch:** `feat/grace-skeleton` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-29
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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] All nine ids resolve through the registry and render a stub in the builder preview
- [ ] String files are wired; the section tasks add no edits to registry.ts, i18n.tsx or seeds
- [ ] Template row is inactive in the seed
- [ ] Typecheck and build pass for templates, couple and web
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
