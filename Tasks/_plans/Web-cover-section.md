# Plan: Cover section (animated intro before the opening)

- **Owner:** SNLRLONG · **Planned:** 2026-11-25 · **Prefixes:** API, Web
- **First template:** Covenant Gold & Blush (`opening_card_covenant`), more templates later.

## Goal
A new section, `cover`, placed before `opening`. It plays an animated scene first (butterflies, flowers or similar), then **reveals the opening gate**, and only after the guest opens the gate does the rest of the site animate. It is a normal section: couples can turn it on or off, pick a style, and reorder it. Covenant ships two styles.

## Flow
| Step | Who / where | Status |
|---|---|---|
| 1 | Guest opens the link | exists |
| 2 | **Cover plays** (auto, about 4.5 s; tap skips). New | new |
| 3 | Cover fades away and the **opening gate mounts underneath** (so its animation starts only now). New | new |
| 4 | Guest taps "Open the invitation" | exists |
| 5 | Rest of the site renders and animates | exists |
| Builder | Couple sees `Cover` in the section list, toggles it, picks Style, can replay it | change |
| Existing couples | `listSections` appends missing keys **disabled at the end**; they enable and move it up | change |

`SiteRenderer` (shared by builder preview and public site) owns the sequence, so web and builder cannot drift: `cover` -> `opening` -> rest.

## Contract (decided here so tasks can run in parallel)
- Section key: `cover`, ordered **before** `opening` in every `SECTION_KEYS` list.
- Cover component props: `{ couple, theme, guestGreeting?, onReveal(): void, onDone(): void }`.
  - Plays itself; calls `onReveal` when the reveal starts (renderer mounts the opening beneath), then `onDone` when it is fully gone (renderer unmounts it).
  - Must honour `prefers-reduced-motion` (static cover, reveal on tap) and be skippable by tap/Enter.
- No editable content in v1 (names and date come from `couple`). `canEditSection("cover")` is false.
- Registry ids: `cover_covenant_butterflies`, `cover_covenant_garden`. Catalog rows seeded `inactive` until the Covenant template is launched (same as its other rows).
- Original artwork only (SVG/CSS), no copied illustrations.

## Screens and states
- Builder section list: new `Cover` row (toggle, reorder).
- Builder dock: Style tab with the 2 variants; Colors tab as for any section.
- Preview: Cover selected in Section mode plays it; **Replay** restarts it. Treated like the opening gate (full screen, never fitted or grown).
- States: reduced motion, slow image/font load (cover must not block on network), disabled cover (site starts at the opening as today), cover on and opening off (cover reveals the hero directly).

## Data and API
- Enum value `cover` added to: templates `SECTION_KEYS`, API `utils/section-keys.ts`, API `section-components.service.ts` `SECTIONS`, `website_sections` and `section_components` schema enums, admin and couple `WEBSITE_SECTIONS`, couple `SECTION_LABELS`.
- `tests/section-keys.test.ts` already guards drift across all of these; it must pass.
- Seeds: 2 `section_components` rows; Covenant `default_sections` gets `{ cover, enabled: true }` first and `default_components.cover`. No migration of existing rows (see risk).
- No new endpoint, no new field a client sends.

## Gaps and decisions
- **Existing couples on Covenant** will not have a `cover` row. `listSections` appends it disabled at the end. Decision: accept; the builder shows it and they enable and move it. "Reset layout" from the template also fixes it. Backfilling every couple is out of scope.
- **Cover vs a variant of opening:** a separate section was chosen (user request, and independent on/off and order).
- **Sequence ownership:** in `SiteRenderer`, not in each template, so every template gets it for free.
- **Preview frame** (`apps/couple/.../preview-frame.tsx`) currently special-cases `opening`; it must treat `cover` the same.
- `sheet-db schema` is a project T3 signal, so the key task is T3. Security checklist: no input, no auth, no personal data; record "n/a" with reasons.

## Open questions (recommendation in brackets)
1. Auto-advance or wait for a tap? [Auto-play about 4.5 s, tap skips. Fewer guests get stuck on a decorative screen.]
2. Should the cover show the couple's names? [Yes, small, from `couple`; no new content field.]
3. Sound with the cover? [No. Music already starts on the gate tap.]

## Task breakdown
| # | Task | Repo | Depends on | Tier | Size |
|---|---|---|---|---|---|
| 1 | `API-cover-section-key` | api, admin, couple (schema/labels), templates (`types.ts`) | none | T3 | S |
| 2 | `Web-cover-sequence` | templates (`site-renderer`), couple (preview frame), web (check) | 1 | T2 | M |
| 3 | `Web-covenant-cover` | templates (covenant), api seeds | 1 (parallel with 2 using the contract above) | T2 | M |

Parallel: 2 and 3 after 1. They touch different files (`site-renderer.tsx` and the preview frame vs `sections/covenant/` and seeds); merge 2 before 3 is verified end to end.

## Out of scope
- Backfilling existing couples' sections; editable cover text or photo; cover for other templates; sound.
