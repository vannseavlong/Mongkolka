# Letters: thank-you and apology on one framed card

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared section and couple editor (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-letters-card/` · **Branch:** `feat/letters-card`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** owner's printed card image (this session)
- **Depends on:** none
- **Touches:** `packages/templates/src/sections/covenant/{Letters.tsx,letter-frame.tsx,text-logic.ts,strings.ts,*.test.ts}`, `apps/couple/src/features/website/components/letters-content-form.tsx`

## Goal
Both letters show together like the printed card, with built-in wording until the couple writes their own.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review (Khmer wording)  - [x] G11 changelog

## Done when
- [ ] Owner approves the Khmer and English wording
- [ ] Empty fields show the built-in text; the editor shows it in grey
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- `letters_paper_covenant` redesigned: notched double frame, both letters with lotus ornament; the signature, tape and ruled lines are gone. Arch and Script styles keep their look but now show the built-in apology too.
- Khmer wording typed from the owner's card image; English is a translation. Both need owner review.
- Templates 404/404, couple 91/91, web 14/14, typecheck and builds pass.
- Headless Chrome at 390px with the section added in the browser only: card renders in Khmer.
- Behaviour change: a couple who wrote only the thank-you now also sees the built-in apology.
- Not checked: English render, editor signed in, real phone. G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
