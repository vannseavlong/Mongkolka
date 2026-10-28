# API-actor-drive-separation

- **ID:** T-0001
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · auth/token storage, credentials table (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/actor-drive-separation/` · **Branch:** `feat/actor-drive-separation` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 7
- **Depends on:** none (infra, do when convenient)
- **Touches:** apps/api/src/modules/auth, schemas/admin/credentials.ts, lsdb config

## Goal
Use `longcelot-sheet-db`'s `TokenStore` on `credentials` so each actor's data uses their own Drive grant and quota instead of one shared admin grant.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Spike confirms `actorClientForCrud` works for per-couple quota (untested upstream)
- [ ] Tokens stored and refreshed safely; migration path for existing actors
- [ ] Sheets quota measured before/after
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
