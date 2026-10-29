# Web-grace-gallery-details

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-gallery-details), 2026-10-29
- **Worktree:** `Mongkolka/grace-gallery-details/` · **Branch:** `feat/grace-gallery-details`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Gallery.tsx, grace/Details.tsx, grace/strings/gallery.ts, grace/strings/details.ts

## Goal
Replace the `GraceGallery` and `GraceDetails` stubs. Gallery: the couple's photos (`content.photos: string[]`) as gold-framed arch tiles on pink with tap-to-enlarge (lightbox with keyboard close, arrow keys, focus return); empty returns null; a broken image does not leave a broken tile. Details: ceremony and reception cards (time, venue, address), dress code, map link built safely from the address; missing fields omit their row.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (no runner for templates: pure helpers only)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Gallery with 1, 3, 12 photos and with a broken URL; lightbox open/close/next/prev by mouse, touch and keyboard, focus returns to the tile
- [ ] Details with all fields, with only the ceremony, and with none (renders nothing)
- [ ] Map link is URL-encoded and opens with rel noopener
- [ ] Responsive 320px to 1200px, English and Khmer
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
