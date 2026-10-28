# Web-builder-template-apply

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · edits template selection flow (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/builder-template-apply/` · **Branch:** `feat/builder-template-apply` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** API-template-catalog-apply, Web-builder-workspace-variants
- **Touches:** apps/couple/src/features/website/components/template-picker.tsx, new apply-dialog

## Goal
Template gallery with live thumbnails, names, 'Preview' (opens the subdomain) and 'Use this template'. Applying opens a dialog to choose keep-content vs start-fresh, then shows the result on the canvas.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Gallery shows live thumbnail, name, palette; selected template marked
- [ ] Preview opens `<template-slug>.<ROOT_DOMAIN>` in a new tab
- [ ] Apply dialog explains what is kept and what resets; default keeps content
- [ ] After apply the canvas and sections refresh; failure leaves previous state
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
