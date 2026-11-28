# Guestbook: the couple edits the description

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, couple editor and API validation (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-guestbook-intro/` · **Branch:** `feat/guestbook-intro`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `apps/api/src/utils/section-content.ts` + test, `packages/templates/src/{section-titles.ts,section-titles.test.ts,site-renderer.tsx}`, `apps/couple/src/features/website/{components,lib}/**`

## Goal
Business need: the couple writes the line under the guestbook heading, in Khmer and English.
Contract: `PATCH /couple/api/website/sections/:id { content }` for `guestbook` keeps `introKh`, `introEn` (strings, max 300), drops other keys, 400 when too long or not a string. Empty = template wording. Public site already returns `content`. No schema or data change.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security (couple text rendered to guests)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Description editable and shown in builder preview and public site
- [ ] Empty fields keep the template wording
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Description fields (Khmer, English) on the Guestbook section's Content tab, for all four guestbook styles.
- Templates 401/401, couple 91/91, web 14/14, API 305/305; typecheck clean, web and couple builds pass.
- Headless Chrome, `vutha-sonita` data with a test description injected in the browser: the page shows it.
- Not checked: the editor form signed in, a real save, narrow width. G5 code review and G6 security not run.
- Release: API first (Render), then web and couple.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 403/403, couple 91/91, web 14/14, API 305/305, builds pass. API deploys on Render from `main`. Why in `4-testing`: editor not checked signed in, no real save yet, G5 code review and G6 security not run.
