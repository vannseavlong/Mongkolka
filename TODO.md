# TODO

Phased build order. Read [overview.md](./overview.md) first, then
[docs/backend-schema.md](./docs/backend-schema.md) and the relevant
[docs/tasks/](./docs/tasks/) doc before starting any phase — this file is the
checklist, not the design; don't implement from titles alone.

## Phase 0 — done

- [x] Turborepo + pnpm monorepo, 5 apps, shared tsconfig/eslint packages.
- [x] `apps/api` Google OAuth login for admin (login-only) / couple / vendor (open,
      pending-until-approved), JWT session, admin approve/reject endpoints.
- [x] `users` schema: `role` enum, `status` enum (pending/active/inactive).

## Phase 1 — shared foundations

- [x] `packages/ui` — shadcn/ui set, seeded from `Clone-UI`'s `ui/` folder, Figma
      Make's versioned import specifiers stripped, one real bug fixed
      (`dialog.tsx` wasn't merging a caller's `className` via `cn()`). Wired into
      Next.js via `transpilePackages` + Tailwind v4 `@source`.
- [x] `react-hook-form` + `zod` adopted as the standard form pattern in
      `apps/admin`/`apps/vendor`; SWR adopted for data fetching (swapped in after a
      manual `useEffect`/`useState` approach tripped Next 16's
      `set-state-in-effect` lint rule).
- [x] New backend tables (admin sheet): `couples`, `couple_members`, `vendors`,
      `vendor_categories`, `bookings` — schema files written, synced to the live
      sheet, `vendor_categories` seeded with `photographer, salon, food_service,
      hotel, honeymoon, decoration`. See
      [docs/backend-schema.md](./docs/backend-schema.md).
- [x] New backend tables (couple sheet): `couple_profile`, `website_sections`,
      `guests`, `budget_categories`, `checklist_items`, `milestones`.
- [x] New backend tables (vendor sheet): `vendor_profile`, `portfolio_items`,
      `services`.
- [x] Extended the admin approve endpoint to also create the matching
      `couples`/`vendors` catalog row (and first `couple_members` row) via each
      module's own service.
- [x] `apps/api` refactored into `config/`, `middlewares/`, `utils/`,
      `modules/<feature>/{model,service,controller,routes}.ts` — see
      `memory/backend_architecture.md`.
- [x] **Invite-partner flow** — `POST /couple/api/members/invite` creates the
      second login identity directly (active, same `actor_sheet_id`, no new
      sheet) rather than going through `selfRegisterOnUser`'s pending-user path;
      `selfRegisterOnUser` still handles the *first* partner's self-registration
      unchanged. See `apps/api/src/modules/couple-members/`.
- [x] Frontend structure standard: `apps/admin`/`apps/vendor`/`apps/couple` all
      rebuilt (or built from the start, for couple) in a shadcn-admin-style
      feature-folder pattern — `features/<name>/{data/schema.ts, components/,
      index.tsx}`, a provider+dialogs state pattern for create/edit/delete, and
      the shared TanStack-Table-powered `DataTable` in `packages/ui`. Routing/auth
      stayed Next.js App Router + our own JWT (not TanStack Router/Clerk, which is
      what the reference repo actually uses) — an adaptation, not a literal port.
- [x] `site_templates` + `section_components` (admin sheet) — replaces the earlier
      single-table `website_templates` design once real requirements (color
      cascade + per-section component variants, not just recoloring) arrived. See
      [docs/backend-schema.md](./docs/backend-schema.md#site_templates).
- [x] `couple_profile.site_template_id`/`theme_override`,
      `website_sections.component_id`/`color_override` — the color/component
      cascade columns. See
      [docs/tasks/template.md](docs/tasks/template.md#the-two-axes-component-and-color).
- i18n: decided *not* to adopt `next-intl` — the public site only needs one URL +
      a client-side toggle + a `?lang=` initial value, which a small shared context
      covers without routing machinery. See
      [docs/tasks/template.md](docs/tasks/template.md#i18n-on-the-public-site).
      `packages/types` (shared TS interfaces) was skipped in favor of small
      per-app `lib/types.ts` files — revisit if duplication actually becomes a
      problem, not preemptively.

## Phase 2 — admin portal — done

See [docs/tasks/admin.md](docs/tasks/admin.md).

- [x] Route guard, sidebar shell, overview stats (real counts).
- [x] Manage users (search/filter, activate/deactivate).
- [x] Approvals queue (pending couples/vendors), couples/vendors browse with
      suspend/reactivate.
- [x] Vendor category CRUD.
- [x] Template catalog CRUD — split into two features matching the two-table
      schema: `site-templates` (design packs: theme + default component per
      section) and `section-components` (the variant catalog, e.g. the four
      `opening` styles).

## Phase 3 — vendor portal — mostly done

See [docs/tasks/vendor.md](docs/tasks/vendor.md).

- [x] Dashboard shell (Overview / Profile / Portfolio / Services / Bookings).
- [x] Profile (split across the admin-sheet `vendors` row + the vendor's own
      `vendor_profile` row), portfolio CRUD, services CRUD.
- [x] Bookings list, scoped read of the admin-sheet `bookings` table.
- [ ] Public vendor profile page — build alongside
      [Phase 6's marketplace](#phase-6--landing--marketing-appsweb--landing-page-done-marketplace-not-started),
      they link to each other.
- [ ] Messaging — still deferred, see Phase 7.

## Phase 4 — couple portal — done

See [docs/tasks/couple.md](docs/tasks/couple.md) (structure differs from what's
described there — see note below).

- [x] Dashboard shell — built as separate feature pages (Overview, Guests, Budget,
      Checklist, Milestones, Profile, Website) rather than one combined "Planning"
      page; Overview reads real aggregated stats from a dedicated
      `/couple/api/overview` endpoint, not recomputed client-side.
- [x] Planning: checklist + budget categories + milestones, each its own
      feature/table (milestones renders as a timeline, not a table — better fit
      for a countdown view).
- [x] Guests: CRUD + status tracking (inline RSVP-status `Select`, no dialog).
- [x] Invite-partner UI — a members section on the Profile page (list + invite
      form + remove, collaborator rows only).
- [x] Website builder — template picker, whole-site theme override, per-section
      component/color override, enable/reorder, publish/unpublish, and a live
      preview panel rendering the couple's actual choices via
      `packages/templates`' `SiteRenderer` (see Phase 5).

## Phase 5 — template system — done

See [docs/tasks/template.md](docs/tasks/template.md).

- [x] `packages/templates` — `theme.ts` (`resolveTheme()` cascade), `registry.ts`
      (`resolveComponent()`, never throws — falls back gracefully), `i18n.tsx`
      (UI-chrome-only en/kh dictionary), `site-renderer.tsx` (`SiteRenderer` — the
      shared section-resolve-and-render loop used by *both* the couple-portal
      preview and the real public site, so they can't drift).
- [x] `opening` section: four real, distinct components — `opening_curtain`,
      `opening_door`, `opening_book`, `opening_envelope`.
- [x] One default component each for `hero, story, gallery, details, rsvp,
      registry, timeline, music`.
- [x] Couple-portal website builder (pick site template → pick sections →
      per-section component/color override → whole-site theme override →
      preview/publish) — `apps/couple`'s `features/website/`.
- [x] Public site renderer in `apps/web` at `app/[slug]/page.tsx`, backed by
      `GET /public/api/site/:slug` — **path-based, not subdomain-based**: the
      domain-routing middleware mentioned below was *not* built, so
      `couples.custom_domain` is schema-only right now. Revisit if custom domains
      become a real requirement.
- [x] Guest personalization via `?to=`/`?lang=` query params + the language
      toggle (toggle still works after either param).
- [x] RSVP section writes to the couple's own `guests` table via
      `POST /public/api/site/:slug/rsvp` (public, unauthenticated, resolves the
      couple from the slug only) — find-by-name-or-create, no guest auth exists.

## Phase 6 — landing / marketing (`apps/web`) — landing page done, marketplace not started

See [docs/tasks/landing.md](docs/tasks/landing.md).

- [x] Landing page — hero, three-step "how it works", CTAs straight into the
      couple/vendor portals' own login (which already self-registers on first
      Google sign-in — no separate chooser/form was built, see below).
- [ ] Domain routing middleware — not built; public sites are served at
      `apps/web`'s `/[slug]`, not couple-owned custom domains.
- [ ] Header/nav with real routes + real session-derived `userType`.
- [ ] About, Contact pages.
- [ ] Marketplace/browse — real paginated vendor list + shared `vendor_categories`.
- [ ] Dedicated registration entry (couple/provider chooser page) — currently the
      landing page's CTAs just link to each portal's existing OAuth login, which
      is sufficient for self-registration but isn't a marketing-style chooser.
- [ ] `FloatingElements` (copy verbatim) + `InvitationCardDemo` (keep as
      self-contained decoration only).

## Phase 7 — deferred / not scoped yet

Flag before starting any of these — none are designed in
[docs/backend-schema.md](./docs/backend-schema.md) yet:

- [ ] Digital invitation-card customizer (`InvitationCustomizer.tsx` reference) —
      distinct feature from the website builder, own template concept
      (layout/fold-type + per-panel color/content). See `invitation_templates` /
      `invitation_panels` stubs in
      [docs/backend-schema.md](./docs/backend-schema.md).
- [ ] Real payment integration for "publish" (Clone-UI's ABA QR-code flow is 100%
      fake — no gate exists in the Phase 5 plan above).
- [ ] Couple↔vendor messaging (Clone-UI's version has no send/thread capability at
      all — needs a real design, including whether it's another cross-actor
      admin-sheet table like `bookings`).
- [ ] Contact-us message delivery destination (table vs. email forwarding — small,
      pick one when Phase 6's Contact page is built).
- [ ] Actor-owned Drive separation (`TokenStore` on `credentials`, per
      `longcelot-sheet-db`'s drive skill) — infra improvement, not user-facing,
      do whenever it's convenient.
- [ ] `site_templates`/`section_components` usage counts — decide whether to compute
      on demand or run a periodic aggregation job; not resolved in the schema doc.
- [ ] More component variants per section beyond `opening`'s four and the one
      default elsewhere — add as product demand shows up.
