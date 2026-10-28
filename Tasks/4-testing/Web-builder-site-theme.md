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

## Review 2026-10-28 (fresh agent, G5; static read, tsc clean, app not run)
No blockers; not ready for testing until the should-fix items are done. Sent back:
1 Colors tab drops edits while a save is in flight (and "Use site theme" silently does nothing right after an edit); 2 color commit relies on blur only (unreliable for native pickers in Firefox/Safari, no Enter/Escape); 3 saving only differing keys can split a palette and leave unreadable colors after switching templates -> store bg, text, accent together; 4 unsaved draft theme sticks on the canvas after the editor unmounts; 5 SectionColorPopover and the Colors tab disagree (snapshot of all four keys, wrong label); 6 font Select has no accessible name; 7 four presets have accent contrast below 4.5:1 (Ivory & Gold 3.36, Sky Linen 4.39, Lotus Pink 4.42, Terracotta 4.44, Sage Garden 4.51); the earlier "no accent threshold required" note was wrong, accent is used for text.
Nits sent back: contrast helper returns null for invalid colors, announce threshold crossings only, aria-disabled styling, case/3-digit normalization, unused getThemePreset, `as const` presets.
Deferred: free-text font_style in admin (pre-existing); no Escape to cancel hover preview by keyboard; touch hover behavior.

## Fixes 2026-10-28 (commit c3e96e0)
Review items 1-10 and 12 fixed: saves in the Colors tab are serialized (promise chain), "Use site theme" always works; Enter or blur commits with a 600 ms debounce for pickers that don't blur, Escape discards; ThemeEditor stores bg, text and accent together; onPreview is `Theme | null` with cleanup on unmount; Colors tab prunes against the SAVED site theme (read via useApiQuery on /settings); SectionColorPopover made consistent (differing keys only, prunes against saved theme, label "Use site theme") but it still saves through its own api.patch; accessible name on the font Select; five preset accents darkened and a MIN_ACCENT_CONTRAST 4.5 assertion in the check script (10 presets, 0 failures; accent/bg now 4.63 to 8.97); contrast helper returns null for invalid colors; sr-only status announces threshold crossings; aria-disabled styling; normalizeColor/sameColor; getThemePreset removed; presets `as const satisfies`.
Run in browser against a stub with 1.5 s delayed PATCHes: rapid edits (no revert), edit then reset (null sent last), Escape, collapse while hovering (canvas returns to saved). tsc clean, lint 0 errors, next build passes.
Not verified: real Firefox/Safari picker events (simulated in Chrome), screen reader, mobile, public site, `{}` reset against the real API, the Content-tab popover after the pruning change (code only).
Next: G3 decision, G7, G8, G11; fresh re-review of the fix commit is advisable (the fix touched many paths).

## Merged to main 2026-10-28
Merged locally with --no-ff after review and fixes; combined typecheck, API tests (49/49) and production builds of couple, web and admin pass. Moved to 4-testing, not 5-done, because open items remain: G3 tests (couple-app tasks have no runner; merged without them at the owner's request), live runs against the real API and sheets, G9/G10 for T3 tasks, schema sync and slug backfill (see CHANGELOG Needs).
