# Web-khmer-skin-fairytale

- **ID:** T-0055
- **Repo:** packages/templates (+ apps/api seeds)
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, seed rows (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude fork (fairytale skin agent), 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-skin-fairytale/` · **Branch:** `feat/khmer-skin-fairytale` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/02-fairytale-storybook-3d-video.md`
- **Depends on:** Web-khmer-core-sections (SkinOrnaments contract), Web-khmer-chrome, Web-khmer-skeleton
- **Touches:** `packages/templates/src/sections/fairytale/*`, own line in `sections/khmer/skin-ornaments.ts`, optional `Backdrop` hook in `skin-ornament-types.ts` + `OrnateSection.tsx` (tiny shared change), one line in `registry.ts` (`gallery_fairytale`), fairytale blocks in `apps/api/seeds/site-templates.ts` + `section-components.ts`

## Goal
`fairytale_storybook`: a storybook cover that page-turns and zooms into an original white castle, blue butterflies, hydrangea + baby's-breath frames, polaroid gallery with flower stickers. All artwork original SVG/CSS.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean; eslint only the existing missing `@next/next` rule definition on two `<img>` disable comments)  - [x] G3 tests (templates 74/74, api 142/142)  - [x] G4 run it (real SiteRenderer at 390px and 360px, EN + KH, temp harness removed)
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 commit  - [ ] G11 changelog

## Done when
- [x] Opening, hero, ornament set, backdrop, gallery skin, seeds (inactive)
- [x] KH + EN, keyboard (real buttons), 360px (no horizontal overflow); reduced motion implemented (cross-fade only) but not run in a browser
- [ ] Root `CHANGELOG.md` entry added (at merge); worktree and branch removed after merge

## Result (2026-11-22)
Branch `feat/khmer-skin-fairytale`, commit `281e4d4`, merged into `feat/khmer-einvite-integration`. Seeds stay `inactive`.
- Shared-file changes (tiny, additive): optional `Backdrop` in `SkinOrnaments` + `OrnateSection` (only renders when a skin supplies it), own line in `skin-ornaments.ts`, `gallery_fairytale` line in `registry.ts`.
- Template row: `registry: "registry_khqr"`, `gallery: "gallery_fairytale"`, chrome butterflies + dust + waves music icon (no bokeh discs).
- Gallery reuses the Grace lightbox and its `grace.gallery.*` strings.

## Not verified
Reduced motion in a browser; real devices (iOS Safari 3D page-turn, Android low-end performance); tablet/desktop pass; builder canvas; Khmer wording (native speaker); screen reader; real couple photos (sample photos only).
