# Mongkolka — Project Overview

Wedding planning platform. Couples plan their wedding and run a customizable wedding
website; vendors (photographers, salons, food service, hotels, honeymoon planners,
decorators, …) list and manage their services; admins run the marketplace.

This file is the map of the project. Read [TODO.md](./TODO.md) for the phased build
order, and [docs/backend-schema.md](./docs/backend-schema.md) +
[docs/tasks/](./docs/tasks/) for the detailed design each area is built against.

**Status**: monorepo scaffolded, auth backend built (see git history). Nothing below
this line is implemented yet — this is the plan we implement next.

---

## 1. Roles & surfaces

| Role | Surface | Domain | Auth |
|---|---|---|---|
| Admin | Admin portal | `admin.mongkolka.com` | Login-only (invited/seeded, no self-signup) |
| Couple | Couple portal | `couple.mongkolka.com` | Self-register → pending → admin-approved |
| Vendor | Vendor portal | `vendor.mongkolka.com` | Self-register → pending → admin-approved |
| Public | Couple's own wedding site | `{slug}.mongkolka.com` or a custom domain | None |
| Public | Landing / marketing / browse | `mongkolka.com` | None |

Admin manages couples & vendors (approve/reject/suspend) and the template catalog.
Couple plans their wedding (checklist, budget, milestones), manages guests, and builds
their public wedding website from a set of templates. Vendor manages their public
marketplace listing and (later) bookings/messages with couples.

### The couple account is multi-user

A wedding has **one** tenant (one Google Sheet, one row in `couples`), but **two**
people — both partners — can each log in with their own Google account and reach the
same couple portal and the same data. This is the same shape as "multiple staff
accounts under one branch," not "one user owns one account." See
[docs/backend-schema.md](./docs/backend-schema.md#couples) for how
this is modeled (`couples` + `couple_members`), and
[docs/tasks/couple.md](./docs/tasks/couple.md) for the invite-partner flow this
requires — our current auth code (`selfRegisterOnUser`) does **not** support this yet
and needs extending.

---

## 2. Tech stack & architecture decisions

### Monorepo (already built)
Turborepo + pnpm workspaces.

```
apps/
  web/      Next.js — landing/marketing (mongkolka.com) + public per-couple wedding
            sites (wildcard subdomain / custom domain, host-based middleware routing)
  admin/    Next.js — admin.mongkolka.com
  couple/   Next.js — couple.mongkolka.com
  vendor/   Next.js — vendor.mongkolka.com
  api/      Express + longcelot-sheet-db (Google Sheets-backed DB), Google OAuth
            login for all 3 portals already wired (see git log)

packages/
  typescript-config/  shared tsconfig
  eslint-config/       shared eslint flat config
```

Two packages we'll add as part of this build (see [TODO.md](./TODO.md)):

- **`packages/ui`** — shared shadcn/ui component set (Radix primitives + Tailwind,
  code you own and copy in, not an npm dependency) used by all four Next.js apps.
- **`packages/types`** — shared TypeScript interfaces mirroring the backend schemas
  (`Guest`, `BudgetCategory`, `Booking`, …) from
  [docs/backend-schema.md](./docs/backend-schema.md), so the Next.js apps and the
  Express API agree on shapes instead of each redefining them.

### UI library: shadcn/ui everywhere

All four Next.js apps (admin, couple, vendor, web) use **shadcn/ui** as the base
component library — buttons, dialogs, forms, tables, cards, etc. — installed once into
`packages/ui` and consumed by every app. This gives us one consistent design language
and one place to theme.

For the landing page and public couple websites specifically, we also use
**Framer Motion** (`motion`) for entrance/hover animation polish, and **lucide-react**
for icons — both used tastefully, not shadcn replacements.

### Clone-UI: what it is and how we use it

`/Clone-UI` is a Figma Make export ("Global Wedding Platform Design") the team added
as a visual/UX reference. Important to understand before touching it:

- It's a **pure client-side Vite/React SPA prototype** — no real routing (`App.tsx`
  manually swaps which component renders based on `useState`), no real API calls
  (every "save"/"submit" is `setTimeout` + `alert()`/`console.log`, nothing persists),
  no real auth (a dev-only floating button flips you into "super admin" client-side).
- Its `src/app/components/ui/` folder **is** a complete, standard shadcn/ui component
  set — genuinely reusable as the seed for our `packages/ui`.
- Its 17 page/feature components (`LandingPage`, `CoupleDashboard`, `GuestManager`,
  `PlanningManager`, `WebsiteBuilder`, `InvitationCustomizer`, `ServiceProviderDashboard`,
  `SuperAdminDashboard`, `PublicCouplePage`, etc.) are a strong **visual and content**
  reference, and several (`GuestManager`, `PlanningManager`, `WebsiteBuilder`,
  `InvitationCustomizer`) have well-shaped mock data that maps closely onto real
  schemas — but almost none of it actually use the shadcn library it ships (they
  hand-roll Tailwind directly), several use inconsistent/dead state
  (`CoupleDashboard`'s budget numbers and `PlanningManager`'s budget numbers are two
  independent fakes that happen to both total $20,000), and forms have zero
  validation.
- **Rule for porting**: copy the *look* and the *content structure* into cleanly
  organized, small components; do not copy the file organization (12 files are
  900–1100 lines each, mixing wizard state + data definitions + rendering in one
  file), the fake persistence (`setTimeout`/`alert`/`console.log`), the hand-rolled
  forms (we use `react-hook-form` + `zod` for every form instead), or `window.confirm()`
  for destructive actions (use a shadcn `AlertDialog`).
- **Not reusing as-is**: the fake ABA QR-code payment flow in `WebsiteBuilder` (real
  payment integration is separate future work), `PublicCouplePage.tsx` (100%
  hardcoded to one couple, zero props — it's a reference for what the rendered page
  should look like, not a component to adapt; the real public site is built from the
  template/section system instead, see [docs/tasks/template.md](./docs/tasks/template.md)).
- `InvitationCardDemo.tsx` (landing-page decoration) and `InvitationCustomizer.tsx`
  (the real per-couple invitation-card designer) are two **separate, inconsistent**
  template concepts in the prototype. Digital invitation cards are useful but not
  part of the couple's core ask (plan / website / guests) — treated as a **Phase 2**
  feature in [TODO.md](./TODO.md), not built in v1. Flag if you want it pulled
  forward.

### i18n

Clone-UI hand-rolls a `translations = { en: {...}, kh: {...} }` object inside every
single component. We don't repeat that — use a real i18n library (`next-intl`
recommended, since it's the standard choice for the Next.js App Router) with shared
message catalogs, not copy-pasted dictionaries per component.

### Template system: code owns rendering, sheets own selection + content only

Per explicit requirement: **template content is never stored as data in a Sheet
row.** What's stored is a `template_id` (a stable string key) plus the couple's own
content (text, photos, which sections are enabled, what order). The actual
layout/markup for a given `template_id` lives in code, in a small
registry — this is exactly what `WebsiteBuilder.tsx`'s
`sectionTemplates: {[sectionId]: templateId}` shape already models, now made real and
persisted. Full design in [docs/tasks/template.md](./docs/tasks/template.md) and the
`website_templates` table in
[docs/backend-schema.md](./docs/backend-schema.md#website_templates).

### Cross-actor data (bookings, and anything couple↔vendor)

`longcelot-sheet-db` isolates each actor (couple/vendor) in **their own physical
Google Sheet** — that's the whole point (their own Drive quota, their own data). But a
booking *inherently* spans two tenants (one couple + one vendor), and there's no third
kind of sheet to put a cross-tenant row in. **Standing convention**: any record that
spans two actors lives in the **admin sheet** as neutral ground, and both portals read
it through a backend endpoint that scopes the query to the caller's own
`couple_id`/`vendor_id`. See
[docs/backend-schema.md](./docs/backend-schema.md#bookings) — this
pattern is not a one-off, it's how we'll model messaging or reviews later too.

### apps/web never talks to Sheets directly

`apps/web` (landing + public couple sites) is a pure consumer of `apps/api` over
HTTP — it does not import `longcelot-sheet-db` or hold any Google credentials. Public
site rendering hits a new unauthenticated endpoint
(`GET /public/sites/:slug`) that internally does the admin-sheet lookup + the
couple's own sheet read, server-side, and returns just the rendering data.

---

## 3. What's already built

- Turborepo + pnpm workspace, 5 apps, 2 shared config packages (see repo root).
- `apps/api` Google OAuth login wired for all 3 portals via `longcelot-sheet-db`'s
  `createAuthRouter`: admin is `login-only`; couple/vendor are `open` self-registration
  landing in `status: 'pending'`; admin approval endpoints
  (`/admin/api/users/:userId/approve|reject`) provision the actor's sheet on approve.
  JWT-based session, `requireAuth`/`requireRole` middleware.
- `schemas/admin/users.ts` — `role: enum(admin,couple,vendor)`,
  `status: enum(pending,active,inactive)`.

This does **not** yet support the multi-partner couple model (see §1) or any of the
tables in [docs/backend-schema.md](./docs/backend-schema.md) beyond `users` — those
are next.

---

## 4. Document map

- [TODO.md](./TODO.md) — phased build checklist.
- [docs/backend-schema.md](./docs/backend-schema.md) — full table design (admin sheet
  + couple sheet + vendor sheet), relationships, and the rationale behind each
  non-obvious call.
- [docs/tasks/admin.md](./docs/tasks/admin.md) — admin portal.
- [docs/tasks/couple.md](./docs/tasks/couple.md) — couple portal (dashboard,
  planning, guests, invite-partner).
- [docs/tasks/vendor.md](./docs/tasks/vendor.md) — vendor portal.
- [docs/tasks/landing.md](./docs/tasks/landing.md) — `apps/web` marketing surfaces
  (landing, about, contact, marketplace/browse, registration entry).
- [docs/tasks/template.md](./docs/tasks/template.md) — the template/section registry,
  the couple-portal website builder, and the public per-couple site renderer.
