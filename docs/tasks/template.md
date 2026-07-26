# Template System

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
[docs/backend-schema.md](../backend-schema.md#guests)), via a public, unauthenticated
endpoint scoped to that couple's site only. Don't design a separate "rsvp_responses"
table — it's the same `guests` row being updated by the guest themselves instead of by
the couple.

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

## `packages/templates` (new shared package)

```
packages/templates/
  src/
    types.ts        — Theme, SectionKey, per-section content prop types
    theme.ts         — resolveTheme(templateDefault, coupleOverride, sectionOverride)
    registry.ts       — sectionRenderers[sectionKey][componentId] -> Component
    sections/
      opening/{curtain,door,book,envelope}.tsx
      hero/classic.tsx
      story/classic.tsx
      gallery/grid.tsx
      details/classic.tsx
      rsvp/classic.tsx
      registry/classic.tsx
      timeline/classic.tsx
      music/classic.tsx
  package.json
```

- `registry.ts` exports one lookup map, imported identically by `apps/couple` (builder
  preview) and `apps/web` (public render) — one source of truth for what
  "opening_door" looks like.
- Looking up an unknown/retired `component_id` (e.g. admin deactivated it after a
  couple already picked it) must fall back to that section's *template default*
  component rather than throwing — a public wedding site should never hard-crash
  because of a catalog change.
- v1 ships **one** component per section other than `opening` (`hero/classic`,
  `gallery/grid`, etc.) — the registry and schema already support adding more variants
  to any section later (exactly like `opening`'s four) without a migration; it's just
  more components + more `section_components` catalog rows. Don't build variety
  everywhere up front without a concrete need — `opening` needed it explicitly, the
  rest didn't.

## Couple portal: website builder (`apps/couple`)

Adapts `WebsiteBuilder.tsx`'s three-step flow, restructured for the two-axis model:

1. **Select a site template** — picks `couple_profile.site_template_id`, which sets
   every section's default component + the base color theme in one action. Changing
   this later doesn't touch any section's explicit `component_id`/`color_override` —
   those still win over the new template's defaults.
2. **Select sections** — multi-select + reorder, backed by real `website_sections`
   rows (`enabled`/`display_order`, not local `useState`).
3. **Customize** — per section: optionally override its component (pick from that
   section's available `section_components`, scoped to `where: { section, status:
   'active' }`), optionally override its colors (a color picker writing into
   `color_override`, defaulting to whatever the cascade currently resolves to so the
   picker starts from a sensible value, not blank), and edit content for sections that
   have their own (per the table above). A separate whole-site theme editor writes to
   `couple_profile.theme_override`.
4. **Preview + publish** — live preview renders through `packages/templates`'
   registry directly, so the builder preview and the public site are pixel-identical
   by construction. "Publish" flips `couples.website_status` to `published` — no
   payment gate exists yet (Clone-UI's ABA QR-code flow is 100% fake; real payment
   integration is separate future work, flag before assuming publish should be gated).

Rewrite, don't port, from `WebsiteBuilder.tsx`: every form → `react-hook-form` + `zod`;
`window.confirm()`/`alert()` → shadcn `AlertDialog`/`Sonner`. Drag-and-drop section
reordering doesn't exist in Clone-UI despite `react-dnd` being an unused dependency
there — since `display_order` already supports it, build real reordering rather than
copying nothing.

## Public site renderer (`apps/web`)

- Route: `app/[slug]/page.tsx` (or a middleware rewrite target for custom domains —
  see [docs/tasks/landing.md](landing.md) for the host-based routing setup).
- Server-side: call `GET /public/sites/:slug` on `apps/api` (new, unauthenticated).
  This endpoint does the admin-sheet `couples` lookup by slug (plus its
  `site_templates` row), then reads that couple's own sheet (`couple_profile`,
  `website_sections` ordered by `display_order` where `enabled = true`) — `apps/web`
  never touches `longcelot-sheet-db` or holds Google credentials directly (see
  [overview.md](../../overview.md)).
- Resolve each section's component + theme via `packages/templates`' `resolveTheme()`
  and registry lookup (server-side is fine — these are pure functions, no
  client-only APIs involved).
- 404 (a real Next.js not-found page, not a client-side alert) if the slug doesn't
  resolve to a `couples` row, or if `website_status !== 'published'`.

### Guest personalization via query params

A couple shares a personalized link per guest/family, e.g.
`https://{slug}.mongkolka.com/?to=Mr.+John+%26+Mrs.+Bopha&lang=kh`:

- `to` — free text greeting name, read server-side from `searchParams`, passed into
  the `opening`/`hero` component as a `guestGreeting` prop (e.g. rendered as "Dear Mr.
  John & Mrs. Bopha,"). Not persisted anywhere — purely a per-visit render input, not
  couple data.
- `lang` (`en` or `kh`) — sets the **initial** language only. The page still has a
  visible language toggle button (see i18n below) — a guest can override it after
  landing; the param just picks where they start.

### i18n on the public site

Two languages (`en`/`kh`), a visible toggle, and a query-param initial value — this
doesn't need a routing-based i18n library (`next-intl` et al. want locale-prefixed
routes like `/en/...`, which is more machinery than "one URL, a client-side toggle").
Build a small shared `LanguageProvider` React context (client component) in
`packages/templates` (or `apps/web` if it turns out nothing else needs it):
initialized from the `lang` searchParam, exposing `language`/`setLanguage` to every
section component, with translation strings organized as one dictionary keyed by
language — not copy-pasted per component like every Clone-UI page does today (see
[overview.md](../../overview.md#i18n)). If the couple portal or other apps need i18n
later, revisit whether to graduate to a real library then — don't build for that need
speculatively now.

## Open calls to make before/while building this

- Payment gate on publish: still none. If publish should be gated on payment, that's
  new scope to size separately.
- `usage_count` / template popularity reporting: not resolved, see
  [docs/backend-schema.md](../backend-schema.md#site_templates).
- Whether non-`opening` sections eventually get multiple component variants too (the
  architecture already supports it) is a product call to make per-section as demand
  shows up, not something to pre-build.
