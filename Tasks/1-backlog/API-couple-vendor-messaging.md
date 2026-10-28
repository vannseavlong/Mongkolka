# API-couple-vendor-messaging

- **ID:** T-0003
- **Repo:** apps/api (+ couple, vendor)
- **Owner:** SNLRLONG
- **Tier:** T3 · personal data, new cross-actor table, permissions (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-vendor-messaging/` · **Branch:** `feat/couple-vendor-messaging` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 7
- **Depends on:** API-couple-booking-create (threads likely hang off a booking)
- **Touches:** admin sheet (new table), new api module, apps/couple, apps/vendor

## Goal
Couple and vendor can message each other. Needs a real design first (the Clone-UI version cannot send).

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Plan written with `task-planner`, including whether it is an admin-sheet cross-actor table like `bookings`
- [ ] Send/read threads, scoped per participant
- [ ] Sheets write load considered (use the write-behind queue pattern?)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
