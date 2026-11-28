# Covenant: gold corners in front of the page

- **Repo:** Mongkolka (web, templates)
- **Owner:** SNLRLONG
- **Tier:** T1 · small visual change to one file (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-corners-front/` · **Branch:** `fix/corners-front`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Depends on:** none. `Web-style-patterns` touches the same file, so merge this first
- **Touches:** `packages/templates/src/ornament/kbach/KbachBackdrop.tsx`

## Goal
The corner ornaments sit above the content and the dock; the pattern stays behind. Taps pass through.

## Gates
- [x] G1 scope
- [x] G2 static: typecheck and lint of the file clean
- [x] G3 tests: templates 386/386
- [x] G4 run it: layering reproduced by DOM edit on live `/vutha-sonita` in a 390px frame (dock and hero). Built change, desktop and a real phone not checked
- [x] G8 commit message  - [x] G11 changelog

## Done when
- [x] Web deployed
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Merged and deployed (2026-11-28)
Merged to `main`, web and couple deployed. Live `/vutha-sonita` loaded in headless Chrome at 390px: front layer present, no errors, no sideways scroll. Not checked on a real phone.
