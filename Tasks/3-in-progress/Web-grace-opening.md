# Web-grace-opening

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-opening), 2026-10-29
- **Worktree:** `Mongkolka/grace-opening/` · **Branch:** `feat/grace-opening`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Opening.tsx, grace/strings/opening.ts

## Goal
Replace the `GraceOpening` stub (`opening_grace`) with the real gate: arched gold-line window on a pink gradient, cross at the top of the arch, "Dear {name}" in script type from `guestGreeting` (the `?name=`/`?to=` param, already read by the web page), "You are invited" when there is no name, couple names and date, falling petals, tap/Enter to open (arch doors part), `onOpen` after the animation; keyboard operable, reduced-motion friendly, English and Khmer.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (no runner for templates: pure helpers only)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Name from `?to=` appears; no name shows a graceful fallback; long names wrap at 320px
- [ ] Opening animation plays once, then `onOpen` fires; reduced motion skips the animation but still opens
- [ ] Keyboard: focusable control, Enter/Space opens; focus is not trapped
- [ ] Works full-screen on the public site and inside the builder preview box
- [ ] English and Khmer strings, Khmer names use the Khmer serif
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
