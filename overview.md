# Mongkolka — Project Overview

Wedding planning platform. Couples plan their wedding and run a customizable wedding
website; vendors (photographers, salons, food service, hotels, honeymoon planners,
decorators, …) list and manage their services; admins run the marketplace.

This file is the map of the project. Read [TODO.md](./TODO.md) for the phased build
checklist (what's done vs. still open), and
[docs/backend-schema.md](./docs/backend-schema.md) + [docs/tasks/](./docs/tasks/) for
the detailed design each area was built against.

**Status**: all four apps (admin, couple, vendor, web) and the backend are built and
wired end-to-end — auth, the full couple-planning + website-builder flow, vendor
listings, admin approvals/catalogs, and the public guest-facing site with RSVP. See
[TODO.md](./TODO.md) for the precise list of what's still open (marketplace/browse,
custom-domain routing, messaging, payments, invitation cards — none of these are
started).

---

## 1. Roles & surfaces

| Role | Surface | Where it runs (dev) | Auth |
|---|---|---|---|
| Admin | Admin portal | `apps/admin`, `localhost:3001` | Login-only (invited/seeded, no self-signup) |
| Couple | Couple portal | `apps/couple`, `localhost:3002` | Self-register → pending → admin-approved |
| Vendor | Vendor portal | `apps/vendor`, `localhost:3003` | Self-register → pending → admin-approved |
| Public | Couple's own wedding site | `apps/web`, `/{slug}` | None |
| Public | Landing / marketing | `apps/web`, `/` | None |

Each portal is its own Next.js app talking to `apps/api` (Express) over HTTP; there's
no shared session between them beyond the identical JWT-in-localStorage pattern.
Public wedding sites are **path-based** (`mongkolka.com/{slug}`), not
subdomain/custom-domain routed — `couples.custom_domain` exists in the schema but
nothing resolves it yet (see [TODO.md](./TODO.md) Phase 6).

Admin manages couples & vendors (approve/reject/suspend) and the template/component
catalog. Couple plans their wedding (checklist, budget, milestones), manages guests,
and builds their public wedding website from the template system. Vendor manages
their profile/portfolio/services and reads their bookings (booking creation itself —
the couple↔vendor side — isn't built; see [TODO.md](./TODO.md) Phase 3/7).

### The couple account is multi-user

A wedding has **one** tenant (one Google Sheet, one row in `couples`), but **two**
people — both partners — can each log in with their own Google account and reach the
same couple portal and the same data. This is the same shape as "multiple staff
accounts under one branch," not "one user owns one account." Modeled via `couples` +
`couple_members` (see [docs/backend-schema.md](./docs/backend-schema.md#couples)).

The first partner goes through the normal self-register → pending → admin-approve
flow (`selfRegisterOnUser`, unchanged). Inviting the second partner is a **separate**
path that does *not* go through that flow: `POST /couple/api/members/invite` creates
the second login identity directly as `active`, pointed at the **same**
`actor_sheet_id` — no second sheet, no second approval, since they're joining an
already-active tenant, not registering a new one. See
`apps/api/src/modules/couple-members/` and
[docs/tasks/couple.md](./docs/tasks/couple.md).

---

## 2. Tech stack & architecture decisions

### Monorepo

Turborepo + pnpm workspaces.

```
apps/
  web/      Next.js — landing/marketing (`/`) + public per-couple wedding
            sites (`/[slug]`, path-based, reads a public unauthenticated API)
  admin/    Next.js — admin portal
  couple/   Next.js — couple portal
  vendor/   Next.js — vendor portal
  api/      Express + longcelot-sheet-db (Google Sheets-backed DB), Google OAuth
            login for all 3 portals, layered config/middlewares/modules/routes

packages/
  typescript-config/  shared tsconfig
  eslint-config/       shared eslint flat config
  ui/                  shared shadcn/ui component set + data-table/layout primitives
  templates/           template registry, theme cascade, section components, i18n,
                       the shared SiteRenderer (couple-portal preview + public site)
```

`packages/types` (a shared TS-interfaces package mirroring backend schemas) was
considered and **skipped** — each app defines its own small zod schemas per feature
(`features/<name>/data/schema.ts`), which has been enough; revisit only if real
duplication/drift shows up, not preemptively.

### Frontend structure: feature-folder pattern (shadcn-admin adapted)

`apps/admin`, `apps/vendor`, and `apps/couple` all follow the same structure per
feature: `features/<name>/{data/schema.ts, components/, index.tsx}`, a
provider+dialogs context for create/edit/delete state, and the shared
`DataTable` (TanStack Table, in `packages/ui`) for every list. Route files under
`app/` are thin — they just render the feature's `index.tsx`. This was adapted from
[satnaing/shadcn-admin](https://github.com/satnaing/shadcn-admin) (cloned locally to
`Clone-Admin/` as a reference, untracked) — we kept our own Next.js App Router routing
and JWT auth rather than adopting its TanStack Router/Clerk stack; only the
organization pattern was ported.

### UI library: shadcn/ui everywhere

All four Next.js apps use **shadcn/ui** as the base component library — buttons,
dialogs, forms, tables, cards, etc. — installed once into `packages/ui` and consumed
by every app.

For the public couple websites specifically, we also use **Framer Motion** (`motion`)
for the opening-section animations, and **lucide-react** for icons everywhere.

### Clone-UI: what it is and how it was used

`/Clone-UI` is a Figma Make export ("Global Wedding Platform Design") kept as a
visual/UX reference (untracked in git, like `Clone-Admin/`). Important context:

- It's a **pure client-side Vite/React SPA prototype** — no real routing, no real API
  calls (every "save"/"submit" was `setTimeout` + `alert()`/`console.log`), no real
  auth. None of that was carried over.
- Its `src/app/components/ui/` folder **was** a complete, standard shadcn/ui component
  set — used as the seed for `packages/ui` (versioned import specifiers stripped, one
  real bug fixed in `dialog.tsx`).
- Its page/feature components (`LandingPage`, `CoupleDashboard`, `GuestManager`,
  `PlanningManager`, `WebsiteBuilder`, `ServiceProviderDashboard`,
  `SuperAdminDashboard`, `PublicCouplePage`, etc.) were used as **visual/content**
  reference only — file organization, fake persistence, hand-rolled forms, and
  `window.confirm()` were all deliberately not carried over. Real forms use
  `react-hook-form` + `zod`; destructive actions use a shadcn `AlertDialog`.
- **Not built**: the fake ABA QR-code payment flow from `WebsiteBuilder` (real
  payment integration is separate, unscoped future work — see
  [TODO.md](./TODO.md) Phase 7), and `InvitationCustomizer.tsx` (a separate digital
  invitation-card concept, distinct from the wedding website — also Phase 7).

### i18n

The public couple site needs one URL, a client-side language toggle, and a `?lang=`
query param that picks the initial value — not full routing-based i18n
(`next-intl` et al.). Built as a small shared `LanguageProvider` context + one
dictionary in `packages/templates/src/i18n.tsx`, covering **UI chrome only**
(headings, buttons, labels) — a couple's own free-text content (love story, RSVP
message, etc.) is shown as-is regardless of language, not translated. The
admin/couple/vendor portals don't have i18n — not needed yet.

### Template system: code owns rendering, sheets own selection + content only

Per the original requirement: **template content is never stored as data in a Sheet
row**, and a couple gets real freedom over both *what renders* and *what color it
is* — two independent axes:

- **Component** — which section renders is a `component_id` (a stable string key)
  resolved per section, falling back to the couple's chosen `site_templates` row's
  default if not explicitly picked. The `opening` section (the entrance
  animation) has four genuinely distinct components — sliding curtain, swinging
  door, book cover, envelope — not recolors of one layout.
- **Color** — a `Theme` (bg/text/accent/font) resolved by cascade: per-section
  override → couple's whole-site override → the template's default. Each override is
  *partial*, so changing one section's accent color doesn't require respecifying
  everything else.

Both axes are resolved by `packages/templates`' `resolveComponent()`/`resolveTheme()`,
and rendered by its shared `SiteRenderer` component — used identically by the
couple-portal builder's live preview (`apps/couple`'s `features/website/`) and the
real public site renderer (`apps/web`'s `app/[slug]/`), so the two can never drift.
Full design in [docs/tasks/template.md](./docs/tasks/template.md) and the
`site_templates` / `section_components` tables in
[docs/backend-schema.md](./docs/backend-schema.md#site_templates).

### Cross-actor data (bookings, and anything couple↔vendor)

`longcelot-sheet-db` isolates each actor (couple/vendor) in **their own physical
Google Sheet** — that's the whole point (their own Drive quota, their own data). But a
booking *inherently* spans two tenants (one couple + one vendor), and there's no third
kind of sheet to put a cross-tenant row in. **Standing convention**: any record that
spans two actors lives in the **admin sheet** as neutral ground, and both portals read
it through a backend endpoint that scopes the query to the caller's own
`couple_id`/`vendor_id`. The `bookings` table follows this — currently vendor-side
read-only (`apps/vendor`'s Bookings page); nothing creates a booking yet (couple-side
booking creation isn't built — see [TODO.md](./TODO.md)). This pattern is not a
one-off; it's how messaging or reviews would be modeled later too.

### apps/web never talks to Sheets directly

`apps/web` (landing + public couple sites) is a pure consumer of `apps/api` over
HTTP — it does not import `longcelot-sheet-db` or hold any Google credentials. Public
site rendering hits `GET /public/api/site/:slug` (unauthenticated), which internally
does the admin-sheet lookup + the couple's own sheet read, server-side, and returns
just the rendering data. RSVP submission is a second public endpoint,
`POST /public/api/site/:slug/rsvp`, which finds-or-creates the matching row in the
couple's own `guests` table by name (no guest auth exists, so this is a best-effort
match, not a verified identity).

---

## 3. What's built

- Turborepo + pnpm workspace, 5 apps (`admin`, `couple`, `vendor`, `web`, `api`), 4
  shared packages (`typescript-config`, `eslint-config`, `ui`, `templates`).
- `apps/api`, layered as `config/`, `middlewares/`, `utils/`,
  `modules/<feature>/{model,service,controller,routes}.ts`, `routes/*-api.routes.ts`
  composing each actor's modules:
  - Google OAuth login for all 3 portals via `longcelot-sheet-db`'s
    `createAuthRouter`: admin `login-only`; couple/vendor `open` self-registration
    landing in `status: 'pending'`; admin approve/reject provisions the actor's real
    sheet on approve (and the matching `couples`/`vendors` catalog row).
  - Admin-side modules: users, couples, vendors, vendor-categories, site-templates,
    section-components, overview stats.
  - Vendor-side modules: profile, portfolio, services, bookings (read-only).
  - Couple-side modules: profile, members (invite-partner), guests, budget,
    checklist, milestones, website (template/theme/sections/publish), overview
    stats.
  - Public modules: site resolver + RSVP submission (both unauthenticated).
  - A global Express error handler (`express-async-errors` + a catch-all
    middleware) — without it, any async error in a route handler crashed the whole
    process.
- Full table design synced live (admin/couple/vendor sheets) — see
  [docs/backend-schema.md](./docs/backend-schema.md).
- `apps/admin`, `apps/vendor`, `apps/couple` — feature-folder frontends per §2 above,
  covering everything in [TODO.md](./TODO.md) phases 2–4.
- `packages/templates` — theme cascade, component registry, i18n, section
  components (including `opening`'s four variants), and the shared `SiteRenderer`.
- `apps/web` — landing page + public per-couple site renderer with guest
  personalization (`?to=`, `?lang=`) and RSVP.

Not built: marketplace/browse, custom-domain routing, couple↔vendor messaging,
payments, invitation-card customizer — see [TODO.md](./TODO.md) Phases 6–7 for the
full list of what's still open.

---

## 4. Document map

- [TODO.md](./TODO.md) — phased build checklist (what's done, what's open).
- [docs/backend-schema.md](./docs/backend-schema.md) — full table design (admin sheet
  + couple sheet + vendor sheet), relationships, and the rationale behind each
  non-obvious call.
- [docs/tasks/admin.md](./docs/tasks/admin.md) — admin portal.
- [docs/tasks/couple.md](./docs/tasks/couple.md) — couple portal (dashboard,
  planning, guests, invite-partner, website builder).
- [docs/tasks/vendor.md](./docs/tasks/vendor.md) — vendor portal.
- [docs/tasks/landing.md](./docs/tasks/landing.md) — `apps/web` marketing surfaces
  (landing page built; about, contact, marketplace/browse, registration entry not
  built).
- [docs/tasks/template.md](./docs/tasks/template.md) — the template/section registry,
  the couple-portal website builder, and the public per-couple site renderer.
