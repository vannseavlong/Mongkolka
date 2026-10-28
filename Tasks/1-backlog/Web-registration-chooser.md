# Web-registration-chooser

- **ID:** T-0014
- **Repo:** apps/web
- **Owner:** SNLRLONG
- **Tier:** T2 · new screen/route (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/registration-chooser/` · **Branch:** `feat/registration-chooser` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 6; docs/tasks/landing.md
- **Depends on:** none
- **Touches:** apps/web/src/app (new route), site header/landing CTAs

## Goal
Add a couple-or-vendor chooser page so landing CTAs lead to a proper sign-up entry instead of straight to each portal's Google login.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Chooser page matches the design brief and works on mobile
- [ ] Landing and header CTAs route through it
- [ ] Both paths still land in `status: pending` for approval
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
