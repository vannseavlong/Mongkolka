# Web-storage-library

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new section on a screen, reuses shared AssetLibrary, no API change (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-storage-library/` · **Branch:** `feat/storage-library`
- **Started / updated:** - / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** Web-couple-drive-connect merged (it still lists features/storage in Touches; inbox note left)
- **Touches:** apps/couple/src/features/storage/ (index.tsx, new components/storage-summary.tsx, lib/storage-summary.ts), app/(dashboard)/settings/storage/page.tsx. Reads only: features/website/components/asset-library*.ts(x)

## Goal
Storage page shows the image library next to the Google Drive card and looks finished: header, usage summary (images used of limit, total size, where files are kept), two columns from `lg`, stacked at 360px.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [ ] AssetLibrary rendered manage-only (no `onPick`) on the page; upload and delete work
- [ ] Summary: count/limit, total size from `size_bytes`, "Stored in Google Drive / by Mongkolka" from the connection state; pure function in `lib/storage-summary.ts` with a test
- [ ] Loading, empty, error and 403 states for the page; library keeps its own states
- [ ] Checked at 360px and 1280px; no horizontal scroll
- [ ] Layers kept apart (UI / logic / data); reuse `packages/ui` Card, Skeleton, Progress
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
