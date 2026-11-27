# Web-gallery-stack

- **ID:** T-0074
- **Repo:** packages/templates, apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · edits shared template renderer and a content field read by the public site (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/web-gallery-stack/` · **Branch:** `feat/gallery-stack`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** none
- **Depends on:** none (no API change: the API already stores `/uploads/...` paths and adds the host on read)
- **Touches:** packages/templates site-renderer.tsx, types.ts, sections/covenant/gallery-logic.ts (+ new gallery-stack.ts); apps/couple website section-content-forms.tsx and a new gallery form

## Goal
1. "Photos shown on the invitation page" (`maxPhotos`) works for every gallery layout, not only Covenant.
2. A gallery section can stack several layouts (e.g. masonry then carousel), each with its own photo count.
3. The gallery form shows photo thumbnails and file names instead of raw API URLs.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it (QA harness page)
- [x] G5 code review  - [ ] G6 skipped (no auth/data/new endpoint)  - [ ] G7 docs sync
- [ ] G8 PR message  - [x] G11 changelog

## Done when
- [ ] maxPhotos honoured by Grid, Masonry, Carousel, Plates, Skin
- [ ] Stack of layouts renders on site and in builder preview
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
