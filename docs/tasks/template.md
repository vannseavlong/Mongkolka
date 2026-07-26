# Template System

Read [overview.md](../../overview.md) and
[docs/backend-schema.md](../backend-schema.md) first — this doc covers the template
registry (code), the couple-portal builder UI, and the public site renderer, which
together implement the `website_templates` / `website_sections` design.

This spans two apps: the **builder** lives in `apps/couple` (a logged-in couple
editing their site), the **renderer** lives in `apps/web` (the public site anyone can
view). Both consume the same shared package so a template looks identical in the
builder preview and on the live site.

## Reference: what Clone-UI shows and what we change

`WebsiteBuilder.tsx` demonstrates the right *mechanism* (pick sections, pick a
`template_id` per section, edit content, live preview) but its 9 "templates"
(`classic, modern, elegant, garden, beach, vintage, rustic, luxury, floral`) are
really just **9 shared color/font presets** applied identically to every section type
via inline `style={{...}}` — one hardcoded layout overall, recolored. We deliberately
build something a little more capable: **`template_id` is scoped per section type**
(a `hero` template and a `gallery` template are unrelated registries), so a template
can eventually mean a genuinely different layout for that section, not just a
recolor. Nothing stops the *first* template we ship per section from being "just the
recolor variant" (cheap, matches what Clone-UI already validated design-wise) — the
schema and registry already support richer layouts later with zero migration.

`PublicCouplePage.tsx` is **not** adapted directly — it's 100% hardcoded to one
couple with zero props. It's a good visual reference for what a `hero` + `details` +
`gallery` section can look like, but the real public page is assembled from the
section registry below, driven by real per-couple data.

## Section types (fixed set for v1)

`hero`, `story`, `gallery`, `details`, `rsvp`, `registry`, `timeline`, `music` — same
eight as `WebsiteBuilder.tsx`. A couple enables a subset and orders them
(`website_sections.display_order`).

### Where each section's content comes from

Not every section needs its own stored content — some just render the couple's
canonical facts (already in `couples`/`profile`) through whichever template is
chosen; only sections with no other canonical home need
`website_sections.content` json:

| Section | Content source |
|---|---|
| `hero` | `couples.partner1_name/partner2_name/wedding_date` + `profile.cover_photo_url` — no separate content needed. |
| `story` | `profile.love_story` — no separate content needed. |
| `details` | `profile.ceremony_*` / `profile.reception_*` / `dress_code` — no separate content needed. |
| `gallery` | `content: { photos: string[] }` — no canonical home for a photo list elsewhere. |
| `rsvp` | `content: { customMessage?: string, deadline?: string }` — the actual RSVP submissions are a separate concern (see below), this is just the section's own copy. |
| `registry` | `content: { links: { label: string, url: string }[] }` |
| `timeline` | `content: { chapters: { title: string, text: string, year: string }[] }` — the "How We Met / The Proposal / Looking Forward" pattern from `PublicCouplePage.tsx`, made data-driven. |
| `music` | `content: { playlistUrl?: string }` |

RSVP submissions themselves are guest responses, not template content — they should
write into the couple's own `guests` table (matching `status`/`plus_one` fields
already in [docs/backend-schema.md](../backend-schema.md#guests)), via a public,
unauthenticated endpoint scoped to that couple's site only. Don't design a separate
"rsvp_responses" table — it's the same `guests` row being updated by the guest
themselves instead of by the couple.

## `packages/templates` (new shared package)

```
packages/templates/
  src/
    sections/
      hero/{elegant,classic,...}.tsx
      story/{...}.tsx
      gallery/{...}.tsx
      details/{...}.tsx
      rsvp/{...}.tsx
      registry/{...}.tsx
      timeline/{...}.tsx
      music/{...}.tsx
    registry.ts     — sectionRenderers[sectionKey][templateId] -> Component
    types.ts        — per-section content prop types (HeroProps, GalleryProps, ...)
  package.json
```

- `registry.ts` exports one lookup map. Both `apps/couple` (builder preview) and
  `apps/web` (public render) import the same map — one source of truth for what
  "elegant hero" looks like.
- Looking up an unknown/retired `template_id` (e.g. an admin deactivated it after a
  couple already picked it) must fall back to that section's default template rather
  than throwing — a public wedding site should never hard-crash because of a catalog
  change.
- Each section component takes the section's own content-prop shape (see table
  above) plus a shared `theme` prop (the color/font tokens `website_templates`
  mirrors for the admin catalog preview) — this is the only thing that's actually a
  simple "swap some CSS variables" mechanism; layout is the component itself.

## Couple portal: website builder (`apps/couple`)

Adapts `WebsiteBuilder.tsx`'s three-step flow, restructured:

1. **Select sections** — same multi-select grid concept, backed by real
   `website_sections` rows (`enabled` toggle, not local `useState`).
2. **Select template per section** — same per-section walkthrough, but pulls the
   options for a given section from the admin's `website_templates` catalog
   (`where: { section, status: 'active' }`) via the API, not a hardcoded array.
3. **Customize + preview** — content editors per enabled section (only for the
   sections that actually need their own `content`, per the table above); live
   preview renders through `packages/templates`' registry directly, so the builder
   preview and the public site are pixel-identical by construction, not by
   coincidence.

Rewrite, don't port, the following from `WebsiteBuilder.tsx`:
- All forms → `react-hook-form` + `zod`, not raw `useState` per field.
- The fake ABA QR-code payment modal → out of scope for this task, real payment
  integration is separate future work; for now, "publish" just flips
  `couples.website_status` to `published` (no payment gate yet — flag this explicitly
  if a payment gate needs to ship alongside publish).
- Drag-and-drop section reordering doesn't exist in Clone-UI despite `react-dnd`
  being an unused dependency there — if we want couples to reorder sections (probably
  yes, `display_order` already supports it), build it for real rather than copying
  nothing.

Use shadcn `Tabs` or a simple stepper for the 3 steps, `Dialog`/`Sheet` for content
editors, `Card` for section/template pickers, `Sonner` (toast) for save confirmation
instead of Clone-UI's `alert()`.

## Public site renderer (`apps/web`)

- Route: `app/[slug]/page.tsx` (or a middleware rewrite target for custom domains —
  see [docs/tasks/landing.md](landing.md) for the host-based routing setup).
- Server-side: call `GET /public/sites/:slug` on `apps/api` (new, unauthenticated).
  This endpoint does the admin-sheet `couples` lookup by slug, then reads that
  couple's own sheet (`profile`, `website_sections` ordered by `display_order` where
  `enabled = true`) — `apps/web` never touches `longcelot-sheet-db` or holds Google
  credentials directly (see [overview.md](../../overview.md)).
- Render each enabled section by looking up
  `sectionRenderers[row.section_key][row.template_id]` from `packages/templates` and
  passing the right content (from the table above, resolved server-side).
- 404 (a real Next.js not-found page, not a client-side alert) if the slug doesn't
  resolve to a `couples` row, or if `website_status !== 'published'`.

## Open calls to make before/while building this

- First real template per section: ship the "recolor-only" version to start (cheap,
  matches what Clone-UI already validated works visually), or invest in genuinely
  different per-section layouts from day one? Recommend starting with recolor-only
  and treating richer layouts as an iteration, since the registry already supports it
  either way.
- Payment gate on publish: none exists yet in this plan. If publish should be
  gated on payment, that's new scope to size separately — don't assume the fake
  $29.99 QR flow is "basically done," it isn't wired to anything real.
