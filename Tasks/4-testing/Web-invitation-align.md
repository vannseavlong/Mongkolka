# Invitation: align groom and bride names

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared component (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-invitation-align/` · **Branch:** `fix/invitation-align`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `packages/templates/src/sections/khmer/Invitation.tsx`

## Goal
Son and daughter labels and names sit on the same line on both sides, whether a side has two parents, one or none.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [x] Names aligned in Khmer and English with 2, 1 and 0 parents on a side
- [x] Checked at 360px
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Both family columns share two rows (CSS subgrid); a lone parent line is centred against the other side's lines.
- Templates 396/396, typecheck and lint of the file clean, web build passes (second attempt).
- Seen: the component rendered with the built web CSS in 360px columns, Khmer and English, parents 1/2, 0/2, 2/0. Default skin only, not Covenant, not the live builder.
- Browsers without subgrid (Safari before 16, Chrome before 117) keep the old layout.
- No new test: layout only. G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 396/396, couple 91/91, web 14/14, couple and web builds pass. Why in `4-testing`: not seen with the Covenant design on a live site, G5 code review not run.
