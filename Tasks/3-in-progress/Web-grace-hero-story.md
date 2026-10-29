# Web-grace-hero-story

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-hero-story), 2026-10-29
- **Worktree:** `Mongkolka/grace-hero-story/` · **Branch:** `feat/grace-hero-story`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Hero.tsx, grace/Story.tsx, grace/strings/hero.ts, grace/strings/story.ts

## Goal
Replace the `GraceHero` and `GraceStory` stubs. Hero: the couple's photo (`content.coverPhotoUrl`) in the gold arch frame, names in script type, wedding date, small cross, scroll cue, soft monogram fallback when there is no photo, petals only while in view. Story: the love story (`content.loveStory`) in a soft white card with a gold divider; empty story renders nothing.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (no runner for templates: pure helpers only)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Hero with and without a photo; a broken photo URL falls back to the monogram
- [ ] Names and date from `couple`; long names wrap at 320px; Khmer names use the Khmer serif
- [ ] Story renders line breaks safely (no HTML injection) and returns null when empty
- [ ] Reduced motion respected; petals pause off-screen
- [ ] English and Khmer strings
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
