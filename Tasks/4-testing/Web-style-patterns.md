# Builder: background pattern choice

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · new feature, shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-style-patterns/` · **Branch:** `feat/style-patterns`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** `Tasks/_plans/Web-site-style.md`
- **Depends on:** Web-style-fonts, Web-corners-front
- **Touches:** `packages/templates/src/{types.ts,site-renderer.tsx,ornament/kbach/**}`, `apps/couple/src/features/website/components/theme-editor.tsx`, builder canvas

## Goal
A couple picks None, Diamond weave, Lotus lattice or Falling blossom and sees it in the builder before saving, on all templates. A separate switch turns the corners on or off.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (stored choice rendered back)  - [ ] G7 docs sync
- [x] G8 commit message  - [ ] G9 human review  - [x] G11 changelog

## Done when
- [ ] Owner approves the two new patterns
- [ ] Canvas preview stays inside the canvas
- [ ] Unknown or missing ids render today's pattern
- [ ] Text contrast unchanged; checked at 360px and desktop
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (built, not committed)
- Templates 395/395, couple 88/88, typecheck clean for templates, couple and web. Web and couple builds passed (couple before the last two clear-grounds edits). Templates lint has the same 36 errors as `main`.
- Headless Chrome at 390px, live API read-only with the choice injected into responses: Covenant (lotus, blossom, corners off/on) and diamond on ten other templates.
- On non-Covenant templates, section tints and drawn textures matching the page colour are lifted when a pattern is chosen. Dark bands and photos stay. Emerald uses a darker section colour than its page, so the pattern barely shows there.
- Not checked: couple Design panel (needs sign-in), builder preview, desktop, real phone.
- Seen: web builds sometimes fail downloading Google Fonts (network); a retry passes.
- G5 code review and G6 security not run.

## Merged and deployed (2026-11-28)
Merged to `main`; on it templates 395/395, couple 88/88, web and couple builds pass (second attempt, Google Fonts download failed on the first). Web and couple deployed. Live `/vutha-sonita` at 390px: no errors, default look unchanged.
Why still in `4-testing`: Design panel and builder preview not seen signed in; owner approval of the two new patterns open; reviews not run.
