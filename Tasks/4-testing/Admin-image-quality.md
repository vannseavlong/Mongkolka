# Admin-image-quality

- **ID:** T-0059
- **Repo:** apps/admin, apps/api, apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · spans 3 apps, changes an API response and admin settings (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** removed after merge · **Branch:** merged to main (2d4c1cb)
- **Started / updated:** 2026-11-26 / 2026-11-26
- **Docs:** none
- **Depends on:** none
- **Touches:** api platform-settings, website-assets limits; admin settings; couple asset upload; covenant map image

## Goal
Admin sets photo quality and resize size; the couple's browser applies them before upload. Map artwork served as WebP.

## Notes
- Fields `webpQuality` (40-100, default 80) and `resizeTo` (600-8000 px, default 2048) in the existing `asset_limits` setting. No schema change.
- Compression happens in the browser; the API does not enforce it (it still enforces size and dimension limits).
- Release order: API first (admin screen needs the new `ranges`), then admin and couple.
- Also fixes the couple `opening-content` test broken by cf6aa97.
- Guest uploads (apps/web) are unchanged.

## Gates
- [x] G1 scope  - [ ] G2 static  - [x] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (admin input, validated by range)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [ ] A new upload in the couple app is resized to the admin's setting
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
