# Web-builder-assets

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new UI for upload (API carries the T3 review) (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/builder-assets/` · **Branch:** `feat/builder-assets` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** API-website-assets, Web-builder-workspace-variants
- **Touches:** apps/couple/src/features/website/components/asset-library*, asset-picker*, section-content-dialog.tsx (gallery/hero fields only)

## Goal
Asset tab in the section panel plus an asset picker used by gallery (multi-select, reorder) and hero cover. Upload with progress, delete with usage warning, quota display.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Upload (drag-drop and picker), progress, error and over-quota states
- [ ] Delete warns when an asset is in use and lists the sections
- [ ] Gallery and hero choose from the library; raw URL input still allowed as advanced option
- [ ] Live canvas updates as soon as an asset is picked
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
