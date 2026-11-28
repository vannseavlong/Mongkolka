# Photo viewer: Back closes it

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared viewer, browser history (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-viewer-back/` · **Branch:** `fix/viewer-back`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** Web-photo-viewer (merged)
- **Touches:** `packages/templates/src/sections/grace/{gallery-lightbox.tsx,use-back-closes.ts}`

## Goal
With a photo full screen, the browser or phone Back closes the viewer and the visitor stays on the page.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [x] Back closes the viewer, same page and scroll position
- [x] Closing with X or Escape leaves no extra Back step
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- `useBackCloses` hook used by the shared viewer, so every gallery gets it.
- Templates 403/403, typecheck and lint of the new file clean, web and couple builds pass.
- Headless Chrome at 390px on `vutha-sonita`: Back after open and after swiping closes the viewer, same page and scroll; X leaves no extra entry; same on the all-photos page.
- Not checked: real phone back gesture, in-app browsers. No unit test (browser history behaviour). G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
