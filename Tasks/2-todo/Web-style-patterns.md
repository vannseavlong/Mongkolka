# Builder: background pattern choice

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · new feature, shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-style-patterns/` · **Branch:** `feat/style-patterns`
- **Started / updated:** - / 2026-11-28
- **Docs:** `Tasks/_plans/Web-site-style.md`
- **Depends on:** Web-style-fonts, Web-corners-front
- **Touches:** `packages/templates/src/{types.ts,site-renderer.tsx,ornament/kbach/**}`, `apps/couple/src/features/website/components/theme-editor.tsx`, builder canvas

## Goal
A couple picks None, Diamond weave, Lotus lattice or Falling blossom and sees it in the builder before saving, on all templates. A separate switch turns the corners on or off.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (stored choice rendered back)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G11 changelog

## Done when
- [ ] Owner approves the two new patterns
- [ ] Canvas preview stays inside the canvas
- [ ] Unknown or missing ids render today's pattern
- [ ] Text contrast unchanged; checked at 360px and desktop
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
