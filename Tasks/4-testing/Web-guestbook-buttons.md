# Guestbook form: "See all" in the editor, no action row

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared section and builder preview (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-guestbook-buttons/` · **Branch:** `fix/guestbook-buttons`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `packages/templates/src/sections/skinned/GuestbookSkin.tsx` + tests, `apps/couple/src/features/website/{preview,components/section-preview.tsx}`

## Goal
The builder preview shows "See all wishes & photos" as the live site does; Skin Guestbook drops the directions, calendar and share buttons and their heading.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Preview shows the see-all button
- [ ] No action row on the Skin Guestbook
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Action row and its heading removed from `guestbook_skin` (all templates using it); unused `guestbook-actions.ts` deleted. Grace guestbook unchanged.
- Builder canvas and style thumbnails now pass the guestbook page links.
- Templates 403/403, couple 91/91, web 14/14, typecheck and builds pass.
- Headless Chrome on `vutha-sonita`: only upload, send and the see-all link remain.
- Not checked: builder preview signed in. G5 code review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
