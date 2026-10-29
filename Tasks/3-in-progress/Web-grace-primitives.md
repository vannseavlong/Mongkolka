# Web-grace-primitives

- **ID:** T-0022
- **Repo:** packages/templates, apps/web, apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package and layouts (auto picker) (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-primitives), 2026-10-29
- **Worktree:** `Mongkolka/grace-primitives/` · **Branch:** `feat/grace-primitives`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, docs/tasks/template.md, docs/backend-schema.md
- **Depends on:** none
- **Touches:** packages/templates/src/sections/grace/shared.tsx (new), packages/templates/src/sections/grace/strings/ (new, scaffold only), apps/web/src/app/layout.tsx, apps/couple/src/app/layout.tsx

## Goal
Design primitives for the Grace pink, gold and white pack, in one new folder; no registry or i18n edits (those come in the skeleton task).

- `shared.tsx`: palette helpers derived from the 4 theme keys (pink ground = bg, white card surface, gold foil gradient from accent, deep text), `Cross` (original SVG, plain Latin cross with an optional floral spray), `GoldDivider`, `Petals` (falling petals, respects reduced motion), `ArchFrame` (gold-line arch photo frame, with a monogram fallback when no photo), `Reveal` (scroll reveal), script/display font tokens.
- `--font-script` (for example Great Vibes) added in the web and couple layouts with a `cursive` fallback; Khmer names use the existing Khmer serif.
- `strings/` scaffold: one file per section (`opening.ts`, `hero.ts`, `verse.ts`, `story.ts`, `gallery.ts`, `details.ts`, `guestbook.ts`, `rsvp.ts`, `footer.ts`), each exporting `{ en: {}, kh: {} }`, plus an `index.ts` that merges them. Not wired into i18n yet.
- Palette starting values: bg near `#fff3f6`, text `#4a2c35`, accent near `#8a6418`; adjust until text and accent are at least 4.5:1 on bg (use `contrastRatio`), and record the final values in the file and the task.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean for templates, web, couple; next build web passes on rerun; grace folder eslint clean; packages/templates has pre-existing lint errors)  - [ ] G3 tests (no runner)  - [~] G4 run it (throwaway preview page, headless Chrome, 320 px iframe and 1200 px, reduced motion; page deleted)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Cross, divider, petals, arch frame and reveal render at 320px and 1200px
- [ ] Reduced-motion users get no animation
- [ ] Contrast script shows text and accent at least 4.5:1 on the final bg
- [ ] Original artwork only (no copied illustrations)
- [ ] No registry, i18n, or seed edits in this task
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit bd01007 on `feat/grace-primitives`, not merged. `sections/grace/shared.tsx` (gracePalette, foilGradient, foilTextStyle, Cross, GoldDivider, Petals, ArchFrame, Reveal, GraceSection, initialsOf, nameFont, SCRIPT_FONT), `grace/strings/*` scaffold with GRACE_EN/GRACE_KH (not wired), `--font-script` (Great Vibes) in apps/web and apps/couple layouts (couple had no font setup at all; only the variable was added).
Palette: bg #fff3f6, text #4a2c35 (11.39:1), accent #8a6418 (4.95:1 on bg, 5.36:1 on white). Recorded in a comment at the top of shared.tsx for the skeleton seed.
Not verified: photo fallback with a real photo, petal motion beyond static frames, the script font in a real couple-app run, the first `next build` once failed during a parallel tsc and passed on rerun (cause unknown), the eighth lint error in packages/templates not diffed against main. Tests deferred (pure helpers ready).
Next: G5 review, G7, G8, G11.

## Review 2026-10-29 (fresh agent, G5; tsc and web build pass; eslint same 8 errors as main, none in grace/)
No blockers. First-build failure: no real cause found (no import cycle; most likely a race between a parallel tsc and Next's generated types).
Sent back: 1 hydration mismatch for reduced-motion users (Petals, Reveal); 2 Reveal content invisible without JS or IntersectionObserver (and print); 3 foilTextStyle makes text invisible where color-mix is unsupported (transparent fill + dropped gradient); 4 ArchFrame has no image error fallback, no object-position, no lazy loading, alt defaults to empty, monogram may overflow at 320 px; 5 Petals animate forever off-screen, no will-change, fall distance uses vh; 6 GraceSection takes language as a prop defaulting to "en" (should read useLanguage()).
Nits sent back: cross spray overlap check, duplicate-key warning for merged strings, server-component import comment, preload false for the couple layout font, hyphenated initials.
