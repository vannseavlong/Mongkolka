# Web-khmer-kbach-template

- **Repo:** packages/templates (+ apps/api seeds)
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, new components, new catalog seed rows (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude session, 2026-10-26
- **Worktree:** none (built in main checkout, same deviation as Web-couple-builder-responsive; flagged to the user)
- **Started / updated:** 2026-10-26 / 2026-10-26
- **Docs:** docs/tasks/template.md
- **Depends on:** none
- **Touches:** packages/templates/src/sections/kbach (new), registry.ts, i18n.tsx, apps/api/seeds/site-templates.ts + section-components.ts

## Goal
A Khmer-ornament (ក្បាច់ខ្មែរ) wedding site template: ruby/ivory/gold palette, original SVG motifs (lotus, flame-scroll border, tiered pointed arch), arch-gate opening, arch photo hero, ornamental story and details. Reuses existing theme-driven components for the other sections.

## Gates
- [x] G1 scope  - [x] G2 static (tsc; eslint has the existing missing-plugin error)  - [ ] G3 tests (none exist for templates)  - [x] G4 run it (gallery preview at 390px, English only)
- [ ] G5 code review  - [ ] G6 n/a (no auth/data)  - [x] G7 docs sync
- [ ] G8 commit  - [ ] G11 changelog

## Done when
- [ ] Template appears in Admin catalog / gallery and builder, works in preview and public site
- [ ] Phone, tablet, desktop checked; English and Khmer
- [ ] Original artwork only (no copied illustrations)

## Seeded
Seeded to the live admin sheet with `lsdb seed --upsert`: 1 site template, 4 component rows (upsert also touched the existing rows).
## Not verified
Khmer language rendering, tablet/desktop visual pass, public site, builder with a real couple's photos.
