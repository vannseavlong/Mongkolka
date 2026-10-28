# Web-builder-site-theme

- **Repo:** apps/couple, packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package constant, edits theme UI (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/builder-site-theme/` · **Branch:** `feat/builder-site-theme` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** Web-builder-workspace-variants
- **Touches:** apps/couple/src/features/website/components/theme-editor.tsx, section-color-popover.tsx, packages/templates (theme presets)

## Goal
Site-wide theme panel with preset palettes (each previewed on the live canvas on hover), custom colors, font choice and reset to template. Per-section Colors tab shows the inherited value and a clear 'use site theme' reset. Cascade code stays `resolveTheme()`.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] At least 8 named presets exported from `packages/templates`, contrast-checked
- [ ] Hover/preview before Save; Save persists to `theme_override`
- [ ] Section override shows inherited vs overridden and can be reset
- [ ] Public site matches builder preview
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
