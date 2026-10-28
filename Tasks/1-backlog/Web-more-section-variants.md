# Web-more-section-variants

- **ID:** T-0013
- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, new components (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/more-section-variants/` · **Branch:** `feat/more-section-variants` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** docs/tasks/template.md
- **Depends on:** product demand; catalog rows seeded via Admin
- **Touches:** packages/templates/src/sections, apps/api seeds/section-components.ts

## Goal
Only `opening` has real variants (four); every other section has one default. Add variants as couples ask for them.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Pick which sections get a second variant, from actual feedback
- [ ] Each variant registered, seeded and previewable in the template gallery
- [ ] Works in both the couple preview and the public site
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
