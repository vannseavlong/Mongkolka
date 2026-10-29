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

## Review 2026-10-29 (fresh agent, G5; tsc and eslint clean; rendered in a throwaway page at 320-1440 px; build and API tests not run; reduced motion not emulated)
No blockers. Verified: hydration clean on normal load; ArchFrame onError fallback with a real dead URL (monogram, alt kept); edge cases at 320 px (dead photo, Khmer name and story, undefined couple, one partner name, no date, whitespace-only story, CRLF, 4+ newlines, 200-char unbroken word, emoji and quote-starting paragraphs); formatCoupleNames and formatWeddingDate(…, language) deterministic; accent 4.95:1 on pink and 5.36:1 on white; Khmer rules; Petals and Reveal mount-gated and skipped under reduced motion (by code); string keys and parity; owner-files-only rule.
Sent back: 1 the hero is taller than a laptop viewport (natural content 914 px at 1200 wide, hero 1074 px; at 1440x900 the date is cut and the scroll cue is below the fold; at 320x568 the date is off screen) because the arch is a fixed `max-w-[19rem]`: cap the arch by viewport height and tighten the spacing (also fixes the cropped hero in the couple builder's 1200x750 scaled previews; kbach/Hero and ink/Folio use the same min-h-[100svh] so this is not new); 4 drop cap only when the story starts with a letter.
Accepted: the gold-foil "&" is about 2:1 (decorative, aria-hidden); aria-label on the h1 equals its text apart from the ampersand (harmless).

## Fixes 2026-10-29 (commit 6ad8915; Hero.tsx and Story.tsx only)
Hero height: arch width capped by viewport height (`min(16rem, 36svh*0.75)` on small screens, `min(19rem, 36svh*0.75)` from sm up); the names sit on one row ("Alex & Sam") and wrap to separate lines only when long (saves about 110 px); name font size also capped by svh; padding and gaps tighter; `min-h-[100svh]` kept. Measured in same-origin iframes (hero height / date bottom / cue bottom): 1440x900: 900/704/764; 1366x768: 768/609/669; 1200x750: 750/596/656; 390x844: 844/653/713; 320x568: 568/473/533. Khmer within about 1 px. No horizontal overflow. With very long couple names the hero is taller than the viewport and scrolls, nothing clipped (cue at 943 px at 1440x900). Drop cap only when the paragraph starts with a letter (`/^\p{L}/u`).
Checks: reduced motion forced -> no petals and the layout fits (screenshot at 500x844); no hydration warnings; tsc 0 (templates, web, couple); eslint grace 0; API tests 96/96; next build web and couple exit 0 with no error lines.
Not verified: screenshots at 1440x900, the couple builder's real scaled preview (only a 1200x750 box reproduced), the emoji/quote/digit no-drop-cap cases rendered (guard read from the code).

## Merged to main 2026-10-29
Merged locally with --no-ff after review and fixes; combined typecheck (templates, web, couple, api, admin), grace lint, API tests (96/96), couple lint (0 errors) and production builds of web, couple and admin pass. Moved to 4-testing, not 5-done: no tests for templates (no runner), no fresh re-review of the fix commits, not yet seen in a real template on a running app (template and component rows are still inactive and not seeded), reduced motion and some Safari/real-device checks not done.
