# Web-cover-sequence

- **ID:** T-0069
- **Repo:** packages/templates + apps/couple (+ check apps/web)
- **Owner:** SNLRLONG
- **Tier:** T2 · edits shared `SiteRenderer` used by builder and public site (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** none (user works in the main checkout)
- **Started / updated:** - / 2026-11-25
- **Docs:** `Tasks/_plans/Web-cover-section.md` (see "Contract")
- **Depends on:** API-cover-section-key
- **Touches:** `packages/templates/src/site-renderer.tsx`, `registry.ts` (cover slot), `apps/couple/src/features/website/preview/preview-frame.tsx`, `workspace/site-canvas.tsx` (Replay)

## Goal
`SiteRenderer` plays `cover` -> reveals the opening gate (mounted only at reveal) -> rest of the site, per the plan's contract. The builder preview treats `cover` like the opening gate and Replay restarts it.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (sequence logic as a pure function)  - [ ] G4 run it (builder and public site, reduced motion, cover on/opening off, cover off)
- [ ] G5 code review  - [ ] G6 n/a (no auth, data or input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [ ] Opening animation does not start until the cover reveals
- [ ] Tap skips; reduced motion shows a static cover; disabled cover leaves today's behaviour unchanged
- [ ] Builder: selecting Cover in Section mode shows and plays it; frame never grows for it
- [ ] Root `CHANGELOG.md` entry added `[Web]`

## Status (2026-11-25)
Built. `SiteRenderer` holds the body until the cover reveals, then mounts the opening gate beneath; `coverPreview` keeps style thumbnails playing; builder preview frame treats cover like the opening gate and Replay covers both. G2 pass; G3: `site-renderer.cover.test.ts` + `cover-phase.test.ts` (281/281 in templates). Not done: G4 in a browser (builder + public site, reduced motion), G5, G8, G11.
