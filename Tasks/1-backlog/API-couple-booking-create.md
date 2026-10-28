# API-couple-booking-create

- **ID:** T-0002
- **Repo:** apps/api (+ couple, vendor)
- **Owner:** SNLRLONG
- **Tier:** T3 · cross-tenant data, permissions scoping, new endpoint (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-booking-create/` · **Branch:** `feat/couple-booking-create` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** overview.md (Cross-actor data); docs/backend-schema.md `bookings`
- **Depends on:** needs a booking-flow design decision (request/accept/decline?)
- **Touches:** apps/api bookings modules, apps/couple (new feature), apps/vendor bookings

## Goal
Nothing creates a booking today: the vendor Bookings page is read-only. Let a couple request a vendor from the marketplace and let the vendor respond.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Plan written first with `task-planner` (statuses, who can change them)
- [ ] Couple can create a booking; vendor sees it and can accept/decline
- [ ] Queries scoped to the caller's own `couple_id`/`vendor_id`, tested for cross-tenant leaks
- [ ] Admin can see all bookings
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
