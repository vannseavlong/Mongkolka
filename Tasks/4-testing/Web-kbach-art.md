# Web: Khmer ornament artwork and preview

- **Repo:** web
- **Owner:** SNLRLONG
- **Tier:** T2 · shared template component, new visual feature (auto picker)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-kbach-art/` · **Branch:** `feat/kbach-art`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-khmer-backdrop.md
- **Depends on:** owner answers to the plan's open questions
- **Touches:** `packages/templates/src/ornament/kbach/` (new)

## Goal
Medallion lattice, lotus band and vine corner as theme-coloured SVG components.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [ ] G4 run it (partial, below)
- [ ] G5 code review: not run; owner asked to commit and deploy  - [ ] G7 docs sync  - [x] G8 commit message  - [x] G11 changelog
- G6 not needed: no auth, data or user input

## Done when
- [ ] Owner approves the motifs and strength on a preview
- [ ] Repeat has no visible seams; ids unique when used many times
- [ ] Decorative only (aria-hidden, no pointer events)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress 2026-11-27 
- Built here: ornament, `KbachPage` fixed backdrop on Covenant, venue card beside the map (this also covers Web-kbach-backdrop).
- Checked: 385 template tests, web build, live data locally at desktop and 360px (invitation and map). Not checked: iPhone, builder preview, every section at 360px, template thumbnails. Code review not run.
- The builder canvas and thumbnails deliberately show no pattern.
- Owner approved the map and chose an animated WebP upload (`stock-image/`, not in git). Open: upload it and rename the venue in the couple portal.
