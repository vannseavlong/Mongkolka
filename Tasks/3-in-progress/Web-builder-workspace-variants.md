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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
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
