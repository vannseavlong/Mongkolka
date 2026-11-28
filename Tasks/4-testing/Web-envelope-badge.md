# Envelope hero: couple sets the seal badge

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, couple editor and API validation (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-envelope-badge/` · **Branch:** `feat/envelope-badge`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `apps/api/src/utils/section-content.ts` + test, `packages/templates/src/sections/hero/{Envelope.tsx,envelope-logic.ts,envelope-styles.ts,*.test.ts}`, `packages/templates/src/types.ts`, `apps/couple/src/features/website/{components,workspace}/**`

## Goal
Business need: the couple chooses what the envelope seal says and its colours.
Contract: `PATCH /couple/api/website/sections/:id { content }` for `hero` also keeps `sealText` (max 8), `sealColor`, `sealTextColor` (`#rrggbb`), 400 otherwise. Empty = automatic. No schema or data change.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security (couple values rendered into CSS)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Badge text and colours editable; empty keeps today's look
- [ ] Saving a banner keeps the badge and the reverse
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Badge text and seal/letter colours on the Hero content tab, shown only for the envelope style.
- Templates 405/405, couple 91/91, web 14/14, API 306/306 (one earlier run had a single unidentified failure, then five clean runs); typecheck and builds pass.
- Headless Chrome at 390px, test values injected in the browser: default and custom badge render.
- Not checked: the editor signed in, a real save, real phone. G5 code review and G6 security not run.
- Release: the API must be live before saving, or the old API drops the badge fields.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, API 307/307, web and couple builds pass. In `4-testing` until the owner checks it live and the reviews run.
