# Web-skinned-sections-media

- **ID:** T-0058
- **Repo:** packages/templates, apps/api seeds
- **Owner:** SNLRLONG
- **Tier:** T2 · new shared components, extends the shared SkinOrnaments contract (auto picker). Stayed T2: no `apps/api` guest-photo or storage code touched, only seed rows and a seed test.
- **Claimed by:** Claude session (agent B), 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-skinned-sections-media/` · **Branch:** `feat/skinned-sections-media`
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** user direction in chat (look/style/design concept of the reference, not its page structure); `Tasks/_plans/Web-khmer-einvite-templates.md`
- **Depends on:** Web-khmer-core-sections, the six skin tasks (all merged into `feat/khmer-einvite-integration`)
- **Touches:** `packages/templates/src/sections/skinned/` (Gallery*, Guestbook*, gallery-*, guestbook-*), `<skin>/media.tsx` + one line in each `<skin>/ornaments`, `khmer/skin-ornament-types.ts` (additive), `registry.ts` (2 ids), `apps/api/seeds` (2 rows + `gallery`/`guestbook` lines of the six Khmer template blocks), `apps/api/tests/skinned-media-seed.test.ts`

## Goal
Gallery and guestbook that wear each skin's design instead of the generic look: `gallery_skin` and `guestbook_skin`, rendered through the active skin's ornaments. Same data and contracts as before (gallery `{photos}`; guestbook `GuestbookData` / `onSubmit` / pending-approved result as the Grace guestbook).

## What was built
- **Contract (additive, optional):** `SkinOrnaments.media?: SkinMedia` = `Frame` (draws the whole decorative frame), `aspect`, `tilt`, `note`, `field`, `button`, `fontFamily`, `cardPad`. A skin without `media` gets a neutral gold frame.
- **Layers (AGENTS.md):** logic in `gallery-layout.ts`, `gallery-tones.ts`, `guestbook-wall-logic.ts`, hooks `gallery-state.ts`, `guestbook-form.ts`, `guestbook-actions.ts`; UI in `GallerySkin.tsx`, `GuestbookSkin*.tsx`, `gallery-section.tsx`, `guestbook-card.tsx`; the viewer reuses `GraceLightbox` (no cross artefact; strings are the shared `grace.gallery.*` / `grace.guestbook.*` keys).
- **Per skin (`<skin>/media.tsx`, original SVG/CSS):** emerald gold-pinstriped plates with art-deco corners and diamond plaque; garden arch window with rose, bud and leaf sprays; cream watercolour oval with peony sprigs on the arc; sakura blossom-bordered keepsake with petal mat; fairytale polaroids with flower stickers (ported from `gallery_fairytale`, which stays registered); kids candy-ring stickers with star and heart, rounded font.
- **Seeds:** `gallery_skin` and `guestbook_skin` rows (inactive); the six Khmer templates select them for `gallery` and `guestbook`. No other template changes.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates and api; eslint only the known missing `@next/next` rule definition on `<img>` disable comments, same as the other skins)
- [x] G3 tests: templates 216/216 (new: layout, wall logic, tones incl. 4.5:1 button label contrast for every template accent, render of both sections for 6 skins x EN/KH, distinct frames, no Grace cross, empty returns nothing); api 148/148 (new `skinned-media-seed.test.ts`)
- [x] G4 run it: rendered each skin's gallery and guestbook through the real `TemplatePreview`/`SiteRenderer` path in Chrome at phone width (about 360 to 430px), saw all six galleries and guestbooks, Khmer form for kids and a keyboard pass of the viewer (Tab, Enter opens, ArrowRight, Escape closes, focus returns to the tile). Fixed from that pass: cream sprigs off the oval, kids heart over wish text, fairytale sticker over the guest name, kids label font, sakura form under its branches. Temp page and dev server removed.
- [ ] G5 code review  - [ ] G6 n/a (no auth/data/new endpoint; guest photo flow reused unchanged)  - [x] G7 docs sync (nothing in contract docs changed)
- [ ] G8 commit (local commit made, see below)  - [ ] G11 changelog (at merge to `main`)

## Not verified
- Real iOS and Android devices, tablet and desktop widths, the builder canvas.
- Reduced motion in a browser (CSS rules only; hover lift and transitions are turned off by media query).
- Submitting a real photo (file picker and upload were not exercised; the form logic mirrors Grace and is covered by type and render tests only).
- Khmer wording (shared strings; needs a native speaker); real fonts (offline dev server).
- Only the gallery viewer was keyboard-tested; the form fields were not tab-walked in a browser.
- The wall with many items or very long names; a dark recolour of the light skins.

## Done when
- [x] Six skins frame photos distinctly and style the guest form
- [ ] Root `CHANGELOG.md` entry added (at merge to `main`)
- [ ] Worktree and branch removed after merge
