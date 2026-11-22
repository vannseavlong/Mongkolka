# Plan: Six Khmer e-invitation templates (studied from @sambot.online)

Written by the task-planner skill, 2026-11-21. Nothing built yet. Source: `khmer-einvite-reference/` (README master checklist + `templates/01..06-*.md` + palettes). The reference is **inspiration only**: copy structure, technique and quality bar, never their art, crests, mascots or branding.

## Goal
Six site templates that feel like the reference studio's: ceremonial opening, constant ambient motion, full Khmer formality (parents, lunar date, ritual agenda, gratitude + apology letters) plus modern utility (countdown, map, KHQR gift, live guestbook, music).

| # | Template id (proposed) | Theme | Notes |
|---|---|---|---|
| 05 | `emerald_kbach` | Emerald & Gold Kbach Premium (dark) | **Pilot.** Not the same as existing `khmer_kbach` (crimson). |
| 01 | `royal_garden` | Ivory, champagne gold, dusty pink, sage | Gold gate opening, doves + petals |
| 04 | `royal_cream` | Cream parchment & gold | Envelope opening, vinyl music icon |
| 03 | `sakura_romance` | Blush, lavender, magenta, gold | Light-burst opening, sakura petals |
| 02 | `fairytale_storybook` | Baby blue, royal blue, pink | Storybook-cover opening, butterflies |
| 06 | `kids_fantasy_birthday` | Rose, berry, cream, mint, lavender | Birthday event, party timeline, **original** mascots |

02 and 03 were studied as video reels; we build them as **web skins** (the README's build prompts treat all six as web themes). A video export is out of scope.

## Key insight (drives the whole plan)
One skeleton, six skins. Build the missing shared sections once, theme-driven, then each template is a thin skin: opening + hero + ornament set + particles + palette + seed row. Without this, six templates means six copies of invitation/agenda/letters code.

## Flow (exists / change / new)
| # | Step | State |
|---|---|---|
| 1 | `?to=` / `?name=` guest name reaches the opening as `guestGreeting` | exists |
| 2 | Cover gate with monogram, Khmer greeting, pill CTA; tap opens and starts music | opening mechanism exists; **new** component per template; music-on-tap **new** |
| 3 | Hero (couple photo in arched frame, names, date) | exists as mechanism; **new** skin per template |
| 4 | Formal invitation: groom's parents left, bride's parents right, crest centre, English version | **new section `invitation`** |
| 5 | Date block: Khmer lunar line + solar date | **new** (lunar text typed by the couple, see decisions) |
| 6 | Countdown that becomes "Wedding Day" / "Event Started" | **new** (inside `invitation`) |
| 7 | Agenda, vertical timeline grouped by day, icon per ritual | **new section `agenda`** (`timeline` is love-story chapters, not rituals) |
| 8 | Location: venue image, "view location" button, QR | `details` exists; **change**: add map URL |
| 9 | Gallery with lightbox | exists (`gallery_*`) |
| 10 | Gift: KHQR image + copy account number | `registry` is links only; **new** `gift` content (T3, payment data) |
| 11 | Gratitude + apology letters, KH/EN | **new section `letters`** |
| 12 | Guestbook with live feed | exists (`guestbook_wall`, Grace skin) |
| 13 | Persistent music toggle, bottom glass dock, particle layer, scroll reveals | **new** shared chrome in the renderer |
| 14 | Template sets section order and default components | exists (`default_sections`, `default_components`) |

## Screens and states
Every new section needs loading/empty/error/no-permission where it applies, a 360px check, Khmer and English, and reduced-motion support (AGENTS.md Definition of Done). Empty content returns nothing (existing rule). No music file / blocked autoplay: the toggle starts off and the tap handler is the only starter. Countdown after the date: "Event Started" then hidden after the day. Dock hides sections that are disabled.

## Data and API (smallest change that works)
- **New section keys** `invitation`, `agenda`, `letters`: same 6-place wiring as the Grace `verse`/`footer` task (`types.ts` SECTION_KEYS, `apps/api` section schemas and `couple-website.service.ts`, couple `WEBSITE_SECTIONS` + labels + editor, web `buildContent`). Content lives in `website_sections.content`; no new tables.
- **Content shapes (proposal, to confirm in the keys task):**
  - `InvitationContent { groom: {nameKh, nameEn, fatherKh?, fatherEn?, motherKh?, motherEn?}, bride: {...}, monogram?, lunarKh?, solarKh?, startsAt? (ISO with offset), greetingKh?, greetingEn? }`
  - `AgendaContent { days: { date: string, items: { time: string, titleKh?, titleEn?, icon?: AgendaIcon }[] }[] }` with a fixed icon enum (monk, procession, scissors, thread, ring, tea, dinner, party, cake).
  - `LettersContent { gratitudeKh?, gratitudeEn?, apologyKh?, apologyEn? }`
  - `DetailsContent` gains `mapUrl?`, `venueImageUrl?` (additive, optional).
  - `GiftContent { khqrImageUrl?, bank?, accountName?, accountNumber? }` stored on the existing `registry` section.
- **Lunar date:** the couple types it (per the reference config). Auto-conversion needs a Khmer lunar calendar library; recommend not now (dependency, correctness risk, religious-calendar accuracy). Alternative: add a vetted converter later, cost = new package + test table.
- **Server rules:** `startsAt` and `mapUrl` validated server-side (ISO date, `https` only, no `javascript:`); text length caps; money fields none (no amounts, display only). Timezone: store the ISO with offset, render in `Asia/Phnom_Penh`.
- **Theme:** only 4 keys exist (bg, text, accent, font). Dark emerald = bg, gold = accent (as Grace did: derived gold tints with `mix`, validated with `contrastRatio`). Gold gradient comes from the accent, not a new key. Per-template extras (ornament set, particle kind, opening) are component-level, not theme keys.
- **Fonts:** add Moul, Battambang (or Kantumruy Pro), Cinzel, Pinyon/Great Vibes (exists), Fredoka (kids only) via `next/font/google` in `apps/web` and `apps/couple` layouts, `display: swap`, subset khmer, and load Fredoka only where the kids template needs it to protect page weight.
- **Seeds:** one `site_templates` row + `section_components` rows per template, all seeded **inactive** until the owner approves, same as Grace.
- **Audio:** no copyrighted music ships. The `music` section holds the couple's own file/URL.
- **Artwork:** original SVG/CSS only (kbach flame/lotus, doves, butterflies, florals). The kids mascots are drawn from scratch; no licensed characters; nothing traced from the reference.

## Gaps and decisions
| Gap | Decision |
|---|---|
| Name clash with existing `khmer_kbach` (crimson) | New id `emerald_kbach`, slug `emerald-gold-kbach`. |
| Six copies of formal invitation/agenda/letters | Shared themed sections `invitation_khmer`, `agenda_khmer`, `letters_khmer`; skins change ornaments via props/CSS vars. |
| No persistent chrome (dock, music toggle, particles) | One `SiteChrome` in the renderer, enabled per template via template config; honours `prefers-reduced-motion`. |
| Particles cost on low-end phones | CSS/SVG particles first, cap count by viewport, pause when tab hidden; canvas only if measured necessary. |
| Reference thumbnails are 180x320 | Colour and composition only; layout comes from the md breakdowns. |
| Gift account number is payment data | Own T3 task with the OWASP pass; display + copy only; no amounts, no collection. |
| Parallel task collisions in registry/i18n/seeds | Skeleton task registers all ids as stubs and wires per-skin string files first (Grace precedent). |

## Open questions (planning continues; recommendation used)
1. Lunar date typed by the couple, or auto-computed? Recommend typed now, converter later.
2. All six, or start with a subset? Recommend pilot `emerald_kbach`, then the other five in parallel; the kids birthday last (new event type: party timeline, no parents/ritual blocks).
3. Do we label the kids template for birthdays only (event type)? Recommend yes; wedding-only copy is hardcoded in nothing, all strings come from content.
4. Music default? Recommend off until the first tap, then on.
5. Who reviews Khmer copy? Recommend a native speaker before activation.
6. Final template names/slugs: use the proposals above unless the owner changes them.

## Task breakdown
| Order | Task | Repo | Depends on | Tier | Size |
|---|---|---|---|---|---|
| 1a | `Web-khmer-section-keys` | templates, api, couple, web | none | T2 | L |
| 1b | `Web-khmer-chrome` | templates, web, couple (fonts) | none | T2 | M |
| 2 | `Web-khmer-skeleton` | templates, api seeds | 1a, 1b | T2 | M |
| 3a | `Web-khmer-core-sections` (invitation, agenda, letters, location) | templates | 2 | T2 | L |
| 3b | `Web-khqr-gift` | templates, couple, api | 1a | **T3** | M |
| 4 | `Web-khmer-skin-emerald` (pilot) | templates, seeds | 3a | T2 | L |
| 5 | Skins: royal garden, royal cream, sakura, fairytale, kids | templates, seeds | 4 | T2 each | M each |
| 6 | `Web-khmer-templates-qa-launch` | all | 5, 3b | T2 | M |

**Parallel:** 1a with 1b; 3a with 3b; the five skins in wave 5 (each in its own folder). Tasks 1a and 3b both touch API schemas: sequence 3b after 1a.
Tasks 2 to 6 live in one backlog file, `Tasks/1-backlog/Web-khmer-templates-waves.md`, and are promoted as dependencies clear. 1a and 1b are in `Tasks/2-todo/`.

## Out of scope
Video/reel export, auto lunar conversion, licensed or traced artwork, shipped music, payment collection or gift amounts, a template editor UI, per-guest invitation pages beyond `?to=`.
