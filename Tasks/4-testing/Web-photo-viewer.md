# Photos: tap for full view with swipe; popping carousel

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, many sections, user images (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-photo-viewer/` · **Branch:** `feat/photo-viewer`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none. Overlap: Web-guestbook-intro also edits `site-renderer.tsx` (other lines).
- **Touches:** `packages/templates/src/{site-renderer.tsx,gallery-page.tsx,photo-zoom.tsx,sections/**}`

## Goal
Visitors tap any content photo to see it full screen and swipe between photos; the carousel brings the next photo forward from behind.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Gallery, guest photos, venue photo and map open full view; swipe works on a phone
- [ ] Builder canvas taps still select sections
- [ ] Reduced motion respected
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- One `PhotoZoom` viewer for galleries, guest photos, wish photos, venue photo and map; viewer follows the finger and pops the next photo in. `gallery_carousel` is now a stacked deck; masonry photos spring in.
- Templates 400/400, couple 91/91, web 14/14, web and couple builds pass; lint only the existing rule-not-defined error.
- Headless Chrome, emulated touch, 390px on `vutha-sonita`: masonry tap, swipe both ways, close, deck swipe, tap card behind, tap front card, map.
- Not zoomable on purpose: hero/cover backgrounds, decorations, KHQR.
- Not checked: real phone, builder canvas, guest wall pages, other templates in a browser. No unit test for the viewer wrapper. G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: same results; one import conflict in `site-renderer.tsx` with Web-guestbook-intro, both kept. Why in `4-testing`: real phone, builder, guest pages not checked, G5 code review not run.
