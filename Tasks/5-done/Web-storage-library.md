# Web-storage-library

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new section on a screen, reuses shared AssetLibrary, no API change (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-storage-library/` · **Branch:** `feat/storage-library`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** none (Web-couple-drive-connect has no commits beyond main and a clean worktree, so its storage screen is already merged; checked 2026-11-27)
- **Touches:** apps/couple/src/features/storage/ (index.tsx, new components/storage-summary.tsx, storage-library-card.tsx, lib/storage-summary.ts, use-storage-summary.ts), features/website/components/asset-library.tsx (two optional props: `gridClassName`, `showDriveNotice`; `LIST_CACHE` now exported)

## Goal
Storage page shows the image library next to the Google Drive card and looks finished: header, usage summary (images used of limit, total size, where files are kept), two columns from `lg`, stacked at 360px.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [x] AssetLibrary rendered manage-only (no `onPick`) on the page; upload and delete work
- [x] Summary: count/limit, total size from `size_bytes`, "Stored in Google Drive / by Mongkolka" from the connection state; pure function in `lib/storage-summary.ts` with a test
- [x] Loading, empty, error and 403 states for the page; library keeps its own states
- [x] Checked at 360px and 1280px; no horizontal scroll
- [x] Layers kept apart (UI / logic / data); reuse `packages/ui` Card, Skeleton, Progress
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `couple-storage-library/` (branch `feat/storage-library`), uncommitted. Page: summary tiles (images n of max with a bar that warns from 90%, space used, where files are kept), Drive card and the image library side by side from `lg` (22rem + rest), stacked below. Library is manage-only with 4 columns from `xl`. Shared `AssetLibrary` got two optional props with unchanged defaults; the builder panel is untouched.
- G2: `tsc`, eslint, `next build` pass. G3: 54/54 couple tests (10 new, `lib/storage-summary.test.ts`).
- G4: ran in Chrome against a throwaway stub API (not in the repo) with a fake login. Checked at desktop width: not connected, connected with 0 images, needs reconnect with 95 of 100 images. Checked in a 360px frame: stacked, no sideways scroll. Found and fixed one issue: the reconnect notice showed twice (Drive card and library), now once.
- Not checked: real API and real Drive data, uploads and deletes through the real API (stub accepted the list only), the page when only the Drive/asset calls fail (the whole dashboard shows its own error when the API is down), a real phone.
- Not done: G5 code review (fresh agent), G7 (no docs affected), G11 changelog, commit and merge.

## Code review (G5, fresh agent) and ship (2026-11-27)
No blocking findings. Fixed: progress bar had no accessible value (shared `Progress` now passes `value` to Radix Root; every consumer already passed one), long email could widen the grid at 360px, `LIST_CACHE` moved from the component file to `asset-library-api.ts`, bar no longer reads 100% before the library is full, skeleton height closer to the real tile; 2 tests added (56 pass). Left: heading order (card titles render h4 under the h1; the library's inner "Image library" h3 repeats the card title), tiles show no error state of their own (the library card shows it).
Merged to `main` (`10c3f93`), pushed, deployed to https://couple-mongkolka.web.app (`pnpm deploy:couple`; first build failed on a network error fetching a Google font, the retry passed). Live bundle checked for the new text; the live page was not opened with a login.
Skipped G4 on the real API (checked on a stub only), G5 second pass after the fixes.
