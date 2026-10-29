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
- [x] G1 scope (only the four owned files)  - [x] G2 static (tsc clean templates, web, couple; eslint grace clean; next build web and couple pass)  - [x] G3 tests (API 96/96 incl. strings parity; none for templates: no runner)  - [~] G4 run it (headless Chrome via real SiteRenderer in 320-1200 px iframes: photo, no photo, long name, Khmer, long/short story, html text; no hydration warnings)
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

## Status 2026-10-29
Built in commit 23e0024 on `feat/grace-hero-story`, not merged. Hero: soft pink first screen at least full viewport height, small gold cross above the photo in the double-line gold arch (eager load, focus slightly above centre), "Together with their families" label, names stacked on separate lines in large script with a gold ampersand (wraps cleanly at 320 px), thin gold divider with cross, date in spaced serif, "Scroll" cue with a bobbing chevron; petals only while in view; reduced motion turns off petals and chevron; alt = the couple's names; no photo or broken URL shows a pink-to-white gradient with gold script initials ("A&B"); Khmer uses the Khmer serif, no uppercase or letter-spacing. Story: white rounded card with thin gold border and a faint second outline, cross above the title, gold diamond divider below, readable serif capped at about 60 characters, paragraphs from blank lines and single line breaks kept, plain-text rendering confirmed (`<b>html</b>` shows literally), gold drop cap on longer English stories (not Khmer), short stories centred without drop cap, empty returns null, fade up on scroll (none under reduced motion).
Not verified: reduced-motion screenshot not inspected, petals pausing off-screen or tab hidden (shared Petals), broken URL with a live bad URL, hero at 320 px with a photo, Khmer story at 1200 px, real couple photos, owner's judgment of the look.
Next: G5 review, G7, G8, G11.
