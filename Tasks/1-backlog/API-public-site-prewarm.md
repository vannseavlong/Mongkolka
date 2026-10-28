# API-public-site-prewarm

- **ID:** T-0007
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T2 · new warm path on shared public-site cache (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/public-site-prewarm/` · **Branch:** `feat/public-site-prewarm` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 8.1
- **Depends on:** none
- **Touches:** apps/api/src/modules/public-site/public-site.cache.ts, couple-website publish

## Goal
A cold first view of a couple site costs about 6.5s. Pre-warm the shell cache on boot and on publish so guests never hit the cold path.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Cold first view under 1s after boot and after publish (measured, before/after in the PR)
- [ ] Pre-warm failures never block boot or publish
- [ ] Sheets quota stays clear while warming many sites
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
