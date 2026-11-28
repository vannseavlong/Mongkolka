# Builder: font choices in presets and pickers, panel renamed to Design

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · new feature, shared package, 3 apps (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-style-fonts/` · **Branch:** `feat/style-fonts`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** `Tasks/_plans/Web-site-style.md`
- **Depends on:** none (owner decisions are in the plan)
- **Touches:** `packages/templates/src/**` (types, presets, renderer, sections using plain serif/sans), `apps/web/src/app/{globals.css,[slug]/**}`, `apps/couple/src/app/globals.css`, `apps/web/src/app/layout.tsx`, `apps/couple/src/app/layout.tsx`, `apps/couple/src/features/website/{components/theme-editor.tsx,workspace/inspector.tsx,workspace/workspace.tsx,data/schema.ts}`

## Goal
On any template, a couple picks Khmer and English fonts (in a preset or one by one) and sees it on the canvas and the public site.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (stored choice rendered back)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Panel renamed everywhere, including the narrow-width switcher
- [ ] Unknown or missing ids render the template default
- [ ] Saving colours keeps the font choice; reset clears both
- [ ] Covenant sections checked in Khmer and English at 360px (no clipped Khmer marks)
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Templates 390/390, couple 88/88, typecheck clean, web and couple builds pass. Templates lint has the same 36 errors as `main`.
- Seen in a browser: all 12 faces load from the built web app on a sample page.
- Not checked: couple Design panel (needs sign-in), builder canvas, a real site with chosen fonts on any template, 360px, the couple app's faces.
- Known limits: the small label face of the Ink and Kbach packs is unchanged; the photo viewer opens outside the site root, so it keeps default fonts; Kids' rounded face follows the English heading choice.
- Existing sites keep their fonts until the couple picks one. Presets now also set fonts.
- G5 code review and G6 security not run.

## Merged and deployed (2026-11-28)
Merged to `main`, web and couple deployed. Added before commit: the font wrapper is always rendered, so previewing a design does not remount the site.
Why still in `4-testing`: Design panel, builder preview and a site with chosen fonts not seen; G5 code review and G6 security not run.
