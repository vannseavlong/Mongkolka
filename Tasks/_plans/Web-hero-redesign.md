# Plan: Hero redesign, portrait and landscape banners, shadcn pickers

- **Owner:** SNLRLONG · **Planned:** 2026-11-25 · **Prefixes:** Web, API

## Goal
The hero section looked plain in every variant. Give it (1) a banner for tall screens and one for wide screens, uploaded in the Hero > Assets tab, (2) new, nicer designs to choose from, and (3) shadcn date pickers and dropdowns in place of the browser's native ones.

## Done in this pass
| Part | What |
|---|---|
| Banners | `hero` section `content` holds `portraitUrl` and `landscapeUrl` (API-validated http/https image links). `SiteRenderer` merges them with the profile cover photo and picks one by screen orientation (`useOrientation`, `resolveHeroPhoto`: right banner, else the other, else profile cover). Every hero variant just keeps reading `coverPhotoUrl`. |
| Builder | Hero > Assets: Portrait and Landscape cards (preview, Choose or upload via the image library, Remove); profile cover photo kept as a collapsed fallback. |
| New heroes | `hero_cinematic`, `hero_editorial`, `hero_framed` (generic, Khmer and English, motion respects reduced motion). Seeded `active`. |
| Pickers | `DatePicker` (popover + calendar, month and year dropdowns) and `DateTimePicker` (date + 30-minute time dropdown) in `packages/ui`; calendar dropdowns use the shadcn Select. Used by the Opening form, hero/profile wedding date, profile page, register, checklist, RSVP deadline, invitation start, agenda day dates. Native `<select>` replaced with Select in the verse preset and agenda icon. |

## Design proposals (pick which to build next)
1. **Cinematic** (built): full-screen banner with slow drift, soft veil, names large and centered, thin line and scroll cue.
2. **Editorial** (built): split layout, names left and an arched photo right on wide screens; arch first, names below on phones.
3. **Framed** (built): photo in a double gold frame, names across its lower edge, date between diamonds.
4. **Covenant garden** (proposed): the new cover's world (mist, foliage, chandeliers) around the banner, names floating, matching the cover and opening.
5. **Parallax layers** (proposed): banner, floral frame and names move at different speeds on scroll.
6. **Split reveal** (proposed): two halves of the banner slide apart to reveal the names (wide screens), a vertical wipe on phones.
Existing heroes (Classic, Polaroid, Full Bleed, Folio Arch, Kbach Arch, Covenant) are unchanged and can be hidden in admin.

## Not done / decisions
- The new catalog rows exist only in the seed file until `lsdb seed --upsert` runs on the live sheet; the builder lists them after that.
- Banner upload reuses the existing library and limits; no new endpoint.
- Hero text (names, date) still reads the profile, unlike the Opening which has its own inputs. Open question: give the hero its own inputs too (recommended: no, keep it profile-driven).
