# Video: smaller play button, autoplay on scroll

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, third-party embed behaviour (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-video-autoplay/` · **Branch:** `feat/video-autoplay`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** none
- **Depends on:** none
- **Touches:** `packages/templates/src/sections/covenant/{Video.tsx,VideoVariants.tsx,video-player.tsx,video-logic.ts,covenant-styles.ts,*.test.ts}`

## Goal
The video starts muted when the guest scrolls to it and pauses when it leaves the screen. The play button is smaller.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [x] G4 run it
- [ ] G5 code review  - [ ] G6 security (third-party player loads without a tap)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Autoplays muted on scroll; pauses off screen; manual pause is respected
- [ ] No autoplay in builder thumbnails or with reduced motion
- [ ] Checked on a real phone
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- One shared player for all five video styles; play button 72px to 52px.
- Templates 398/398, typecheck clean, web and couple builds pass. Lint: one `no-img-element` rule-not-defined error, same as the old files.
- Headless Chrome, 390px, built web served locally, live API read-only (`vutha-sonita`): no iframe before scrolling, then muted and playing, paused when scrolled away, playing again on return.
- Privacy change: the youtube-nocookie player now loads on scroll, not only after a tap.
- Not checked: real phone (iOS Safari, in-app browsers), builder canvas and thumbnails, the other four styles in a browser. G5 code review and G6 security not run.

## Merged (2026-11-28)
Owner asked to commit, merge, push and deploy. On merged `main`: templates 398/398, couple 91/91, web 14/14, couple and web builds pass. Why in `4-testing`: real phone, builder and the other styles not checked, G5 code review and G6 security not run.
