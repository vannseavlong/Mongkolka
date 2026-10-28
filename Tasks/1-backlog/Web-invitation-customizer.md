# Web-invitation-customizer

- **ID:** T-0012
- **Repo:** apps/web (+ couple, api)
- **Owner:** SNLRLONG
- **Tier:** T2 · new feature, new tables, new screens (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/invitation-customizer/` · **Branch:** `feat/invitation-customizer` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 7; docs/backend-schema.md (`invitation_templates`/`invitation_panels` stubs)
- **Depends on:** design brief
- **Touches:** apps/couple (new feature), apps/api (new modules), packages/templates

## Goal
Digital invitation-card customizer: a separate feature from the website builder, with its own layout/fold type and per-panel color and content.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Plan written with `task-planner` before any code (not designed yet)
- [ ] Template + panel model finalized and added to backend-schema.md
- [ ] Couple can build and share a card
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
