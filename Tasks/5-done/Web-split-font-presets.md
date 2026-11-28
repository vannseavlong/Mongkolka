# Builder: separate theme presets and font presets

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, builder feature (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-split-font-presets/` · **Branch:** `feat/split-font-presets`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** `Tasks/_plans/Web-site-style.md` (changes owner decision 2: fonts are no longer part of the design presets)
- **Depends on:** Web-style-fonts, Web-style-patterns (both merged)
- **Touches:** `packages/templates/src/{theme-presets.ts,font-presets.ts,index.ts,*.test.ts}`, `apps/couple/src/features/website/{components,lib}/**`, `packages/templates/src/site-fonts.tsx`

## Goal
In the Design panel a theme preset changes colours and background only; a font preset changes fonts only.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (stored choice rendered back)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [x] Picking a theme preset keeps the chosen fonts, and the reverse
- [ ] Hover preview and Save work for both
- [ ] Checked at 360px
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Theme presets: colours, pattern, corners. New font presets: Template default, Classic Khmer, Elegant, Romantic, Garden, Modern (names need owner approval).
- Templates 395/395, couple 91/91, typecheck clean for both, couple build passes, no lint errors in changed couple files.
- No API or data change; saved designs keep their look.
- Not checked: Design panel in a browser (needs sign-in), 360px, web build. G5 code review and G6 security not run.
- Fix (owner report; bug from Web-style-fonts): Siemreap lacks Latin letters, so next/font's Arial stand-in drew English text oversized (Romantic preset). Siemreap's stack now names the face directly. `adjustFontFallback: false` was tried first and dropped: the Turbopack production build ignores it.

## Merged (2026-11-28)
- Owner checked the panel and the first fix locally (webpack dev) and asked to commit, merge, push and deploy. The final form of the fix was verified by rendering the production CSS in headless Chrome, not in the builder.
- On merged `main`: templates 396/396, couple 91/91, web tests 14/14, couple and web builds pass (second attempt, Google Fonts download failed on the first).
- Why in `4-testing`: live panel and live site not checked signed in, 360px not checked, G5 code review and G6 security not run.

## Closed (2026-11-28)
Owner asked to close: worktree and branch removed, moved to `5-done`. Skipped G4 live/360px check, G5 code review, G6 security: not run.
