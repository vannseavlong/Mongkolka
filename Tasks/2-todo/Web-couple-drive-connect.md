# Web-couple-drive-connect

- **ID:** T-0020
- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new settings screen on top of a T3 API (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-drive-connect/` · **Branch:** `feat/couple-drive-connect` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/guest-photos.md, Docs/backend-schema.md
- **Depends on:** API-couple-drive-storage
- **Touches:** apps/couple/src/features/profile or new features/storage (connect card), website builder asset tab (status banner only)

## Goal
Portal screen to connect, see status of, and disconnect Google Drive; clear explanation of what is stored there and that only files created by Mongkolka are accessible. Reconnect banner in the builder's Assets tab and guest photos when the connection needs attention.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Connect card with states: not connected, connected (account email, folder), needs reconnect, error
- [ ] Disconnect asks for confirmation and explains what happens to existing files
- [ ] Reconnect banner appears in the asset library and guest photos page
- [ ] Works at phone width; copy reviewed for non-technical couples
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
