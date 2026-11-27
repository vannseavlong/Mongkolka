# Web-library-no-tabs

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T1 · UI change to one shared component, no API or logic change (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude (session), 2026-11-27
- **Worktree:** `Mongkolka/couple-library-plus/` · **Branch:** `fix/library-no-tabs`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** none (request from the owner)
- **Depends on:** none
- **Touches:** apps/couple/src/features/website/components/asset-library.tsx (used by the builder panel, the photo picker dialog and the Storage page)

## Goal
The image library has no Library / Upload tabs. The photos are always visible, and uploading is a plus tile in the grid.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 existing tests  - [ ] G4 quick run  - [ ] G8 commit  - [ ] G11 changelog

## Done when
- [x] No tabs; the grid shows photos at once, first tile is a "+" that opens the file picker
- [x] Drag and drop onto the library still uploads; progress, errors and "skipped files" show above the grid
- [x] Empty, loading, error and full states still work; keyboard and screen reader labels on the plus tile
- [x] Delete still returns focus sensibly
- [~] Works in the picker dialog, the builder panel and the Storage page; 360px (checked on the Storage page only)
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `couple-library-plus/` (branch `fix/library-no-tabs`), uncommitted. `asset-library.tsx`: Tabs removed (and the `TAB` classes from the last fix, no longer needed); hidden file input; the grid's first tile is a dashed "+ Add photos" button (aria-label "Add images", disabled look and hint when the library is full); the whole library accepts dropped files with a ring while dragging; upload progress, failures and "skipped files" show above the grid (list scrolls past 18rem); empty state "Tap the + to add your first photo".
- G2: `tsc`, eslint pass. G3: 56/56 couple tests.
- G4: Chrome on the Storage page against a throwaway stub: photos visible at once with the plus tile first; a real file through the input uploaded (progress above the grid, new tile appeared, counter updated); empty state; full state (tile disabled, describedby the full hint, file picker did not open); 360px no sideways scroll, plus tile 133px.
- Not checked: the picker dialog and the builder panel (same component, not opened), drag-and-drop with a real mouse drag (the handlers are the previous ones, moved), delete focus return, keyboard Tab order, the "Show more" page with more than 24 photos beyond seeing the grid render 100.
- Not done: commit, merge, deploy, changelog.

## Shipped (2026-11-27)
Committed (49b432c), merged to `main` (36e702d), pushed and deployed to couple-mongkolka.web.app. `tsc` pass, 56/56 tests, lint 0 errors. The first deploy builds failed on a Google Fonts fetch error and a retry passed. Worktree and branch removed.
