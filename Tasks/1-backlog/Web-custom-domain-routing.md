# Web-custom-domain-routing

- **ID:** T-0011
- **Repo:** apps/web
- **Owner:** SNLRLONG
- **Tier:** T3 · release/deploy and hosting config, DNS (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/custom-domain-routing/` · **Branch:** `feat/custom-domain-routing` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-18
- **Docs:** TODO.md Phase 5, Phase 6
- **Depends on:** product decision: are custom domains a real requirement?
- **Touches:** apps/web middleware, hosting config, `couples.custom_domain`

## Goal
Public sites are served at `/[slug]` only. `couples.custom_domain` exists in the schema but does nothing. Build the domain-routing middleware if custom domains are wanted.

## Gates (copy the rows your tier needs; write `Skipped Gn: reason` if you skip one)
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Decision recorded first: build or drop
- [ ] Middleware maps host -> couple slug; unknown hosts 404
- [ ] Domain ownership verification, TLS, and cache invalidation covered
- [ ] Release plan and rollback written
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
