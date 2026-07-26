# Vendor Portal (`apps/vendor`)

Read [overview.md](../../overview.md) and [docs/backend-schema.md](../backend-schema.md)
first.

## What's already built

`apps/api`'s vendor auth (`open` registration → `pending` → admin-approved,
provisioning the vendor's sheet) already exists — see git history. This doc covers
the actual vendor UI, which doesn't exist yet.

## Reference: `ServiceProviderDashboard.tsx`

The least data-modeled of the three dashboards in Clone-UI — no TypeScript
interfaces declared anywhere (everything inferred from inline object literals), and
notably its Profile tab uses **uncontrolled inputs** (`defaultValue=...`), which is
inconsistent with every other form in the app and would silently break a "Save
Changes" wire-up even if one existed (there's no state to read the current values
from). Do not copy that pattern — every form here should be a controlled
`react-hook-form` instance like everywhere else.

Stats (`views: 2847, leads: 156, bookings: 23, earnings: 12500`), recent bookings, and
messages are all 100% static hardcoded data — not even fake local mutation like
`GuestManager`/`PlanningManager` have. Treat the whole data layer as needing to be
built from scratch against real tables, using this file only for the tab layout and
visual structure (Overview / Bookings / Messages / Profile).

## Pages/tabs to build

### Overview
Real stat cards once there's real data to aggregate: booking count/status breakdown
from `bookings` ([docs/backend-schema.md](../backend-schema.md#bookings)) filtered to
this vendor. "Views"/"leads" imply analytics tracking that doesn't exist anywhere in
this plan yet — don't fake these numbers; either scope real view-tracking as its own
task or drop these specific stats for v1.

Portfolio gallery preview — reads `portfolio_items`
([docs/backend-schema.md](../backend-schema.md#portfolio_items)), replacing Clone-UI's
8 placeholder camera-icon tiles with real uploaded images.

### Bookings
Table over `bookings` where `vendor_id` = this vendor
([docs/backend-schema.md](../backend-schema.md#bookings)) — this is the cross-actor
admin-sheet table, read through a scoped backend endpoint
(`GET /vendor/api/bookings`), not a table in the vendor's own sheet. Status update
(confirm/complete/cancel) → `PATCH` on the same table, scoped so a vendor can only
touch their own rows.

### Messages
**Not designed in this plan** — see
[docs/backend-schema.md](../backend-schema.md#services) on why: Clone-UI's version is
entirely fake (static previews, no send, no thread view), and there's no requirement
yet for what a real couple↔vendor messaging feature needs (real-time? notifications?
tied to a specific booking?). Flag as its own design task before building rather than
reusing the fake UI as if the hard part (data model + delivery) were solved.

### Profile
Editable business profile — split across two tables per
[docs/backend-schema.md](../backend-schema.md#vendors): `business_name`/`category_id`
are admin-reviewed fields on the admin-sheet `vendors` row (changing them might
reasonably need admin awareness — decide whether an edit here re-flags for review,
or is unrestricted; not decided here) — everything else (`bio`, `service_area`,
`portfolio_items`, `services`) is the vendor's own sheet, freely editable, no admin
involvement.

Service/pricing list → CRUD over `services`
([docs/backend-schema.md](../backend-schema.md#services)) — Clone-UI has no
equivalent of this at all (no pricing/package management exists in
`ServiceProviderDashboard.tsx`), this is new UI, not an adaptation.

## Public vendor profile

`ServiceProviderDashboard.tsx`'s header has a "View Public Profile" button that does
nothing. A vendor's public-facing profile (what a couple sees when browsing the
marketplace) is part of [docs/tasks/landing.md](landing.md)'s marketplace/browse
surface, not this app — this portal only edits the data, `apps/web` renders the
public view.

## UI

shadcn `Tabs` for the dashboard shell, `Table` for bookings, `Card` for
portfolio/services grids, `react-hook-form` + `zod` for profile/service forms,
`Sonner` for save feedback.
