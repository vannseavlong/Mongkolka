# Web-khmer-skin-kids

- **ID:** T-0056
- **Repo:** packages/templates (+ apps/api seeds)
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, new seed rows (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude fork agent, 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-skin-kids/` · **Branch:** `feat/khmer-skin-kids` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/06-kids-dragon-birthday.md`
- **Depends on:** Web-khmer-skeleton, Web-khmer-core-sections (merged in the integration branch)
- **Touches:** `packages/templates/src/sections/kids/**`, `sections/khmer/skin-ornaments.ts` (kids line), tiny additive `Backdrop` hook in `skin-ornament-types.ts` + `OrnateSection.tsx`, `registry.ts` (3 kids ids), kids blocks in `apps/api/seeds/site-templates.ts` + `section-components.ts`

## Goal
`kids_fantasy_birthday` skin (reference 06): original chibi mascots, pastel castle opening with sparkle burst, framed portrait hero, kids invitation with party countdown, party timeline, kids location card, own SkinOrnaments + backdrop art. Original SVG/CSS only.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates + api; eslint only the known missing `@next/next/no-img-element` definition)  - [x] G3 tests (templates 164 pass after merge, api seed tests 10 pass; new `kids.test.ts`, `kids-template-seed.test.ts`)  - [x] G4 run it (real SiteRenderer at 390px, EN and KH, chrome on)
- [ ] G5 code review  - [ ] G7 docs sync  - [x] G8 commit (f608ed3 on feat/khmer-skin-kids, merged as c1d6beb into the integration branch)  - [ ] G11 changelog

## Built
- `opening_kids`: storybook sky, castle, pixies carrying the ribbon, bubble-letter name, three original mascots (bunny princess, owlet in party hat, bear cub with cake) bobbing/blinking, sparkle burst + white flash + zoom exit; reduced motion opens at once; CTA carries `data-mk-open` so chrome starts the music.
- `hero_kids`: scalloped cookie frame, balloons, bunting, bunny fallback when no photo.
- New kids variants (registered, seeded inactive): `invitation_kids` (reads shared `InvitationContent`; `groom` = the child, `groom` parents = hosts), `agenda_kids` (party plan, kids icons, friendly default titles), `details_kids` (party + after-party cards, https-only map).
- `KIDS_ORNAMENTS` (bubble corners, star/heart divider, cookie-badge crest, 9 party icons, frosted surface, bubbly gradient heading) + `KidsSectionBackdrop` (clouds, blobs, dots, twinkling stars per section id).
- Seed: template points to the kids components and `registry_khqr`; 3 new section_components rows.

## Shared-file changes (small)
- Merge into integration: adopted the siblings' `Backdrop` contract (`BackdropProps`); added an optional `id?: string` to `BackdropProps` and passed it from `OrnateSection`. `registry.ts` (3 kids ids), `skin-ornaments.ts` (kids line).

## Not verified
- Real Fredoka face (offline; checked with a system rounded fallback), tablet/desktop, reduced-motion pass, iOS Safari, builder canvas, couple editor for the birthday meaning of `groom` fields, Khmer wording (needs native review).
- Preview sample content is the shared wedding sample (families, "wedding of their children", ritual agenda titles); the QA/launch task should add kids sample content.
- Pixies sit under the demo language toggle at the right edge (demo UI only).
