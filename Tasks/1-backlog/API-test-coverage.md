# API-test-coverage

- **ID:** T-0009
- **Repo:** apps/api (+ packages/templates)
- **Owner:** SNLRLONG
- **Tier:** T3 · package.json dependency change, adds the test runner every other gate needs (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/test-coverage/` · **Branch:** `feat/test-coverage` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** Tasks/PIPELINE.md (G3)
- **Depends on:** none
- **Touches:** package.json, turbo.json, apps/api, packages/templates

## Goal
There is no test script or test file in the product code (only in the Clone-* references), so gate G3 can never pass for T2/T3 work. Add the runner and cover the risky pure logic first.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Test runner chosen and wired into `pnpm test` + turbo
- [ ] Tests for `resolveTheme()`/`resolveComponent()`, rate limiter, ttl-cache, write-behind queue, photo limits clamp, gift status rules
- [ ] Pipeline G3 command documented in `Tasks/PIPELINE.md`
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
