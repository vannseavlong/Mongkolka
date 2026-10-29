# Plan: "Grace" wedding template (pink, gold, white, Christian)

Written by the task-planner skill, 2026-10-29. Nothing built yet. Client brief from the owner.

## Goal
A complete site template for a Christian wedding in pink, gold and white. Sections the client asked for:
1. **Opening** that greets the invitee by name from the URL (`?name=` or `?to=`).
2. **Hero** with the couple's photo.
3. **Bible verse** section, and a **cross** motif somewhere visible.
4. **Couple photos** section.
5. **Guest photo upload and display**, for guests who attend.
6. **RSVP** form.
7. **Footer**, plus the sections that fit (details, story, registry, timeline, music).

The owner reviews the finished template.

## Flow (exists / change / new)

| # | Step | State |
|---|---|---|
| 1 | Guest opens `<slug>.<root>/?to=Sokha`; the page reads `name` or `to` and passes `guestGreeting` | exists (`apps/web/src/app/[slug]/page.tsx`) |
| 2 | Opening gate greets "Dear Sokha" and opens to the site | exists as mechanism; **new** component `opening_grace` |
| 3 | Hero shows the couple photo (`coverPhotoUrl`) | exists as mechanism; **new** `hero_grace` |
| 4 | Verse section shows a Bible verse and reference | **new section type `verse`** (key, content, editor, default component) |
| 5 | Couple photos | exists (`gallery`); **new** `gallery_grace` skin |
| 6 | Guest uploads a photo and wish, others see approved ones; couple moderates | exists (`guestbook`, guest-photos API); **new** `guestbook_grace` skin |
| 7 | RSVP | exists (`rsvp`); **new** `rsvp_grace` skin |
| 8 | Footer | **new section type `footer`** |
| 9 | Couple picks the template; the section order and which sections are on come from the template | **change**: today every new couple gets one fixed order, with everything enabled |
| 10 | Template visible at `pink-gold-white.<root>` and in the gallery | exists (preview subdomain), needs sample verse and footer content |

## Screens and states
- **Opening:** arched gold-line window, pink gradient, cross at the top of the arch, "Dear {name}" in script type, falling petals, tap to open (arch doors part). Without a name it reads "You are invited". Respect reduced motion. English and Khmer.
- **Hero:** couple photo in a gold arch frame, names in script, wedding date, small cross, scroll cue. No-photo state uses a soft pink monogram.
- **Verse:** centered verse text, reference line, cross ornament. Empty state returns nothing (matches the existing "empty returns null" rule).
- **Gallery:** gold-framed arch tiles on pink with tap-to-enlarge. Empty returns nothing.
- **Guestbook:** wish form, photo picker, approved photo wall, success and pending states, same data as `guestbook_wall`.
- **RSVP:** form with name prefilled from the greeting, attending yes/no, guests count, message, submitted and error states.
- **Footer:** names, date, cross, optional thank-you line, small Mongkolka credit.
- **Details, story, registry, timeline, music:** details/story get Grace skins; registry, timeline and music reuse existing variants, themed by the palette.

## Data and API
- **New section keys** `verse` and `footer` must exist in: `packages/templates/src/types.ts` (`SECTION_KEYS`), `apps/api/schemas/couple/website_sections.ts` and `apps/api/schemas/admin/section_components.ts` (enums), `apps/api/src/modules/couple-website/couple-website.service.ts` (`SECTION_KEYS`), `apps/couple` (`WEBSITE_SECTIONS` zod enum, `section-labels.ts`, content editor), `apps/web` (`buildContent` fallbacks). `guestbook` is also missing from the couple app's enum and labels today; fix in the same task.
- **Content shapes:** `VerseContent { text, reference, textKh? }`, `FooterContent { message?, hashtag? }`. Footer names and date come from the couple. Stored in `website_sections.content` like the others (no new tables).
- **Verse presets:** a short list of well-known wedding verses with English text from public-domain translations (KJV or WEB) plus references. Khmer text is typed by the couple; no Khmer Bible text is shipped (translation rights not checked).
- **Template defaults (new):** `site_templates.default_sections`: ordered list of `{ section_key, enabled }`, used when a couple first picks the template, and by `reset_all`. Default for Grace: opening, hero, verse, story, gallery, details, guestbook, rsvp, registry, timeline, music(off), footer. Seed-only for now; no admin UI.
- **Palette** (the theme has only 4 keys: bg, text, accent, font): bg soft pink (start near `#fff3f6`), cards white, text deep rosewood (start `#4a2c35`), accent gold (start near `#8a6418`, must reach 4.5:1 on the bg; decorative foil is a lighter tint derived with `mix`). Pink is the background, so a couple recoloring the bg recolors the pink. Validate with `contrastRatio`/`MIN_ACCENT_CONTRAST`. No new Theme key.
- **Fonts:** add a script display font for names (`--font-script`, for example Great Vibes) in `apps/web` and `apps/couple` layouts, with `cursive` fallback. Khmer names use the existing Khmer serif.
- **Template row:** `grace_blush`, name "Grace Blush & Gold", slug `pink-gold-white`, seeded `inactive` until the template is complete; the QA task flips it to `active`.
- **Cross artwork:** original SVG only (simple Latin cross, optional floral spray). Reusable as `<Cross />`.

## Gaps and decisions
| Gap | Decision |
|---|---|
| No `verse`/`footer` section types | New keys, each with a generic themed default component (`verse_classic`, `footer_classic`) so any template can use them. |
| Couple builder enum lacks `guestbook` | Fixed in the section-keys task. |
| Template can't define section order or defaults | New `default_sections`, applied on first pick and `reset_all`; `keep_content` leaves order and enabled flags alone. |
| Pink is not a theme key | Pink = bg, white = card surface, gold = accent. |
| Guestbook logic is in `ink/Guestbook.tsx` | Skin shares its logic (extract shared parts into a helper in the same task; behavior of the ink version must not change). |
| Registry/i18n are shared files that every section task would edit | A skeleton task registers all Grace ids as stubs and wires per-section string files first, so the section tasks touch only their own files. |
| Khmer for a Bible verse | Couple types it; English presets only. |

## Open questions (planning continues; recommendation used)
1. **Name and slug?** Recommend "Grace Blush & Gold", slug `pink-gold-white`.
2. **Cross style?** Recommend a plain Latin cross with a soft floral spray, no crucifix. Confirm with the client.
3. **Footer credit?** Recommend a small "Made with Mongkolka" link, on by default.
4. **Guest photo moderation default?** Recommend keeping the existing default (pending approval).
5. **Music section?** Not requested; keep it available but off by default.
6. **Khmer strings?** Recommend English and Khmer like the other templates, Khmer reviewed by a native speaker.

## Task breakdown

| Order | Task | Repo | Depends on | Tier | Size |
|---|---|---|---|---|---|
| 1a | `Web-section-keys-verse-footer` | templates, api, couple, web | none | T2 | L |
| 1b | `Web-grace-primitives` | templates, web, couple (fonts) | none | T2 | M |
| 2a | `API-template-default-sections` | api | 1a | T3 | M |
| 2b | `Web-grace-skeleton` | templates, api seeds | 1a, 1b | T2 | M |
| 3 | `Web-grace-sections` (5 parallel slices, see backlog file) | templates | 2b | T2 | L |
| 4 | `Web-grace-qa-launch` (in the same backlog file) | templates, api seeds, web | 3, 2a | T2 | M |

**Parallel groups:** 1a with 1b. Then 2a with 2b. Wave 3 has five slices, each in its own files: opening, hero and story, gallery and details, rsvp and guestbook, verse and footer.

## Out of scope
New theme keys, a template editor UI for section order, Khmer Bible text, a crucifix variant, per-guest invitation pages beyond `?to=`, payment.
