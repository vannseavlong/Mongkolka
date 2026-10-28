# Web-builder-template-apply

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · edits template selection flow (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-builder-template-apply), 2026-10-28
- **Worktree:** `Mongkolka/builder-template-apply/` · **Branch:** `feat/builder-template-apply`
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** API-template-catalog-apply, Web-builder-workspace-variants
- **Touches:** apps/couple/src/features/website/components/template-picker.tsx, new apply-dialog

## Goal
Template gallery with live thumbnails, names, 'Preview' (opens the subdomain) and 'Use this template'. Applying opens a dialog to choose keep-content vs start-fresh, then shows the result on the canvas.

## Gates
- [x] G1 scope (shared data/schema.ts touched: slug, description added; other builder tasks may conflict trivially)  - [x] G2 static (tsc, lint 0 errors, next build)  - [ ] G3 tests (no runner in apps/couple)  - [~] G4 run it (stub API: gallery, dialog, reset_all success, keep_content failure)
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Gallery shows live thumbnail, name, palette; selected template marked
- [ ] Preview opens `<template-slug>.<ROOT_DOMAIN>` in a new tab
- [ ] Apply dialog explains what is kept and what resets; default keeps content
- [ ] After apply the canvas and sections refresh; failure leaves previous state
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit edb6f9c on `feat/builder-template-apply` (based on feat/builder-workspace), not merged. Template gallery with live thumbnails (template-thumbnail.tsx), Preview link (hidden without slug; uses siteOrigin from lib/site-url.ts), apply dialog (keep_content default / reset_all, template-apply-dialog.tsx), first pick applies directly, current template inert, aria-disabled while pending, refetch of settings and sections on success.
Not verified: real API, first-pick path, keep_content success, Preview click, mobile widths and keyboard, tests (none).
Next: G5 review, G3 decision, G7, G8, G11.

## Review 2026-10-28 (fresh agent, G5; static read only, tsc and eslint clean, app not run)
No hard blockers, but not ready for testing until S1 is fixed. Sent back:
S1 first-pick path treats "settings not loaded or failed" as "no template yet" and applies keep_content with no confirmation, which clears theme_override, component_id and color_override for a couple who already has a template. S2 dialog copy: confirm button reads "Apply template" even for the destructive reset_all; no "cannot be undone / goes live on a published site" line. S3 wrong aria-pressed on a non-toggle card button. S4 settings and sections refetch can flash new template with old sections; a failed refetch still shows "Now using X".
Nits sent back: inline dialog error, loading and empty states, dialog max-height, ref for the double-submit guard. Skipped: thumbnail memo detail, cost past ~10 templates (revisit).
