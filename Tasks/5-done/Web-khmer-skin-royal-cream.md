# Web-khmer-skin-royal-cream

- **ID:** T-0053
- **Repo:** packages/templates, apps/api seeds
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, seed rows; one tiny shared edit (`Backdrop` slot in the skin-ornament contract + OrnateSection) (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude skin agent (royal_cream), 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-skin-cream/` · **Branch:** `feat/khmer-skin-cream` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/04-royal-cream-web-heng-theary.md`
- **Depends on:** Web-khmer-core-sections, Web-khqr-gift, Web-khmer-review-fixes (all merged in the integration branch)
- **Touches:** `packages/templates/src/sections/cream/**`, `sections/khmer/skin-ornaments.ts` (own line), `sections/khmer/skin-ornament-types.ts` + `OrnateSection.tsx` (optional `Backdrop` slot, tiny), `apps/api/seeds/site-templates.ts` (royal_cream block only)

## Goal
The Royal Cream & Gold skin: envelope opening (seal, flap, card rises), floral oval-arch hero with butterflies, its own SkinOrnaments (blush medallion ritual icons, floral corner and divider, shield crest, parchment surface, calligraphic gold headings, watercolour backdrop for every shared section). All artwork original SVG/CSS.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean; eslint only the known missing `@next/next` rule on the `<img>` disable comment)  - [x] G3 tests (templates 111/111 and api 142/142 on the integration branch; 17 new cream tests)  - [x] G4 run it (390px iframe harness, KH + EN, opening played, hero, invitation, agenda, details checked; no console errors, no horizontal overflow)
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 commit  - [ ] G11 changelog

## Done when
- [x] Opening, hero, ornaments, strings, seed block done; English and Khmer; reduced-motion safe
- [x] Looked at in a browser at 390px, KH and EN
- [ ] Root `CHANGELOG.md` entry added; worktree and branch removed after merge

## Result (2026-11-22)
Commits: `f1703ac` on `feat/khmer-skin-cream`, merged as `1f7f338` into `feat/khmer-einvite-integration` (conflicts in `skin-ornaments.ts` and `OrnateSection.tsx` resolved by keeping every skin's line and the sibling's `Backdrop {color, ground}` slot; cream's backdrop adapted to it).
Seed: `royal_cream` block uses `registry_khqr` and particles butterflies + petals; stays inactive.

## Not verified
- Real fonts (Moul, Battambang, Great Vibes, Cinzel): the dev server had no network and used mocked Google fonts, so headings fell back to system fonts. Check with real fonts before launch.
- Khmer wording (guest label, kicker) needs a native speaker.
- Reduced-motion mode (logic is covered by CSS media query and an `onOpen` shortcut, not exercised in a browser), iOS/Android Safari (3D flap `backface-visibility`), tablet/desktop widths, builder canvas, real guest name from a real link.
- Gallery, gift, guestbook and footer sections were only themed, not restyled by this skin.
- G5 code review, G8 PR message, G11 changelog still open.
