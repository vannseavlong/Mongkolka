# Template System — built

Read [overview.md](../../overview.md) and
[docs/backend-schema.md](../backend-schema.md) first — this doc covers the template
registry (code), the couple-portal builder UI, and the public site renderer, which
together implement the `site_templates` / `section_components` / `website_sections`
design.

This spans two apps: the **builder** lives in `apps/couple` (a logged-in couple
editing their site), the **renderer** lives in `apps/web` (the public site anyone can
view). Both consume the same shared `packages/templates` package so a section looks
identical in the builder preview and on the live site — same components, same
color-resolution code, not two implementations kept in sync by hand.

## The two axes: component and color

A section's appearance is two independent choices:

1. **Which component renders it** — e.g. the `opening` section can render as
   `opening_curtain`, `opening_door`, `opening_book`, or `opening_envelope`: four
   genuinely different interactions, not the same layout recolored. Chosen per
   section, falls back to the couple's selected `site_templates.default_components`
   entry if not explicitly overridden.
2. **What colors it uses** — a `Theme` (`bg_color`, `text_color`, `accent_color`,
   `font_style`) resolved by cascade: `website_sections.color_override` (this
   section) → `couple_profile.theme_override` (the couple's whole-site override) →
   `site_templates.default_theme` (the template's base theme). Each override is a
   *partial* theme — a couple can change just `accent_color` on one section without
   having to respecify the rest.

This directly replaces `WebsiteBuilder.tsx`'s simpler model (9 shared color/font
presets applied identically to every section, no per-section component choice) —
see [overview.md](../../overview.md) for why: real component variety per section
(especially `opening`) was an explicit requirement, not just recoloring.

`packages/templates/src/theme.ts` exports the one `resolveTheme()` function both the
builder and the public renderer call — never reimplement this cascade in either app.

## Section types

`opening`, `hero`, `story`, `gallery`, `details`, `rsvp`, `registry`, `timeline`,
`music` — `opening` is new (see below); the other eight are unchanged from the
original design. A couple enables a subset and orders them
(`website_sections.display_order`); `opening`, when enabled, always renders first
regardless of `display_order` (it's a gate in front of the rest of the site, not a
normal scroll section — see below).

### Where each section's content comes from

Not every section needs its own stored content — some just render the couple's
canonical facts (already in `couples`/`couple_profile`) through whichever component is
chosen; only sections with no other canonical home need
`website_sections.content` json:

| Section | Content source |
|---|---|
| `opening` | `couples.partner1_name/partner2_name/wedding_date` — no separate content needed. Personalized guest greeting comes from the `?to=` query param at render time, not from stored content (see below). |
| `hero` | Same canonical fields + `couple_profile.cover_photo_url` — no separate content needed. |
| `story` | `couple_profile.love_story` — no separate content needed. |
| `details` | `couple_profile.ceremony_*` / `couple_profile.reception_*` / `dress_code` — no separate content needed. |
| `gallery` | `content: { photos: string[] }` — no canonical home for a photo list elsewhere. |
| `rsvp` | `content: { customMessage?: string, deadline?: string }` — actual RSVP submissions write to the couple's own `guests` table (see below), this is just the section's own copy. |
| `registry` | `content: { links: { label: string, url: string }[] }` |
| `timeline` | `content: { chapters: { title: string, text: string, year: string }[] }` — the "How We Met / The Proposal / Looking Forward" pattern from `PublicCouplePage.tsx`, made data-driven. |
| `music` | `content: { playlistUrl?: string }` |
| `verse` | `content: { text?: string, reference?: string, textKh?: string }` — renders nothing without `text`; `textKh` shows when the language is Khmer. |
| `footer` | `content: { message?: string, hashtag?: string }` — names and wedding date come from the couple. |

RSVP submissions are guest responses, not template content — they write into the
couple's own `guests` table (matching `status`/`plus_one` fields already in
[docs/backend-schema.md](../backend-schema.md#guests)), via
`POST /public/api/site/:slug/rsvp` (public, unauthenticated, scoped to that couple's
site only — finds a guest by name or creates one). It's the same `guests` row being
updated by the guest themselves instead of by the couple; there's no separate
`rsvp_responses` table.

Each consumer (the couple-portal preview, the public renderer) supplies its own
`buildContent(sectionKey)` function to `SiteRenderer` mapping the canonical-fields
rows above (`hero`/`story`/`details`) into each section's content shape — this
mapping is deliberately *not* inside `packages/templates`, since it's about how each
app's own fetched data (couple profile, in both cases) gets reshaped, not about
rendering. **Built**: a couple-facing editor for `website_sections.content` —
`gallery`'s `photos`, `registry`'s `links`, `timeline`'s `chapters`, `rsvp`'s
`customMessage`/`deadline`, and `music`'s `playlistUrl` each get a real
`react-hook-form` + `zod` form (`SectionContentDialog`, see below) rather than
rendering empty (most of them still return `null` when their content is empty, by
design — see `resolveComponent()`'s never-throw contract above — but a couple now has
a way to populate it themselves).

## The `opening` section

A full-viewport gate shown before anything else — the "closed" state (curtain, door,
envelope, book cover) with the couple's names + wedding date on it and a tap/click
hint. On interaction, it plays its opening animation, then unmounts and reveals the
rest of the page (scroll-snapped to the top of `hero`). This is a real interaction
requirement, not a recolor — build four genuinely distinct components:

- **`opening_curtain`** — two panels split down the middle and slide outward
  (`x: 0 → ∓100%`), revealing the page behind.
- **`opening_door`** — two panels rotate open around their outer edges like double
  doors (`rotateY` + `perspective`/`transform-style: preserve-3d`).
- **`opening_book`** — a single cover panel rotates open around its left edge like a
  book cover (`rotateY` from the spine).
- **`opening_envelope`** — a flap rotates back (`rotateX`, clipped to a triangle),
  then the "card" scales/slides up out of the envelope. Visual reference:
  `InvitationCardDemo.tsx`'s flip/open interaction, adapted from a landing-page toy
  into a real full-page gate.

All four take the same props (couple names, wedding date, resolved `Theme`, the
personalized guest greeting if present, and an `onOpen` callback) — swapping the
`component_id` swaps the whole component, not a themed variant of one component.

If a couple disables the `opening` section entirely, the public site just starts at
`hero` with no gate — don't force every couple through an interstitial they didn't
choose.

## `packages/templates` (shared package)

```
packages/templates/
  src/
    index.ts          — barrel export of everything below
    types.ts           — Theme, PartialTheme, SectionKey, CoupleInfo, per-section
                         content prop interfaces
    theme.ts            — resolveTheme(templateDefault, coupleOverride, sectionOverride)
    format.ts            — formatCoupleNames(), formatWeddingDate()
    registry.ts            — sectionRegistry[sectionKey][componentId] -> Component,
                             resolveComponent() (never throws, see below)
    i18n.tsx                 — LanguageProvider, useLanguage(), LanguageToggle,
                             en/kh dictionary (UI chrome only)
    site-renderer.tsx         — SiteRenderer: resolves + renders a couple's sections
                             in order, gated by the opening component if enabled —
                             the actual shared render loop, used by both consumers
                             below
    sections/
      opening/{Curtain,Door,Book,Envelope}.tsx
      hero/{Classic,Polaroid,Fullbleed}.tsx
      story/{Classic,Letter,Split}.tsx
      gallery/{Grid,Masonry,Carousel}.tsx
      details/{Classic,Split,Cards}.tsx
      rsvp/{Classic,Card,Minimal}.tsx
      registry/{Classic,Cards,List}.tsx
      timeline/{Classic,VerticalLine,Horizontal}.tsx
      music/{Classic,Playerbar,Minimal}.tsx
  package.json
```

Package exports are explicit per file (`package.json`'s `exports` map) since Node/
bundler resolution needs an exact entry per extension — `.`/`i18n`/`site-renderer` are
each their own entry, `sections/*` is a wildcard, and everything else flat under
`src/*.ts` falls through a generic wildcard. Two real gaps here were only caught once
something outside the package actually tried to import `i18n`/`site-renderer`/`cn`
(from `packages/ui`) for the first time — if you add a new top-level `.tsx` file to
either shared package, it needs its own `exports` entry, the existing wildcards won't
pick it up.

- `SiteRenderer` (not each consumer re-deriving its own render loop) is what makes the
  couple-portal preview and the public site pixel-identical by construction — it takes
  `template`, `sections`, `themeOverride`, `couple`, a `buildContent(sectionKey)`
  callback (each consumer supplies its own — see below), an optional `guestGreeting`,
  and an optional `extraProps(sectionKey)` escape hatch for the one section whose
  component doesn't fit the generic `{couple, theme, content}` shape (`rsvp`, which
  needs an `onSubmit` callback instead).
- `resolveComponent()` falls back to that section's *template default* component, then
  to whatever's first registered for that section, rather than throwing — a public
  wedding site should never hard-crash because a catalog row was retired or a
  `component_id` was mistyped.
- Ships **three** components per section other than `opening` — a `Classic` plus two
  genuinely distinct variants (e.g. `hero_classic`/`hero_polaroid`/`hero_fullbleed`,
  `gallery_grid`/`gallery_masonry`/`gallery_carousel`) — see `registry.ts`'s
  `sectionRegistry` for the full list of `component_id`s per section. Adding more is
  just more components + more `section_components` catalog rows, no migration.

## Couple portal: website builder (`apps/couple`)

Lives at `/website`, restructured for the two-axis model rather than adapted from
`WebsiteBuilder.tsx`'s single-theme three-step flow (see `apps/couple`'s
`features/website/`):

1. **Select a site template** (`TemplatePicker`) — picks
   `couple_profile.site_template_id` via `POST /couple/api/website/template`, which
   also bootstraps one `website_sections` row per section key the first time (so the
   builder always has something to list). The body takes an optional
   `mode`: `keep_content` (default) clears every section's `component_id` and
   `color_override` plus `couple_profile.theme_override` so the new template's look
   applies fully, but keeps section `content`; `reset_all` clears `content` too. `enabled` and `display_order` are untouched, except when the template has `default_sections` (see below).
   **Section order and flags:** a template may set `site_templates.default_sections`
   (`[{ section_key, enabled }]`, see backend-schema.md). First pick creates rows in that
   order with those flags (unlisted keys appended disabled). `reset_all` also resets
   `display_order` and `enabled` from it (unlisted keys disabled at the end); `keep_content`
   never changes them. With `default_sections` null, behavior is unchanged: fixed order,
   all enabled on first pick, and `reset_all` leaves order/enabled alone. The catalog
   endpoint returns it; the public by-slug response does not.
   **Partial failure:** writes are one per section (no transaction). If one fails, the
   others stay applied and the profile stays on the old template; the same holds if the
   profile or the row creation fails after the section writes. Retrying the same pick is
   idempotent (matching rows skipped, missing rows recomputed). Without a retry,
   `listSections` appends missing keys disabled and only `reset_all` repairs the layout.
   Two concurrent first picks can still race (known narrow window, see the dedupe in
   `listSections`).
   Unknown or inactive templates return 404. Templates also have a public `slug`
   and `description`; `GET /public/api/site-templates/by-slug/:slug` returns
   `{ template }` (404 if unknown or inactive).
2. **Whole-site theme** (`ThemeEditor`) — four color inputs + font-style select,
   `PATCH /couple/api/website/theme`, writing the *whole* resolved theme (not a
   sparse diff) into `couple_profile.theme_override`.
3. **Sections** (`SectionsList`) — per section: a scaled-down live preview swatch
   (`SectionPreview`, rendering that one row through the real `SiteRenderer`), an
   enabled `Switch` (inline, no dialog), a component `<Select>` scoped to that
   section's active `section_components` (or "Template default"), up/down buttons
   that POST the full reordered id list to `/couple/api/website/sections/reorder`
   (no drag-and-drop library — up/down buttons cover the same ground more simply),
   a per-section color override popover (`SectionColorPopover` — the same 4 fields
   as `ThemeEditor`, scoped to `PATCH`ing that section's own `color_override`, with
   a "use template default" reset), and — for `gallery`/`registry`/`timeline`/
   `rsvp`/`music` — an "Edit content" button opening `SectionContentDialog` (see the
   content-source table above). All of these go through the same generic
   `PATCH /couple/api/website/sections/:sectionId`, which accepts any of
   `enabled`/`component_id`/`color_override`/`content` in one body — no per-field
   endpoints were needed.
4. **Preview + publish** (`WebsitePreview`, `PublishPanel`) — the preview renders
   through `packages/templates`' `SiteRenderer` directly (boxed in a fixed-height,
   `overflow: hidden` container with a `transform` on it, so the `opening` gate's
   `position: fixed` is contained to the preview box instead of covering the whole
   builder page), so it's pixel-identical to the real public site by construction.
   "Publish" (`POST /couple/api/website/publish`) requires a template to already be
   selected and flips `couples.website_status` to `published` — no payment gate
   exists (Clone-UI's ABA QR-code flow was 100% fake; real payment integration is
   separate, unscoped future work).

## Public site renderer (`apps/web`)

- Route: `app/[slug]/page.tsx` — **path-based**, not a custom-domain/subdomain
  rewrite target. No domain-routing middleware exists (see
  [docs/tasks/landing.md](landing.md)); `couples.custom_domain` is schema-only.
- Server-side (an `async` Server Component, reading `params`/`searchParams` per
  Next's async-props convention): calls `GET /public/api/site/:slug` on `apps/api`
  (unauthenticated). That endpoint does the admin-sheet `couples` lookup by slug
  (must be `status: 'active'` and `website_status: 'published'`, else it 404s),
  plus its `site_templates` row, then reads that couple's own sheet
  (`couple_profile`, all `website_sections`) — `apps/web` never touches
  `longcelot-sheet-db` or holds Google credentials directly (see
  [overview.md](../../overview.md)). The page calls Next's `notFound()` on a 404
  response.
- The actual rendering (`site-view.tsx`, a client component) hands the fetched data
  to the same `SiteRenderer` used by the couple-portal preview, plus a visible
  `LanguageToggle` and the real RSVP `onSubmit` wired to
  `POST /public/api/site/:slug/rsvp`.

### Guest personalization via query params

A couple shares a personalized link per guest/family, e.g.
`https://mongkolka.com/{slug}?to=Mr.+John+%26+Mrs.+Bopha&lang=kh`:

- `to` — free text greeting name, read server-side from `searchParams`, passed as
  `SiteRenderer`'s `guestGreeting` prop — currently only the **`opening`** component
  actually uses it (rendered as "Dear Mr. John & Mrs. Bopha,"); `hero` and the other
  sections don't take a guest-greeting prop today. Not persisted anywhere — purely a
  per-visit render input, not couple data.
- `lang` (`en` or `kh`) — sets the **initial** language only. The page still has a
  visible language toggle button (see i18n below) — a guest can override it after
  landing; the param just picks where they start.

### i18n on the public site

Two languages (`en`/`kh`), a visible toggle, and a query-param initial value — built
as a small shared `LanguageProvider` React context in
`packages/templates/src/i18n.tsx` (`useLanguage()`, `LanguageToggle`), rather than a
routing-based i18n library (`next-intl` et al. want locale-prefixed routes like
`/en/...`, which is more machinery than "one URL, a client-side toggle" needs).
`apps/web`'s page initializes it from the `lang` searchParam; every section
component that needs UI-chrome strings (headings, button labels) calls
`useLanguage()` directly — translation strings live in one dictionary keyed by
language, not copy-pasted per component (see
[overview.md](../../overview.md#i18n)). Only UI chrome is translated — a couple's own
free-text content (love story, RSVP custom message, etc.) is shown as-is regardless
of language. The admin/couple/vendor portals don't use this — not needed there yet.

## Open calls / known gaps

- Per-section content editor and per-section color override UI: done — see the
  "Couple portal: website builder" section above (`SectionContentDialog`,
  `SectionColorPopover`). Both were the two items listed here as open gaps; neither
  needed a new endpoint, since `PATCH /couple/api/website/sections/:sectionId`
  already took an arbitrary body.
- Payment gate on publish: still none. If publish should be gated on payment, that's
  new scope to size separately.
- `usage_count` / template popularity reporting: not resolved, see
  [docs/backend-schema.md](../backend-schema.md#site_templates).
- Non-`opening` sections getting multiple component variants: done — each of
  `hero`, `story`, `gallery`, `details`, `rsvp`, `registry`, `timeline`, `music` now
  ships a `Classic` plus two additional variants (`hero_polaroid`/`hero_fullbleed`,
  `story_letter`/`story_split`, `gallery_masonry`/`gallery_carousel`,
  `details_split`/`details_cards`, `rsvp_card`/`rsvp_minimal`,
  `registry_cards`/`registry_list`, `timeline_vertical_line`/`timeline_horizontal`,
  `music_playerbar`/`music_minimal`) — see `packages/templates/src/registry.ts`'s
  `sectionRegistry` for the authoritative list of `component_id`s. Whether any
  section gets a *fourth* variant remains a product call to make per-section as
  demand shows up.

## "Khmer Kbach" pack (`khmer_kbach`)

Ruby / ivory / gold template inspired by Khmer ornament (ក្បាច់ខ្មែរ). Artwork is original
SVG drawn in `packages/templates/src/sections/kbach/shared.tsx` (lotus, flame-vine strip,
corner fan, pointed arch frame, foil-gradient text), all recolored by the theme's accent.
New components: `opening_kbach` (arch gate that splits open), `hero_kbach` (photo in a
pointed arch), `story_kbach`, `details_kbach` (arch-capped cards). The other sections reuse
the Ink & Gold components (`gallery_plates`, `rsvp_reply`, `registry_ledger`,
`timeline_chapters`, `music_vinyl`, `guestbook_wall`), which follow the theme colors.
Seeded in `seeds/site-templates.ts` / `section-components.ts` (`lsdb seed … --upsert`).

- The gate renders its cover twice (each clipped to a half) so the split is a pure
  transform; both copies must lay out identically (the inert copy still renders the button).
- Gate text sizes use container query units (`cqw`) so it scales with the arch, not the viewport.
- Not verified visually in Khmer (`?lang=kh`) yet; only English was checked.

## "Ink & Gold" pack (`ink_and_gold`)

An editorial printed-invitation design: one component per section under
`packages/templates/src/sections/ink/` — `opening_seal`, `hero_folio`,
`story_manuscript`, `gallery_plates`, `details_programme`, `rsvp_reply`,
`registry_ledger`, `timeline_chapters`, `music_vinyl`. Seeded in
`apps/api/seeds/site-templates.ts` / `section-components.ts` (`lsdb seed … --upsert`).

- **Colors**: driven only by the four `Theme` colors (paper = `bg_color`, ink =
  `text_color`, foil = `accent_color`); sections alternate paper/inverted-ink via
  `InkSection` in `ink/shared.tsx`, so couples can still recolor it.
- **Fonts**: `apps/web` loads Cormorant Garamond / Jost / Noto Serif Khmer through
  `next/font` and exposes `--font-display`, `--font-label`, `--font-khmer`; the pack falls
  back to Georgia/Arial where those variables aren't set (the couple-portal preview
  doesn't load them yet).
- **Khmer**: tracking and uppercase break Khmer glyph clusters, so `InkSection` and `Seal`
  set `data-ink-lang` and inject a small reset under `kh`. Any new ink component that
  uses `tracking-*`/`uppercase` must render inside `InkSection` (or set the attribute).
- **Stacking gotcha**: positioned elements (a `relative` photo with `clipPath`) paint over
  unpositioned siblings later in the DOM — text meant to overlap needs `relative z-10`.

### Tailwind must scan `packages/templates`

`apps/web` and `apps/couple` both need
`@source "../../../../packages/templates/src/**/*.{ts,tsx}";` in `globals.css`. Without
it every utility class used inside the shared package silently doesn't generate (the
site renders as unstyled text). Add the same line to any new app that renders
`SiteRenderer`.

### Mock couple for e2e

`apps/api/scripts/seed-mock-couple.ts` (re-runnable; `--clean` removes the rows, not the
Drive spreadsheet) creates a published couple — slug `mock-demo`, login
`mock.couple@example.test` / `MockCouple#2026` — with a full story, gallery, registry,
timeline and playlist. It writes real rows to the admin sheet and a real spreadsheet in
the connected Drive. Verified in a browser: the public site, RSVP submit, the portal
login, the builder's template picker (Ink & Gold + the new `Folio Arch` option), a
component swap, and a section enable/disable reflected on the public site.

### Known gaps

- The builder shows the site URL as `{slug}.localhost:3000`; `apps/web/src/proxy.ts`
  rewrites that host to `/{slug}`, and the plain `/{slug}` path also works. (Custom
  domains — `couples.custom_domain` — are still not resolved.)
- The opening gate's preview box in the builder is short, so the seal's caption sits at
  the very bottom edge.
- RSVP saves take 5–8s (Sheets schema checks + quota); see Phase 8.

## Guestbook section (`guestbook_wall`)

New section key `guestbook`: a form (name prefilled from the invited guest, wish, optional
photo, optional self-reported gift), a wall of approved wishes/photos, and "meaningful
action" buttons (directions via the ceremony address, add-to-calendar `.ics`, share).
Wiring: `packages/templates/src/sections/ink/Guestbook.tsx`; the web app supplies data and
handlers through `extraProps` (`apps/web/src/app/[slug]/guestbook.ts` — client-side photo
resize, per-browser guest token, upload then wish). API: `guest-photos` + `guest-wishes`
modules. Existing couples get a *disabled* `guestbook` row the next time the builder lists
their sections, so a published site doesn't change under them.

## Verse and footer sections (`verse_classic`, `footer_classic`)

New section keys `verse` and `footer`; `SECTION_KEYS` order is now opening, hero, verse, story,
gallery, details, rsvp, registry, timeline, music, guestbook, footer. Existing couples keep
their `display_order`; the missing keys are appended disabled by the existing mechanism. For existing couples verse and footer therefore sit disabled at the end, and the couple reorders and enables them. The
couple builder also gained the previously missing `guestbook` key. The verse editor offers KJV
preset verses (`apps/couple/src/features/website/lib/verse-presets.ts`). **Release note:** the
`website_sections.section_key` and `section_components.section` enums changed, so a schema sync is
required, and the two new `section_components` seed rows must be seeded.

### Invited guest (`?name=` / `?to=`)

`SiteRenderer` provides the name through `GuestProvider`/`useGuest()` (`guest-context.tsx`):
the opening gate greets them, the ink hero shows "A special invitation for …", and every
RSVP component plus the guestbook prefill the name. Comma-separated names are joined with
"&" server-side in `page.tsx`.

## Grace Blush & Gold seed (release ordering)

The `grace_blush` row in `apps/api/seeds/site-templates.ts` and the nine `*_grace` rows in
`seeds/section-components.ts` are seeded **inactive**; the final Grace launch task flips them to
active together. The seeder silently **drops** any key that is not in the schema, and the template row
carries `default_sections`. So: deploy API-template-default-sections, run `lsdb sync` to add the
`default_sections` column, then seed with `--upsert`. A `--skip-existing` re-seed would never write
`default_sections` because the row already exists.
