# Web: Khmer backdrop on the Covenant template

- **Repo:** web
- **Owner:** SNLRLONG
- **Tier:** T2 · shared template component, new visual feature (auto picker)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-kbach-backdrop/` · **Branch:** `feat/kbach-backdrop`
- **Started / updated:** - / 2026-11-27
- **Docs:** Tasks/_plans/Web-khmer-backdrop.md
- **Depends on:** Web-kbach-art
- **Touches:** `packages/templates/src/sections/covenant/`, `packages/templates/src/site-renderer.tsx`

## Goal
Apply the approved ornament and light overlay to Covenant sections.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog
- G6 not needed: no auth, data or user input

## Done when
- [ ] Every Covenant section checked at 360px and desktop, in the builder preview too
- [ ] Pattern stays still while scrolling (checked on an iPhone too)
- [ ] Photos and text are never covered; contrast unchanged
- [ ] Other templates render as before
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Note
Built and shipped together with `Web-kbach-art`; see that file for checks and open items.
