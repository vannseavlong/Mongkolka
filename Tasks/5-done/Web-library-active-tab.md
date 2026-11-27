# Web-library-active-tab

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T1 · small UI fix, one component, no logic (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-library-tab/` · **Branch:** `fix/library-active-tab`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** none (ad hoc request from the owner, with a screenshot of the Storage page)
- **Depends on:** none
- **Touches:** apps/couple/src/features/website/components/asset-library.tsx (tab classes only)

## Goal
The Library / Upload tabs in the image library (picker dialog and Storage page) show no clear active tab, so users cannot tell where they are. Make the active tab obvious.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 existing tests  - [ ] G4 quick run  - [ ] G8 commit  - [ ] G11 changelog

## Done when
- [x] Active tab clearly different from the inactive one (not by colour alone: also weight), in the dialog and on the Storage page
- [x] Other Tabs in the app unchanged (fix is scoped to the library)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `couple-library-tab/` (branch `fix/library-active-tab`), uncommitted. Cause: the shared `TabsTrigger` colours the active tab with the card colour and uses the same text colour for both tabs, so inside a card or dialog the two look alike. Fix: library-only classes: inactive tab muted, active tab filled with the primary colour, bold, small shadow. The shared `Tabs` component is untouched.
- G2: `tsc` passes; G3: 56/56 couple tests pass.
- G4: looked at in Chrome on the Storage page (stub API): Library active, then Upload active after a click. The picker dialog uses the same component and classes; it was not opened separately.
- Not done: commit, merge, deploy, G11 changelog.

## Shipped (2026-11-27)
Merged to `main` (`8f4c80b`), pushed, deployed to https://couple-mongkolka.web.app. The first deploy build failed on the Google font fetch (network), the retry passed. Live bundle checked for the new classes; the live page was not opened with a login.
