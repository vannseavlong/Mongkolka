# Web-builder-workspace-variants

- **Repo:** apps/couple, packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new screen layout, shared package export (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-builder-workspace-variants), 2026-10-28
- **Worktree:** `Mongkolka/builder-workspace/` · **Branch:** `feat/builder-workspace` 
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** none
- **Touches:** apps/couple/src/features/website (index.tsx, sections-list.tsx, section-preview.tsx, new variant-browser, section-panel), packages/templates (export shared SAMPLE content)

## Goal
Replace the flat section list with a workspace: section rail, live canvas (desktop/mobile toggle, scrolls to selected section), and a section panel with tabs. First tab is **Style**: a variant browser rendering every active variant of that section with the couple's own data, one click to apply. Expose a tab/slot registry so Assets, Colors and Apply tasks add their own files. Keep optimistic updates and the existing responsive behavior.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean; couple lint 0 errors; repo-wide lint has pre-existing failures)  - [ ] G3 tests (none exist or added; T2 needs new logic tests: use-section-actions optimistic/rollback)  - [x] G4 run it (against a stub API only, desktop width; phone/tablet via iframe emulation)
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Every section shows all active variants as live previews with the couple's data; current and template-default marked
- [ ] Switching a variant updates the canvas immediately and persists; failure rolls back with a toast
- [ ] Works at phone, tablet and desktop widths; keyboard and screen-reader usable (focus, aria-pressed)
- [ ] Empty, loading and single-variant states handled
- [ ] Existing content editor dialog still reachable from the panel
- [ ] Panel tab slots documented in a short comment so 3a/3b/3c do not edit shared files
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit 7dc5fba on `feat/builder-workspace`, not merged. Tier stays T2 (shared package gets a new export and an optional `wrapSection` prop on SiteRenderer; no auth/data).
Slot registry: add `workspace/panel-tabs/<name>.tab.tsx` exporting `tab`/`tabs` (`SectionPanelTab`: id, label, order, appliesTo?, Component); auto-registered via `require.context`; Style=10, Content=20, later tasks use 30+. Production build compatibility of the glob NOT confirmed.
Not verified: real API, reorder in browser, content dialog and color popover from Content tab, mobile canvas toggle only narrows width (viewport media queries won't switch), screen reader, next build.
Follow-ups: apps/web template-preview.tsx still has its own SAMPLE_CONTENT (switch to the shared export in Web-template-preview-subdomain); live-mounted tiles may need lazy mounting for many variants.
Next: G5 by a fresh agent (with `next build`), then G7, G8, G11.

## Review 2026-10-28 (fresh agent, G5)
Verified by reviewer: tsc clean; `next build` (Next 16.2.11, Turbopack) passes and `require.context` tab registry works in the production build (depends on Turbopack); no leftover imports of deleted files; `wrapSection` does not leak into apps/web and omitting it renders identically.
No blockers. Sent back: S1 opening gate click blanks canvas; S2 no scroll to section while Preview pane hidden on mobile; S3/S4 focus loss from `disabled` on rail buttons and variant tiles; S5 optimistic rollback races on rapid actions; S6 canvas click triggers scroll jump; plus nits (empty content fallback, section names, shared SECTIONS_KEY, memo).
Deferred: wrapper div differs slightly from public site (sticky/full-bleed); opening gate height inside the scaled box not checked; no cue to switch to Preview on mobile.
Tests: none exist; apps/couple has no runner. Pure-logic tests only, no new dependency without a decision (dependency changes are a T3 signal in PIPELINE.md).

## Fixes 2026-10-28 (commit c2465ae)
Review findings S1-S6 and nits N2, N3, N4, N6 fixed (inert canvas while opening selected; `active` pane prop and click-skip for scroll; aria-disabled plus live region for rail and tiles; in-flight counter, per-field rollback, per-section pending Switch; friendly section labels; shared SECTIONS_KEY in lib/keys.ts; React.memo on SectionPreview). tsc clean, couple lint 0 errors, `next build` passes, dev run against the stub API.
Pure logic lives in `workspace/section-actions-logic.ts`.
G3 tests NOT done: apps/couple has no test runner and tsx is not in the workspace. Decision needed from the owner: add a runner (new dev dependency, T3 signal) or accept untested pure logic with a written Skipped G3 reason. Cases ready: applyPatch, rollbackFields, reorderSections payload/edges, panel-tabs order.
Not run: overlapping failing writes, Switch disabled state during save, S2 scroll on narrow screen, a real screen reader, real API.
Next: re-review of fix commit, G3 decision, G7, G8, G11.

## Merged to main 2026-10-28
Merged locally with --no-ff after review and fixes; combined typecheck, API tests (49/49) and production builds of couple, web and admin pass. Moved to 4-testing, not 5-done, because open items remain: G3 tests (couple-app tasks have no runner; merged without them at the owner's request), live runs against the real API and sheets, G9/G10 for T3 tasks, schema sync and slug backfill (see CHANGELOG Needs).
