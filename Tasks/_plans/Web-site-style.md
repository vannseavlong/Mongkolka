# Plan: couples choose fonts and background pattern

Written 2026-11-28 (task-planner). Nothing built yet.

## Goal
In the builder, a couple picks a Khmer font set, an English font set and a background pattern, next to colours. The panel "Colors & palette" is renamed.

## Flow
| Step | State |
|---|---|
| Couple opens Website → Builder → panel (`inspector.tsx`) | change: new name |
| Picks palette and colours (`theme-editor.tsx`) | exists |
| Picks Khmer fonts, English fonts, pattern; sees them on the canvas before saving | new |
| Save: `PATCH /couple/api/website/theme { theme_override }` | exists, gains keys |
| Public site and previews resolve the theme and apply fonts and pattern | new |

## Screens and states
One panel: Palettes, Colours, Fonts (Khmer, English), Background. Each font option shows a sample in its own face. Saving, error and "Reset to template" follow the existing editor. "Template default" is always the first option. Check at 360px.

## Data and API
- Three optional keys in `theme_override`: `khmer_font`, `latin_font`, `pattern`, each a short id.
- No API or schema change: the field is stored as JSON. The renderer maps ids through a fixed list and falls back to the default for unknown values, so a bad value cannot inject CSS. Server allow-listing is the alternative; it costs an API release per new option.
- Site-wide only. Section `color_override` does not get these keys.

## How it works
- Fonts: section components already read CSS variables (`--font-moul`, `--font-battambang`, `--font-cinzel`, `--font-script`). The site root overrides them per choice, so components are not edited one by one. Some text may use other stacks; check each section.
- New faces load through `next/font/google` in `apps/web` and `apps/couple` layouts with `preload: false`, so guests download only the chosen face. No new package.
- Patterns: drawn in code, coloured from the accent, as `KbachBackdrop` does today.

Proposed options (Google Fonts; owner approves by sample):

| Set | Heading | Body / script |
|---|---|---|
| Khmer 1 (today) | Moul | Battambang |
| Khmer 2 | Moulpali | Siemreap |
| Khmer 3 | Koulen | Kantumruy Pro |
| English 1 (today) | Cinzel | Great Vibes |
| English 2 | Cormorant Garamond | Dancing Script |
| English 3 | Playfair Display | Parisienne |

Patterns: None, Diamond weave (today), Lotus lattice, Falling blossom (still, not animated).

## Gaps and decisions
- `theme-editor.tsx` builds the override from colours and `font_style` only, so saving colours would drop the new keys. It must carry them.
- Applying a template clears `theme_override`, which also resets these choices. Keep that behaviour.
- The builder canvas deliberately hides the pattern (a fixed layer would escape it). A contained version is needed, or couples choose blind.
- The existing Serif/Sans `font_style` stays for templates that use it; hide it on Covenant once font sets exist.
- Covenant first. Other skins use different faces and need their own check.

## Owner decisions (2026-11-28)
1. Panel name: **Design**.
2. Fonts are part of the design presets, with separate pickers below them, like the colour fields. Roles: Khmer heading, Khmer body, English heading, English script.
3. **All templates**, not Covenant only. Template default stays the first option of every picker.
4. Corners have their own on/off switch.

These replace the "Covenant first" and "font sets only" points above. Patterns on templates other than Covenant need a check per skin in Web-style-patterns.

## Task breakdown
| Task | Repo | Depends on | Tier | Size |
|---|---|---|---|---|
| Web-style-fonts: rename panel, font sets, loading, apply on site and canvas | web, couple, templates | none | T2 | 1.5 days |
| Web-style-patterns: patterns, picker, canvas preview | couple, templates | Web-style-fonts, Web-corners-front | T2 | 1.5 days |

Sequential: both edit the theme types, renderer and editor.

## Out of scope
Uploading own fonts or pattern images, per-section fonts, admin management of the lists.
