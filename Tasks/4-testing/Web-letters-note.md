# Letters: nicer kbach ornament; no-alcohol note moves here

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared sections, couple editor and API validation (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-letters-note/` · **Branch:** `feat/letters-note`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none (Web-kbach-crest touches other files)
- **Touches:** `apps/api/src/utils/section-content.ts` + tests, `packages/templates/src/{types.ts,sections/covenant/{Letters.tsx,letter-frame.tsx,text-logic.ts,strings.ts,*.test.ts},sections/khmer/**}`, `apps/couple/src/features/website/{components/{letters,invitation}-content-form.tsx,lib/khmer-content.ts}`

## Goal
Business need: the ornament looks like Khmer art; the no-alcohol line closes the letters instead of sitting on the invitation.
Contract: invitation `content` no longer keeps `noticeKh/noticeEn/hideNotice`; letters `content` keeps `noteKh`, `noteEn` (max 200) and `hideNote`. Covenant letters show a built-in note when empty. Old invitation values are ignored; no migration.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review (artwork)  - [x] G11 changelog

## Done when
- [x] Note at the bottom of the letters, editable and hideable; gone from the invitation
- [ ] Owner approves the ornament
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- New `LetterOrnament` (lotus bud, flame leaves, tapered hairlines). No-alcohol line removed from the invitation (fields, logic, API) and added as a closing note in all three Covenant letter styles; built-in text matches the owner's saved wording, with brackets.
- Templates 407/407, couple 91/91, web 14/14, API 307/307, typecheck and builds pass.
- Headless Chrome at 390px on `vutha-sonita`: line gone from invitation, shown at the bottom of the letters.
- Old invitation `noticeKh/noticeEn` values stay in the sheet, ignored; the next invitation save removes them.
- Release: API first, or a custom note or the hide switch is dropped on save.
- Not checked: editor signed in, English view, Arch and Script styles in a browser. G5 code review and G6 security not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
