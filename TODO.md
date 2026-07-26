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

- [ ] `packages/ui` — shadcn/ui set, seeded from `Clone-UI`'s `ui/` folder (it's a
      genuine standard shadcn export, safe to copy in) + Tailwind config, shared by
      all 4 Next.js apps.
- [ ] `packages/types` — TS interfaces mirroring
      [docs/backend-schema.md](./docs/backend-schema.md) (`Guest`, `BudgetCategory`,
      `Booking`, etc.), imported by both `apps/api` and the Next.js apps.
- [ ] `packages/templates` — see [docs/tasks/template.md](docs/tasks/template.md),
      empty registry scaffold + types, before any section components are built.
- [ ] Adopt `react-hook-form` + `zod` as the standard form pattern (every task doc
      calls for this instead of Clone-UI's hand-rolled `useState` forms) — set up
      once, reuse everywhere.
- [ ] Decide on i18n approach (`next-intl` recommended, see
      [overview.md](./overview.md#i18n)) before porting any Clone-UI page that has a
      `translations` dict — don't let the copy-pasted-dictionary pattern spread
      further.
- [ ] New backend tables (admin sheet): `couples`, `couple_members`, `vendors`,
      `vendor_categories`, `website_templates`, `bookings` — schema files + seed
      `vendor_categories` with `photographer, salon, food_service, hotel, honeymoon,
      decoration`. See [docs/backend-schema.md](./docs/backend-schema.md).
- [ ] New backend tables (couple sheet): `profile`, `website_sections`, `guests`,
      `budget_categories`, `checklist_items`, `milestones`.
- [ ] New backend tables (vendor sheet): `profile`, `portfolio_items`, `services`.
- [ ] Extend the admin approve endpoint to also create the matching
      `couples`/`vendors` catalog row (and first `couple_members` row) — today it
      only touches `users`. See [docs/tasks/admin.md](docs/tasks/admin.md#approve-couples--vendors).
- [ ] **Invite-partner flow** — extend `apps/api`'s `selfRegisterOnUser` with the
      pending-invite branch described in
      [docs/tasks/couple.md](docs/tasks/couple.md#invite-partner-flow-new--required-for-the-multi-user-model). This is the
      one auth code change every other couple-portal feature assumes exists; do it
      early, not as an afterthought.

## Phase 2 — admin portal

See [docs/tasks/admin.md](docs/tasks/admin.md).

- [ ] Route guard / auth check for the whole app (no equivalent exists in
      `SuperAdminDashboard.tsx` at all — it's dev-button-gated only).
- [ ] Manage users (search/filter/paginate, suspend/reactivate).
- [ ] Approve/reject couples and vendors.
- [ ] Manage templates (catalog metadata CRUD, not layout editing).
- [ ] Manage vendor categories.
- [ ] Overview stats — real counts, no hardcoded revenue figure.

## Phase 3 — vendor portal

See [docs/tasks/vendor.md](docs/tasks/vendor.md).

- [ ] Dashboard shell (Overview / Bookings / Profile — Messages deferred, see below).
- [ ] Portfolio + services CRUD (`services` has no Clone-UI equivalent — new UI).
- [ ] Bookings list, scoped read of the admin-sheet `bookings` table.
- [ ] Public vendor profile page — build alongside
      [Phase 6's marketplace](#phase-6--landing--marketing-appsweb), they link to
      each other.

## Phase 4 — couple portal

See [docs/tasks/couple.md](docs/tasks/couple.md). Depends on Phase 1's invite-partner
flow.

- [ ] Dashboard shell (Overview / Planning / Website / Guests) — Overview reads real
      budget/checklist state, does not duplicate it (Clone-UI's `CoupleDashboard` and
      `PlanningManager` disagree on this today).
- [ ] Planning: checklist + budget categories + milestones.
- [ ] Guests: CRUD + status tracking.
- [ ] Invite-partner UI (the portal-side half of Phase 1's backend flow).

## Phase 5 — template system

See [docs/tasks/template.md](docs/tasks/template.md). Depends on Phase 1's
`packages/templates` scaffold.

- [ ] First template per section (`hero, story, gallery, details, rsvp, registry,
      timeline, music`) — recolor-only variants to start (cheap, matches Clone-UI's
      validated visual approach); registry already supports richer layouts later.
- [ ] Couple-portal website builder (select sections → select template per section →
      customize + preview).
- [ ] Public site renderer in `apps/web` (`GET /public/sites/:slug` +
      `app/[slug]/page.tsx`), including the domain-routing middleware from
      [docs/tasks/landing.md](docs/tasks/landing.md#domain-routing-build-this-first--everything-else-depends-on-it).
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
- [ ] `website_templates.usage_count` — decide whether to compute on demand or run a
      periodic aggregation job; not resolved in the schema doc.
