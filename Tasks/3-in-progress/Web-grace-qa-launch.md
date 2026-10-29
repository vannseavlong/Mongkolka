# Web-grace-qa-launch

- **Repo:** packages/templates, apps/web
- **Owner:** SNLRLONG
- **Tier:** T2 · edits a shared primitive and the public site page (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-qa-launch), 2026-10-30
- **Worktree:** `Mongkolka/grace-launch/` · **Branch:** `feat/grace-launch`
- **Started / updated:** 2026-10-30 / 2026-10-30
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** all Grace component tasks (merged)
- **Touches:** packages/templates/src/sections/grace/* (any file, including shared.tsx), packages/templates/src/sample-content.ts, apps/web/src/app/[slug]/page.tsx and site-view.tsx, apps/web/src/app/templates/template-preview.tsx and templates/preview, docs/tasks/template.md

## Goal
Make the Grace pink, gold and white template work as one whole page and ready for the owner to review: darken the shared foil text, wire the footer credit link from the web app, make the template preview pages show every section including the guest photo wall, run a whole-page QA at phone, tablet and desktop in English and Khmer, fix integration issues found, and write the owner's step-by-step to see it. Do NOT flip the template or its component rows to active (the owner does that after reviewing).

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (no runner for templates)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (owner looks at the template)  - [ ] G11 changelog

## Done when
- [ ] `FoilText` stops are darkened for text use; large script text is at least 3:1 everywhere (hero names, opening names), re-measured
- [ ] Footer gets `brandUrl` from apps/web (production domain from env; plain text when unset)
- [ ] Template preview pages (`/templates/[id]` and `/templates/preview/[slug]`) render all Grace sections including a sample guest photo wall and a working no-op RSVP
- [ ] Whole-page screenshots at 390, 820 and 1200 px, English and Khmer, reviewed and integration issues fixed
- [ ] Owner's "how to see it" steps written (seed commands, toggle active on a dev sheet copy, URLs)
- [ ] Template and component rows still inactive in the seeds (the seed test guards it)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
