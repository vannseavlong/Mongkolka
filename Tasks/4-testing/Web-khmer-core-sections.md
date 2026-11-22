# Web-khmer-core-sections

- **ID:** T-0049
- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, new context in the shared renderer (auto picker, see `PIPELINE.md`)
- **Claimed by:** none (finished 2026-11-22)
- **Worktree:** `Mongkolka/mongkolka-khmer-core-sections/` · **Branch:** `feat/khmer-core-sections` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `Tasks/1-backlog/Web-khmer-templates-waves.md` (3a), `khmer-einvite-reference/templates/*.md`
- **Depends on:** Web-khmer-section-keys, Web-khmer-chrome, Web-khmer-skeleton (all merged into the integration branch)
- **Touches:** `packages/templates/src/sections/khmer/**` (replace stubs, add ornaments, skin context, logic + tests), `packages/templates/src/site-renderer.tsx` (provide skin context only), `packages/templates/src/index.ts`. Does NOT touch registry.ts, seeds or i18n.tsx.

## Goal
Replace the Khmer section stubs with premium shared sections (`invitation_khmer`, `agenda_khmer`, `letters_khmer`, `details_khmer`) and a skin-ornament contract so each skin can look different (corner, divider, crest, icons, card surface, heading foil, motion) without forking section code.

## Gates
- [x] G1 scope (templates only: sections/khmer, site-renderer.tsx, index.ts)  - [x] G2 tsc clean in templates/web/couple; eslint only the existing missing `@next/next` plugin error on `<img>` comments
- [x] G3 49 template tests pass (logic, render, skin override)  - [x] G4 rendered in a temporary web page (deleted): about 590px wide dark/KH, light/EN, and a 360px iframe with no horizontal overflow
- [ ] G5 code review  - [x] G7 docs: contract below  - [x] G8 committed locally `ca4b452`, merged into feat/khmer-einvite-integration
- [ ] G11 changelog (at merge to main)

## Contract
- `SkinOrnaments` (sections/khmer/skin-ornament-types.ts): Corner, Divider, Crest, icons (9 AgendaIcon), corners, inset, radius, surface(theme), heading(theme, lang), iconStroke, motion (`shimmer|float|still`).
- A skin registers by replacing its own line in `sections/khmer/skin-ornaments.ts` (`SKIN_ORNAMENTS.<skin> = <SKIN>_ORNAMENTS` imported from its folder). All six currently use `DEFAULT_ORNAMENTS`.
- Skin resolved by `skinFromComponents(template.default_components)` from `opening_<skin>` / `hero_<skin>` ids; `SiteRenderer` wraps sections in `SkinProvider`. No DB field.
- Shared frame: `OrnateSection`; pure logic in date-lines, lineage, agenda-logic, invitation-logic, foil, skin-resolve.

## Not verified
Real device and browser widths below 345px; tablet/desktop; Khmer wording (formal greeting, ritual names, tea/ring/cake titles) needs a native speaker; no QR (no encoder in repo, would need a dependency), no map embed; reduced-motion not exercised; real countdown tick across the event day; builder canvas rendering.
