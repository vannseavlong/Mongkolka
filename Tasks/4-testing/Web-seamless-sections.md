# Covenant: remove the dividers between sections

- **Repo:** Mongkolka (web, templates)
- **Owner:** SNLRLONG
- **Tier:** T1 · small visual change to one file (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-seamless/` · **Branch:** `fix/seamless-sections`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Depends on:** none
- **Touches:** `packages/templates/src/ornament/kbach/KbachPage.tsx`

## Goal
No visible separator from one section to the next: drop the lotus border (Invitation, Map, Guestbook) and the section tint that leaves a hard edge.

## Gates
- [x] G1 scope
- [x] G2 static: typecheck and lint of the file clean
- [x] G3 tests: templates 386/386
- [x] G4 run it: same CSS injected into the live `/vutha-sonita` at 1200px and in a 390px frame. The built change itself and a real phone not checked
- [x] G8 commit message  - [x] G11 changelog

## Done when
- [x] Web deployed
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Merged and deployed (2026-11-28)
The first web build after the merge failed and a piped command let the deploy run with the old `out/`. A forced rebuild passed (cause of the first failure not captured) and web was redeployed. Live `/vutha-sonita` at desktop width: 0 of 11 sections have a border or tint.
Why still in `4-testing`: not checked on a real phone.
