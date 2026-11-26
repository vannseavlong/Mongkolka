# Seed couple sheets for active couples only

- **Repo:** Mongkolka (apps/api)
- **Owner:** SNLRLONG
- **Tier:** T3 · bulk writes into couple sheets (data migration signal)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-seed-active-couples/` · **Branch:** `feat/seed-active-couples`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** none
- **Depends on:** none
- **Touches:** apps/api/scripts/seed-active-couples.ts, apps/api/src/utils/seed-targets.ts (+ test)

## Goal
Push a seed file into active couples' sheets only; suspended, pending and rejected couples are skipped. Dry run unless `--apply`.

## Gates
- [x] G1 scope  - [x] G2 static (api typecheck, eslint on new files)  - [x] G3 tests (223 pass)  - [ ] G4 run it (dry run ok: 3 active of 7; --apply not run)
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [x] Only active couples are targeted
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Notes
- Merged to `main` at the user's request before G5, G6, G9, G10 ran. Still open: those gates and an `--apply` run on a test sheet.
