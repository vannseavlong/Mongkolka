# API-payment-integration

- **ID:** T-0006
- **Repo:** apps/api (+ couple)
- **Owner:** SNLRLONG
- **Tier:** T3 · payment logic, money, release gating (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/payment-integration/` · **Branch:** `feat/payment-integration` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 7, Phase 9; Clone-UI ABA flow is fake
- **Depends on:** owner decides pricing and provider (KHQR/ABA)
- **Touches:** apps/api (new payments module), apps/couple publish flow

## Goal
Two uses of payments are open: a real gate on publishing a site, and auto-tracking guest gifts (today guests self-report and the couple confirms). Decide scope, then build.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Decision recorded: is publish paid, and what price?
- [ ] Plan splits publish-gate from gift auto-tracking (probably two tasks)
- [ ] Webhook signature checks, idempotency, refunds path
- [ ] Currencies stay separate (USD/KHR never summed)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
