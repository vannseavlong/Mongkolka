# Invitation: roomier date block and a no-alcohol line

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared section, couple editor and API validation (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-invitation-notice/` · **Branch:** `feat/invitation-notice`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none. Overlap: Web-envelope-badge also edits `section-content.ts` and `types.ts` (other lines).
- **Touches:** `apps/api/src/utils/section-content.ts` + test, `packages/templates/src/{types.ts,sections/khmer/**}`, `apps/couple/src/features/website/{components/invitation-content-form.tsx,lib/khmer-content.ts}`

## Goal
Business need: the date block is easy to read and guests see there is no alcohol.
Contract: invitation `content` also keeps `noticeKh`, `noticeEn` (max 200) and `hideNotice` (boolean). Covenant shows a built-in line when empty; other templates show only the couple's own text. No schema or data change.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review (wording)  - [x] G11 changelog

## Done when
- [ ] Line shows under the time; can be changed or hidden
- [ ] Date block readable at 360px
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Date block: more space between lines, lunar date slightly larger, looser and balanced.
- Notice line under the time with Khmer and English fields and a hide switch in the invitation editor.
- Templates 404/404, couple 91/91, web 14/14, API 306/306, typecheck and builds pass.
- Headless Chrome at 390px on `vutha-sonita` (Khmer): line shows under the time.
- Not checked: English view, editor signed in, a real save, 360px, real phone. G5 code review and G6 security not run.
- Release: API first, or a custom line or the hide switch is dropped on save.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
