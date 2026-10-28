# Web-builder-site-theme

- **Repo:** apps/couple, packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package constant, edits theme UI (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-builder-site-theme), 2026-10-28
- **Worktree:** `Mongkolka/builder-site-theme/` · **Branch:** `feat/builder-site-theme`
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** Web-builder-workspace-variants
- **Touches:** apps/couple/src/features/website/components/theme-editor.tsx, section-color-popover.tsx, packages/templates (theme presets)

## Goal
Site-wide theme panel with preset palettes (each previewed on the live canvas on hover), custom colors, font choice and reset to template. Per-section Colors tab shows the inherited value and a clear 'use site theme' reset. Cascade code stays `resolveTheme()`.

## Gates
- [x] G1 scope  - [x] G2 static (tsc, lint 0 errors, next build)  - [ ] G3 tests (no runner in apps/couple)  - [~] G4 run it (stub API: hover preview, save, reset, section override and reset)
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] At least 8 named presets exported from `packages/templates`, contrast-checked
- [ ] Hover/preview before Save; Save persists to `theme_override`
- [ ] Section override shows inherited vs overridden and can be reset
- [ ] Public site matches builder preview
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit 456f721 on `feat/builder-site-theme` (based on feat/builder-workspace), not merged. New `packages/templates/src/theme-presets.ts` (10 presets, FONT_STYLES serif/sans, contrastRatio, MIN_TEXT_CONTRAST 4.5, getThemePreset); `colors.tab.tsx` (order 40: inherited vs custom, save on blur, "Use site theme" sends color_override null); theme-editor.tsx rebuilt (hover/focus preview via the draft mechanism, partial save of keys that differ from the template, contrast warning, reset); index.tsx one line.
Contrast: all 10 presets text/bg 11.28 to 17.04 (pass 4.5:1); accent/bg 3.36 to 8.97 (lowest Ivory & Gold 3.36; no threshold required for accent).
Reset to template sends `{}`: API rejects null but its updateTheme REPLACES the stored value, so `{}` clears the override (checked in couple-website.service.ts). No API change needed.
Content tab's SectionColorPopover and the new Colors tab both edit color_override (duplication left in place).
Not verified: keyboard, narrow layouts, real API and public site rendering, touch hover. Tests deferred (no runner).
Next: G5 review, G3 decision, G7, G8, G11.
