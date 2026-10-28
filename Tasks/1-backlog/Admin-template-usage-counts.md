# Admin-template-usage-counts

- **ID:** T-0010
- **Repo:** apps/admin (+ api)
- **Owner:** SNLRLONG
- **Tier:** T2 · new API endpoint (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/template-usage-counts/` · **Branch:** `feat/template-usage-counts` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 7; docs/backend-schema.md
- **Depends on:** none
- **Touches:** apps/api site-templates/section-components, apps/admin catalog pages

## Goal
Show how many couples use each site template and section component. The schema doc leaves open whether to compute on demand or aggregate periodically.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Approach chosen and noted (on demand vs periodic job; Sheets read cost considered)
- [ ] Counts visible in admin catalog tables
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
