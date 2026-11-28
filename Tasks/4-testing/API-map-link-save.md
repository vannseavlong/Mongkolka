# API: keep the map's directions link and place name

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · API validation, rendered back as a link (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-map-link-save/` · **Branch:** `fix/map-link-save`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `apps/api/src/utils/section-content.ts` and its tests

## Goal
Business need: a couple saves a directions link on the map section and guests get the button.
Contract: `PATCH /couple/api/website/sections/:id { content }` for `map` also keeps `placeName` (string, max 200) and `mapUrl` (https only, no credentials, max 2000); 400 otherwise. No schema or data change; backward compatible.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (stored link rendered to guests)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Saved link and place name survive a reload
- [x] Non-https link rejected
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- `cleanMap` keeps `placeName` and an https `mapUrl`. Cause: the editor and templates had both fields, the API dropped them and still answered 200.
- Not run against real sheets. G5 code review and G6 security review not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. API tests 304/304 and build pass on merged `main`. API deploys on Render from `main`; the live version was not confirmed from here. Why in `4-testing`: save not tried on live, G5 code review and G6 security review not run.
