# Map section: pin beside the name, directions button below the map

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared component (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-map-directions/` · **Branch:** `feat/map-directions`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `packages/templates/src/sections/covenant/{Map.tsx,covenant-more.test.ts}`

## Goal
The place name is smaller and sits on one line with its pin; a "Get directions" button below the map opens the saved maps link.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [x] Pin and name on one line at 390px; button under the map in both map styles
- [x] No button without a saved https link
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Templates 398/398, web and couple builds pass; lint has only the existing `no-img-element` rule-not-defined error.
- Headless Chrome at 390px on `vutha-sonita` data with a placeholder link injected in the browser only: name 15px on one line, button below the map.
- `vutha-sonita` has no maps link saved, so the button stays hidden there until one is added.
- Not checked: Postcard style in a browser, builder, real phone. G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 398/398, couple 91/91, web 14/14, couple and web builds pass. Why in `4-testing`: live button not seen with a real link, Postcard style and real phone not checked, G5 code review not run.
