# Admin-datatable-header

- **ID:** T-0082
- **Repo:** apps/admin, apps/couple, apps/vendor, packages/ui
- **Owner:** SNLRLONG
- **Tier:** T2 · edits every admin page, one screen rebuilt on the shared DataTable (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-admin-datatable-header/` · **Branch:** `feat/admin-datatable-header`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Depends on:** none (scope grew 2026-11-28: owner asked for the same header on all portals)
- **Touches:** apps/admin/src/features/*/index.tsx, apps/admin/src/features/assist-requests/, apps/admin/src/components/layout/, apps/admin/src/app/(dashboard)/layout.tsx

## Goal
Help requests as a data table (status filter, actions in a row dropdown). Every admin page shows its title in the top bar beside the sidebar toggle.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog
- Skipped G6: no change to auth, endpoints or what is sent; the token handling in open-editor is untouched.

## Done when
- [x] Table with status filter, couple search, row action dropdown, same actions and confirmations as before
- [x] Loading, empty, error, no-permission states; 360px check
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-28)
Built in the worktree, not committed.
- Help requests: DataTable replaces tabs and cards; status filter now lists all six statuses; new `lib/request-rows.ts`.
- New `components/layout/page-header.tsx`; every dashboard page uses it, and `Main` is `fluid` so content lines up with the title.
- G2: tsc, eslint, next build pass. G3: 15/15 admin tests.
- G4 (Chrome, throwaway in-memory stub): list, status filter, row menu, accept, decline dialog opens, open editor, end access, empty, 403, 500, 360px (in a frame), Themes header with action button.
- Not checked: submitting a decline, couple-name search typing, loading skeleton, Load older, real API, pages other than Help requests, Themes and Section components in the browser.
- Open: G5 (needs a reviewer that did not write the code), G7, G8, G11 (at merge).

## All portals (2026-11-28)
- Shared `packages/ui/.../layout/page-header.tsx` (`HeaderSlot`, `HeaderContent`, `PageHeader`) replaces the admin-only header and couple's `header-slot`. All three layouts and every dashboard page use it; `Main` is `fluid`.
- G2: tsc and build pass for the three apps; lint 0 errors (3 existing warnings in couple). Tests: admin 15/15, couple 88/88.
- G4 (stub API): couple Overview, Guests, Budget, Milestones, Profile, Builder, Guestbook; vendor Overview, Services, Profile; admin Themes, Help requests; phone width on couple Profile, Guests, Builder. Not seen: other pages, help-session banner, builder toolbar with a real site.
- **Before commit:** delete the two unused files `apps/admin/src/components/layout/page-header.tsx` and `apps/couple/src/components/layout/header-slot.tsx` (a safety check stopped the agent from removing them).
- Found, not changed (older): loading a vendor page by its address lands on Overview.

## Merged (2026-11-28)
Committed and merged to `main` (a50f0c7), not pushed. Owner asked for merge then deploy; the reviews had been flagged as not run. On merged `main`: tsc, lint (0 errors), tests (admin 15/15, couple 88/88) and the admin, couple, vendor builds pass.
Deploy not done: Claude Code's auto-mode check blocked `firebase deploy`. To run: `firebase deploy --only hosting:admin,hosting:couple,hosting:vendor` from the repo root, builds are in each app's `out/`.
Worktree and branch removed.

## Deployed (2026-11-28)
Owner ran the deploy. admin, couple and vendor respond 200 (last modified 00:08 UTC); vendor `/services` 200. Why still in `4-testing`: signed-in use of the live sites not checked, reviews not run.
