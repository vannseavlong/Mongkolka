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
rendering. **Not built**: any UI for editing `website_sections.content` itself —
`gallery`'s `photos`, `registry`'s `links`, `timeline`'s `chapters`, `rsvp`'s
`customMessage`/`deadline`, and `music`'s `playlistUrl` have no couple-facing editor
yet, so those sections render empty (most of them return `null` when their content
is empty, by design — see `resolveComponent()`'s never-throw contract above) unless a
row's `content` is populated directly. This is real, open work, not an oversight to
silently work around.

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
      hero/Classic.tsx
      story/Classic.tsx
      gallery/Grid.tsx
      details/Classic.tsx
      rsvp/Classic.tsx
      registry/Classic.tsx
      timeline/Classic.tsx
      music/Classic.tsx
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
- Ships **one** component per section other than `opening` (`hero/Classic`,
  `gallery/Grid`, etc.) — the registry and schema already support adding more variants
  to any section later (exactly like `opening`'s four) without a migration; it's just
  more components + more `section_components` catalog rows.

## Couple portal: website builder (`apps/couple`)

Lives at `/website`, restructured for the two-axis model rather than adapted from
`WebsiteBuilder.tsx`'s single-theme three-step flow (see `apps/couple`'s
`features/website/`):

1. **Select a site template** (`TemplatePicker`) — picks
   `couple_profile.site_template_id` via `POST /couple/api/website/template`, which
   also bootstraps one `website_sections` row per section key the first time (so the
   builder always has something to list). Changing the template later doesn't touch
   any section's explicit `component_id`/`color_override` — those still win over the
   new template's defaults.
2. **Whole-site theme** (`ThemeEditor`) — four color inputs + font-style select,
   `PATCH /couple/api/website/theme`, writing the *whole* resolved theme (not a
   sparse diff) into `couple_profile.theme_override`.
3. **Sections** (`SectionsList`) — per section: an enabled `Switch` (inline, no
   dialog), a component `<Select>` scoped to that section's active
   `section_components` (or "Template default"), and up/down buttons that
   POST the full reordered id list to `/couple/api/website/sections/reorder`
   (no drag-and-drop library — up/down buttons cover the same ground more simply).
   **Not built**: a color override per section (the schema/cascade supports
   `website_sections.color_override`, but the builder UI only exposes the
   whole-site theme editor) and any editor for `content` (see the content-source
   table above — this is the same open gap).
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

- **Per-section content editor** — `gallery`/`registry`/`timeline`/`rsvp`/`music`'s
  free-form `content` (photos, registry links, timeline chapters, RSVP custom
  message, playlist URL) has no couple-facing editor yet (see "Where each section's
  content comes from" above). This is the biggest open gap in the builder.
- **Per-section color override UI** — the cascade and schema support it
  (`website_sections.color_override`), but the builder only exposes the whole-site
  theme editor today.
- Payment gate on publish: still none. If publish should be gated on payment, that's
  new scope to size separately.
- `usage_count` / template popularity reporting: not resolved, see
  [docs/backend-schema.md](../backend-schema.md#site_templates).
- Whether non-`opening` sections eventually get multiple component variants too (the
  architecture already supports it) is a product call to make per-section as demand
  shows up, not something to pre-build.
