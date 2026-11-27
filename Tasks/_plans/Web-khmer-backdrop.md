# Plan: Khmer carving patterns and soft overlays behind the wedding site

Written 2026-11-27 (task-planner). Nothing built yet.

## Goal
The couple site (first: Covenant Gold & Blush, live as `vutha-nita`) feels empty. Add Angkor-inspired ornament and a few soft overlays without competing with photos or text.

## What the live site shows
- Most sections are flat pale pink; on desktop the content column leaves wide empty margins.
- Overlays today: a low-density petal and gold dust layer, and radial pink glows.
- Ornament today: floral corners and a cross divider. No Khmer pattern in this skin (`khmer_kbach` and the emerald skin have their own).

## Research (secondary sources, partly inconsistent)
| Motif | What it is | Use here |
|---|---|---|
| Wall "tapestry" medallions: interlaced rounds, roughly 12-20 cm, imitating woven cloth; four-petal flower inside a diamond | Carved wall backgrounds at Angkor Wat | Faint repeating pattern behind sections |
| Lotus petal band (kbach trabak chuk) | Border ornament, Angkor style | Thin band where one section meets the next |
| Vine scrolls (kbach phni voa) and snail curls (kbach hien) | Flowing foliage ornament | Section corners and side margins |
| Flame style (kbach phni phleung), devata, apsara, naga | Flame leaves and sacred figures | Not used (see decisions) |

Sources: https://en.wikipedia.org/wiki/Kbach · https://khmerimagery.blogspot.com/2017/?m=0 (V. Roveda) · https://angkordatabase.asia/libs/docs/publications/angkor-vogue-sculpted-evidence-of-imported-luxury-textiles-in-the-courts-of-kings-and-temples/gillian-green-angkor-vogue.pdf (G. Green)

No open-licensed kbach vector set was confirmed.

## Design layers (quiet by default)
1. Medallion lattice, accent colour, about 4-7% opacity, fading out behind the central card.
2. Lotus petal band at selected section edges.
3. Vine scroll in two opposite corners; on wide screens it fills the side margins.
4. Soft warm light from the top of a section (gradient only).

Rules: nothing drawn over photos or text; no new animation (petals already move); text contrast unchanged; check at 360px and desktop.

## Technical approach
- Own SVG art in `packages/templates`, coloured from the theme accent, no image downloads, no new package.
- `site-renderer.tsx` renders the fixed layer once for the Covenant skin.
- No API, sheet or seed change. Seeding `site-templates` is avoided: it could overwrite template rows edited in admin.
- Owner decision (2026-11-27): the pattern stays fixed while the page scrolls. One fixed layer behind the page replaces the per-section layers: Covenant section grounds must let it show through, and the builder preview needs its own contained version (a fixed layer would escape the canvas). The lotus band stays a divider that scrolls.

## Decisions
- Floral and geometric motifs only. The live couple's wedding is Christian, so no deities, apsara, naga or temple shrine figures.
- Covenant first; other skins later.

## Open questions (recommendation first)
1. Motifs: floral and geometric only, or also an Angkor tower silhouette? Recommend floral only.
2. Scope: Covenant only, or every template? Recommend Covenant first.
3. Strength: quiet or clearly visible? Recommend quiet; approve on the preview.
4. Art: drawn in code by us, or from an illustrator? Recommend ours for a first version; an illustrator if authenticity matters more than time.

## Tasks
| Task | Depends on | Tier | Size |
|---|---|---|---|
| Web-kbach-art: motifs and a preview to approve | questions above | T2 | 1 day |
| Web-kbach-backdrop: apply to Covenant | Web-kbach-art | T2 | 1 day |

Sequential (same files). Deploying web afterwards must keep `apps/web/share-previews.txt`.

## Out of scope
Other skins, a couple on/off setting (needs API), new animation.

## Update 2026-11-27 (owner approved)
- Reference studied for layout only: https://e-inviation-page.vercel.app/ (none of its artwork is copied).
- Art is now a diamond weave, gold flame-leaf corners and the lotus band; the medallion lattice and vine corner are dropped. Flame leaves replace the earlier "not used" note; figures stay excluded.
- Map step 1: this couple's map redrawn (`stock-image/map-themed.py` writes `map-themed.svg`; not in git).
- Map step 2: venue info card beside the map in the Covenant map section (add to Web-kbach-backdrop scope or its own task). No API change.
