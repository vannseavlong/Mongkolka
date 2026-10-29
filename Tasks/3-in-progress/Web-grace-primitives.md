# Web-grace-primitives

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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
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
