# Monogram badge in kbach art; footer reads the invitation monogram

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, renderer (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-kbach-crest/` · **Branch:** `feat/kbach-crest`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `packages/templates/src/{site-renderer.tsx,sections/covenant/{ornaments.tsx,kbach-crest.tsx,*.test.ts},sections/skinned/FooterSkin.tsx}`

## Goal
The Covenant monogram badge carries Khmer kbach ornament, and the footer shows the same monogram as the invitation.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review (artwork)  - [x] G11 changelog

## Done when
- [ ] Owner approves the artwork
- [ ] Footer shows the invitation monogram, or initials when none is typed
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- New `KbachCrest` replaces the Covenant crest everywhere Covenant uses it (invitation, footer, guestbook empty state).
- Footer takes the invitation monogram from the renderer. In the builder's single-section mode the footer still shows initials (the invitation is not in that view).
- Templates 407/407, couple 91/91, web 14/14, typecheck and builds pass. No new test for the monogram hand-over.
- Headless Chrome at 390px on `vutha-sonita`: both badges read "វ&ស".
- Not checked: other colour themes, Latin monogram, real phone. G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
