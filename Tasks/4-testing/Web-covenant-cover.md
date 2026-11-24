# Web-covenant-cover

- **Repo:** packages/templates (covenant) + apps/api seeds
- **Owner:** SNLRLONG
- **Tier:** T2 · new components, new catalog seed rows (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** none (user works in the main checkout)
- **Started / updated:** - / 2026-11-25
- **Docs:** `Tasks/_plans/Web-cover-section.md`, `docs/tasks/template.md`
- **Depends on:** API-cover-section-key (contract lets it run in parallel with Web-cover-sequence)
- **Touches:** `packages/templates/src/sections/covenant/` (Cover*.tsx, styles), `registry.ts` (2 ids), `apps/api/seeds/section-components.ts`, `apps/api/seeds/site-templates.ts` (Covenant default_sections / default_components)

## Goal
Two Covenant covers in gold/white/pink: `cover_covenant_butterflies` and `cover_covenant_garden` (flowers). Original SVG/CSS art, theme-driven colors, Khmer and English text, 390px and desktop.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (render + reduced motion)  - [ ] G4 run it (builder preview, both devices, EN and KH)
- [ ] G5 code review  - [ ] G6 n/a  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [ ] Both covers play, reveal and call `onReveal`/`onDone` per the contract; skippable; reduced-motion safe
- [ ] Seed rows added `inactive`; Covenant default_sections has `cover` first (enabled)
- [ ] Original artwork only
- [ ] Root `CHANGELOG.md` entry added `[Web]`

## Status (2026-11-25)
Built: `cover_covenant_butterflies` and `cover_covenant_garden` (original SVG/CSS), registered; 2 seed rows `inactive`; Covenant default_sections starts with `cover` (enabled) and default component butterflies. Render tests pass. Not done: G4 visual check (both devices, EN/KH), seeding to the live sheet (`lsdb seed --upsert`), G5, G8, G11.
