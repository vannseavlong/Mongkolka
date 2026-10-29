# Web-couple-builder-responsive

- **ID:** T-0033
- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T3 · touches the dashboard layout's token/redirect handling (login/token signal in `PIPELINE.md`); otherwise T1 UI tweaks
- **Claimed by:** none
- **Worktree:** none. Built directly in the `apps/couple` main checkout (deviation from AGENTS.md, flagged to the user: dev servers were already running there and no other task touched these files)
- **Started / updated:** 2026-10-26 / 2026-10-26
- **Docs:** docs/tasks/couple.md, docs/tasks/template.md
- **Depends on:** none
- **Touches:** apps/couple `(dashboard)/layout.tsx`, `features/website/*`, headers in guests/budget/checklist/milestones/photos (see note)

## Goal
Make the couple portal and website builder work correctly and respond well on phone/tablet/desktop.

## Changes
- Fix: hard load/refresh of any dashboard route redirected to `/dashboard` (token read was `null` during hydration). Layout now waits until the token is read.
- Builder: Edit/Preview toggle below `lg`; publish bar and slug editor wrap on phones; larger reorder arrow targets; full-width section select; colour popover capped to viewport; preview height responsive.

- Review follow-ups: toggle is a labelled `aria-pressed` group, preview uses `dvh`, layout only signs out on 401 (other failures show a retry screen).
- Builder: "View site" and "Copy link" when published, publish button disabled while the request runs.

## Verified (run in browser, mock couple `mock.couple@example.test`, phone width via 390px iframe)
- No horizontal overflow on guests, budget, checklist, milestones, website, photos, profile (390px) and dashboard.
- Deep link `/website` now stays on `/website`; Edit/Preview toggle works; section rows render.
- Public site `/mock-demo` at 390px: no horizontal scroll.
- Dialogs at 390px stay inside the viewport with no overflowing children: add guest, budget, checklist, milestone, registry content editor.
- Builder at 768px: no overflow, Edit/Preview toggle shown.
- `tsc --noEmit` clean; eslint: 0 errors, 3 pre-existing warnings.

## Not done / not verified
- Page-header wrap edits (guests/budget/checklist/milestones) and the photos tab scroll were added after the first browser run: typechecked, not seen.
- Not tested: real touch device, tablet visual pass of non-builder pages, creating/editing data end to end, public site at tablet/desktop. Registry editor fields are narrow on phones (truncated text), left as is.
- `packages/templates` eslint has pre-existing config errors (missing next/react-hooks plugins).

## Gates
- [x] G1 scope  - [x] G2 static  - [ ] G3 tests (none exist for couple)  - [x] G4 run it (partial, see above)
- [x] G5 code review (fresh agent, no high/medium findings; lows fixed)  - [x] G6 security (auth redirect analysed: no unauthenticated content render, API guard untouched)  - [ ] G7 docs sync
- [ ] G8 PR message  - [x] G9 human review (user okayed 2026-10-26)  - [ ] G10 release plan  - [x] G11 changelog

## Public site perf (apps/web production build, measured on /mock-demo, warm)
FCP 68ms, LCP 1.2s (animated title), CLS 0, no long tasks, ~200KB JS, 182KB fonts. Cold API response took 2.9s (see backlog API-public-site-prewarm). Not changed.
