# Web-khmer-skin-sakura

- **ID:** T-0054
- **Repo:** packages/templates (+ apps/api seeds)
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, seed row edit (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude skin agent (sakura), 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-skin-sakura/` · **Branch:** `feat/khmer-skin-sakura` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/03-sakura-romance-2d-video.md`
- **Depends on:** Web-khmer-skeleton, Web-khmer-core-sections (merged)
- **Touches:** `packages/templates/src/sections/sakura/**`, one line in `sections/khmer/skin-ornaments.ts`, the `sakura_romance` block in `apps/api/seeds/site-templates.ts` (registry -> `registry_khqr`)

## Goal
Sakura Romance (reference 03) as a real, original skin: light-burst opening into a misty blossom hallway, blossom-garlanded portrait hero, its own ornament set (corner, divider, crest, nine ritual icons, gold-foil headings, stationery cards with hanging branches and a flower bed).

## What was built
- `Opening.tsx` + `opening-logic.ts`: pulsing gold monogram medallion, tap -> light burst -> white flash -> blossom hallway dolly -> fade -> `onOpen` (about 2.9s). Reduced motion skips straight in. One `<button data-mk-open>` (Enter/Space, primes music).
- `Hero.tsx`: gold-edged arch portrait wreathed in an SVG blossom garland, hanging branches, flower bed, doves, twinkles; monogram medallion when there is no photo; `heroPhoto` accepts only https or site-relative URLs.
- `ornaments/`: `SAKURA_ORNAMENTS` registered on the sakura line only. Cards carry the branches (top) and flower bed (bottom) as CSS custom properties defined once per accent (`SakuraArtStyle`).
- `art/`: seeded, deterministic SVG scene builders (branches 13 KB, bed 31 KB, garland 20 KB, hallway 29 KB); blossoms recolour from the theme accent; lavender, sage and gold foil are fixed identity colours.
- Seeds: sakura template uses `registry_khqr`. Everything stays `inactive`.

## Gates
- [x] G1 scope (edits only the sakura folder, one ornaments line, one seed value)
- [x] G2 static: `tsc` clean; eslint only the known missing `@next/next/no-img-element` rule definition (same disable comment as elsewhere)
- [x] G3 tests: templates 77/77 (new: palette contrast >= 3:1 for foil text, art determinism/size/no script, opening timeline, render of opening/hero in EN+KH, ornament registration); api 142/142
- [x] G4 run it: real `SiteRenderer` preview at 390px, EN and KH, chrome on: gate, burst/flash/hallway sequence, hero, invitation, agenda, details, gift, letters, guestbook, footer. Temp harness deleted.
- [ ] G5 code review (fresh reviewer)  - [ ] G6 n/a (no auth/data; art is static SVG, no user input rendered as HTML)  - [x] G7 docs: this file
- [ ] G8 commit message check  - [ ] G11 changelog

## Not verified
- Reduced-motion behaviour (code path only), iOS/Android Safari, tablet and desktop widths, anything under 345px.
- Khmer wording needs a native speaker.
- Real photo with a real couple; music playback on tap (no audio source in the harness).
- Performance on low-end phones (particles are the chrome's, art is static; branch + bed custom properties ~45 KB of CSS per accent).

## Gaps found (not fixed here, outside the skin contract)
- `gallery_masonry`, `guestbook_wall`, `footer_classic` are generic existing components and look flat next to the skin. `gallery_grace`/`guestbook_grace` were rejected: their dividers and sections draw a Christian cross. A shared Khmer gallery/guestbook skin (using `SkinOrnaments`) is the right follow-up.
- Hero bottom blends into the next section but a faint tone step remains (section glow is not skin-controlled).
- Light-burst rays are subtle at the start; the glow reads, the rays barely do.

## Done when
- [ ] Skin looks right on a real couple's data in preview and public site
- [ ] Root `CHANGELOG.md` entry added; worktree and branch removed after merge
