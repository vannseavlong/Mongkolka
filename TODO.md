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
- [ ] **Invite-partner flow** — extend `apps/api`'s `selfRegisterOnUser` with the
      pending-invite branch described in
      [docs/tasks/couple.md](docs/tasks/couple.md#invite-partner-flow-new--required-for-the-multi-user-model). This is the
      one auth code change every other couple-portal feature assumes exists; do it
      early, not as an afterthought.
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
- [ ] Template catalog CRUD — needs updating for the `site_templates` +
      `section_components` split above (the existing `/templates` page still
      targets the old single-table shape); not yet rebuilt.

## Phase 3 — vendor portal — mostly done

See [docs/tasks/vendor.md](docs/tasks/vendor.md).

- [x] Dashboard shell (Overview / Profile / Portfolio / Services / Bookings).
- [x] Profile (split across the admin-sheet `vendors` row + the vendor's own
      `vendor_profile` row), portfolio CRUD, services CRUD.
- [x] Bookings list, scoped read of the admin-sheet `bookings` table.
- [ ] Public vendor profile page — build alongside
      [Phase 6's marketplace](#phase-6--landing--marketing-appsweb), they link to
      each other.
- [ ] Messaging — still deferred, see Phase 7.

## Phase 4 — couple portal

See [docs/tasks/couple.md](docs/tasks/couple.md). Depends on Phase 1's invite-partner
flow.

- [ ] Dashboard shell (Overview / Planning / Website / Guests) — Overview reads real
      budget/checklist state, does not duplicate it (Clone-UI's `CoupleDashboard` and
      `PlanningManager` disagree on this today).
- [ ] Planning: checklist + budget categories + milestones.
- [ ] Guests: CRUD + status tracking.
- [ ] Invite-partner UI (the portal-side half of Phase 1's backend flow).
- [ ] Website builder — see Phase 5, lives in this app.

## Phase 5 — template system

See [docs/tasks/template.md](docs/tasks/template.md). Schema is done (Phase 1); the
registry package, components, and both consuming UIs are not.

- [ ] `packages/templates` — `theme.ts` (`resolveTheme()` cascade), `registry.ts`,
      per-section components.
- [ ] `opening` section: four real, distinct components — `opening_curtain`,
      `opening_door`, `opening_book`, `opening_envelope` (not recolors of one
      layout — see
      [docs/tasks/template.md](docs/tasks/template.md#the-opening-section)).
- [ ] One default component each for `hero, story, gallery, details, rsvp,
      registry, timeline, music` — more variants per section later, on demand, not
      pre-built now.
- [ ] Couple-portal website builder (pick site template → pick sections → per-section
      component/color override → whole-site theme override → preview/publish).
- [ ] Public site renderer in `apps/web` (`GET /public/sites/:slug` +
      `app/[slug]/page.tsx`), including the domain-routing middleware from
      [docs/tasks/landing.md](docs/tasks/landing.md#domain-routing-build-this-first--everything-else-depends-on-it).
- [ ] Guest personalization via `?to=`/`?lang=` query params + the language toggle.
- [ ] RSVP section writes to the couple's own `guests` table via a public,
      unauthenticated, single-couple-scoped endpoint.

## Phase 6 — landing / marketing (`apps/web`)

See [docs/tasks/landing.md](docs/tasks/landing.md).

- [ ] Domain routing middleware (shared prerequisite with Phase 5 — do this once).
- [ ] Header/nav with real routes + real session-derived `userType`.
- [ ] Landing, About, Contact pages.
- [ ] Marketplace/browse — real paginated vendor list + shared `vendor_categories`.
- [ ] Registration entry (couple/provider chooser + forms feeding the existing OAuth
      flow).
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
