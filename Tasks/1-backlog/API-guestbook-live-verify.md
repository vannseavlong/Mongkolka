# API-guestbook-live-verify

- **ID:** T-0004
- **Repo:** apps/api (+ couple, web)
- **Owner:** SNLRLONG
- **Tier:** T3 · gift tracking, sheet-db schema sync, guest photo uploads (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/guestbook-live-verify/` · **Branch:** `feat/guestbook-live-verify` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 9; docs/tasks/guest-photos.md
- **Depends on:** none (first thing to do)
- **Touches:** apps/api schemas + seeds, apps/couple `/photos` + guests, packages/templates `guestbook_wall`

## Goal
Phase 9 is typecheck-only. Sync the schema, seed the new catalog rows, and prove the guestbook and gift flow works against the live sheet.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] `lsdb sync --all-users` and `lsdb seed … --upsert` run (new `guests` gift columns, `guest_wishes` tab, `guestbook` section enum, catalog rows)
- [ ] Guestbook submit (photo + wish + gift) -> couple review -> confirm gift -> dashboard totals works live
- [ ] Invited-name flow works (`?name=` and `?to=`: opening, hero, RSVP and guestbook prefill)
- [ ] `/photos` and dashboard pages checked in a browser, not just curl
- [ ] Public-site uploader gap from 8.4 confirmed closed by the guestbook form (or split into its own task)
- [ ] TODO.md Phase 9 boxes ticked
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
