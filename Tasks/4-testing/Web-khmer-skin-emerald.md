# Web-khmer-skin-emerald

- **ID:** T-0051
- **Repo:** packages/templates (+ apps/api seeds)
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, new catalog seed rows (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude skin agent (emerald), 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-skin-emerald/` · **Branch:** `feat/khmer-skin-emerald` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/templates/05-emerald-kbach-premium.md`
- **Depends on:** section-keys, chrome, skeleton, gift, core sections, review fixes (all merged in the integration branch)
- **Touches:** `packages/templates/src/sections/emerald/**`, own line in `sections/khmer/skin-ornaments.ts`, tiny optional `sectionBackground` hook in `skin-ornament-types.ts` + `OrnateSection.tsx`, own seed block in `apps/api/seeds/site-templates.ts` and own rows in `section-components.ts`

## Goal
`emerald_kbach` pilot skin: double-door 3D opening with a rotating original gold medallion and gold dust, medallion hero in an arched pin-striped frame, Art-Deco/kbach ornament set for the shared sections, lattice backdrop. Original SVG/CSS only.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean; eslint only the known missing @next/next plugin rule)  - [x] G3 tests (templates 75, api 142 pass)  - [x] G4 run it (esbuild harness through the real SiteRenderer, 390px iframe, EN and KH, chrome on)
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 commit  - [ ] G11 changelog

## Done / commits
- `21f73ac feat(templates): emerald kbach skin with 3D door opening, medallion hero and ornaments` on `feat/khmer-skin-emerald`, merged into `feat/khmer-einvite-integration`. Not pushed.
- Seed: `emerald_kbach` block now uses `registry: "registry_khqr"` and `music: { icon: "disc" }`; still inactive.

## Shared-file changes (tiny)
- `sections/khmer/skin-ornament-types.ts`: optional `sectionBackground?(theme)`; `OrnateSection.tsx` spreads it over the default glow. Other skins can use it too.
- `sections/khmer/skin-ornaments.ts`: own line only.

## Not verified
- Real device Safari/iOS and Android (3D door swing, autoplay), reduced-motion pass in a browser (CSS and hook are in place, covered by render test only), tablet/desktop widths, builder canvas, Khmer wording (native speaker), `registry_khqr` seed activation, G5 review, G11 changelog.
- Hero shows only the solar date; the typed lunar line lives in the invitation section (HeroContent has no lunar field).
- Chrome dock labels truncate at 390px (chrome task, not this skin).
