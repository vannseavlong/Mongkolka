# API-load-test-public-site

- **ID:** T-0005
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T2 · new test tooling, public endpoints (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/load-test-public-site/` · **Branch:** `feat/load-test-public-site` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 8; docs/tasks/guest-photos.md
- **Depends on:** API-public-site-prewarm
- **Touches:** apps/api (scripts), no product code

## Goal
Phase 8 targets about 100-200 concurrent visitors per site plus uploads, but it was only tested one request at a time. Test many guests at once.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Load script for site view, RSVP, wishes and photo upload from many simultaneous guests
- [ ] Numbers recorded: latency, Sheets quota errors, write-queue lag
- [ ] Single-instance limits written down (limiters and cache are in-memory); decide if a move to SQL for hot tables is needed
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
