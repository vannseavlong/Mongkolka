# Web-khmer-skin-royal-garden

- **ID:** T-0052
- **Repo:** packages/templates (+ apps/api seeds)
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, new seed rows (auto picker, see `PIPELINE.md`)
- **Claimed by:** none (built and merged into feat/khmer-einvite-integration, 2026-11-22)
- **Worktree:** `Mongkolka/mongkolka-khmer-skin-garden/` · **Branch:** `feat/khmer-skin-garden` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/01-royal-garden-lily-of-the-valley.md`
- **Depends on:** Web-khmer-core-sections (SkinOrnaments contract), Web-khmer-skeleton
- **Touches:** `packages/templates/src/sections/garden/*`, `sections/khmer/skin-ornaments.ts` (own line only), `apps/api/seeds/site-templates.ts` (royal_garden block), `apps/api/seeds/section-components.ts` (garden rows)

## Goal
`royal_garden` skin: ivory / champagne gold / dusty pink / sage, original wrought-iron gold gate opening (CSS 3D), fountain court reveal, arch frames, climbing roses, petals + doves, own SkinOrnaments set.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean; eslint only the known missing @next/next plugin on the <img> disable comment)  - [x] G3 tests (garden.test.ts 16 tests; templates 127/127; api 142/142 on rerun, one flaky first run)  - [x] G4 run it (real SiteRenderer via temp harness at ~375-430px, EN + KH, deleted)
- [ ] G5 code review  - [ ] G7 docs sync  - [x] G8 commit (local, d355803 + 6964eeb)  - [ ] G11 changelog

## Done when
- [ ] Original artwork only (no copy or trace of the reference)
- [ ] English + Khmer, reduced motion, keyboard, 360px
- [ ] Seeded inactive

## Result
Opening: wrought-iron gold gate (3D leaf swing) over a veiled fountain court, arched cartouche with laurel crest, guest greeting, `data-mk-open` CTA; reveal line, doves, fade, then onOpen (reduced motion opens at once). Hero: arch frame under a rose garland, lily-of-the-valley at the feet, climbing roses, doves. Ornament set `GARDEN_ORNAMENTS` (rose-spray corner, floral divider, laurel crest, nine garden line icons, double-gold-line surface, foil heading, vine/hedge section backdrop). Seed: `royal_garden` uses `registry_khqr`, music icon `waves`, still inactive.

Shared edits (tiny): `OrnateSection.tsx` + `skin-ornament-types.ts` got the optional `sectionBackground` hook (a sibling skin added the same one; merged to a single copy); `emerald.test.ts` assertion relaxed (it assumed other skins stay on the default set).

## Not verified
Reduced-motion run in a browser, real iOS/Android Safari (3D gate, backdrop-less), tablet/desktop widths (stage is capped to 520px), below 345px, Khmer wording by a native speaker, couple recolour to a dark theme in a browser (unit-tested only), console on page load (tracking started late).
