# Vendor Portal (`apps/vendor`) — built

Read [overview.md](../../overview.md) and [docs/backend-schema.md](../backend-schema.md)
first.

## Structure

Same feature-folder pattern as `apps/admin`/`apps/couple` (see
[overview.md](../../overview.md#frontend-structure-feature-folder-pattern-shadcn-admin-adapted)):
`overview`, `profile`, `portfolio`, `services`, `bookings`, each its own page under
`src/app/(dashboard)/`.

Built against real data from the start — the reference, `ServiceProviderDashboard.tsx`
in `/Clone-UI`, was the least data-modeled of the three prototype dashboards (no
declared interfaces, uncontrolled `defaultValue=...` inputs, and its stats/bookings/
messages were 100% static hardcoded strings, not even fake local mutation) — used for
tab layout/visual structure only, not for any data shape or form pattern.

## Overview (`/dashboard`)

Stat cards: total bookings, pending bookings (`status` in `pending`/`inquiry`),
portfolio photo count, services listed — all real counts from
`GET /vendor/api/bookings`, `/vendor/api/portfolio`, `/vendor/api/services`. Clone-UI's
"views"/"leads" stats implied analytics tracking that doesn't exist anywhere in this
plan — dropped, not faked.

## Profile (`/profile`)

One form, split across two tables per
[docs/backend-schema.md](../backend-schema.md#vendors): `business_name`/
`category_id`/`location`/`description` live on the admin-sheet `vendors` row;
`bio`/`service_area` live on the vendor's own `vendor_profile` row. Merged into one
`GET`/`PATCH /vendor/api/profile` response so the form doesn't need to know which
table each field actually lives in. No re-review-on-edit gate exists — editing
`business_name`/`category_id` doesn't re-flag the vendor for admin review; unrestricted
for now.

## Portfolio (`/portfolio`)

CRUD over `portfolio_items`, rendered as an image **grid**, not the shared
`DataTable` — a photo gallery doesn't fit a table UX. Create/delete via dialogs;
`display_order` set on creation, not manually reorderable yet.

## Services (`/services`)

CRUD over `services` (`name`, `description`, `price`, `unit`:
per_event/per_hour/package) via the shared `DataTable`. Clone-UI had no equivalent of
this at all — new UI, not an adaptation.

## Bookings (`/bookings`)

**Read-only.** `GET /vendor/api/bookings` scopes `bookings`
([docs/backend-schema.md](../backend-schema.md#bookings)) to the caller's own
`vendor_id` — the cross-actor admin-sheet table, read through a backend endpoint, not
a table in the vendor's own sheet. No status-update action (confirm/complete/cancel)
is built, because nothing creates a booking yet either — there's no couple-facing
"request this vendor" flow. Both are open (see [TODO.md](../../TODO.md)).

## Not built

- **Public vendor profile page** — what a couple would see browsing the
  marketplace. Part of `apps/web`'s marketplace/browse surface (see
  [docs/tasks/landing.md](landing.md)), not this app; this portal only edits the
  data.
- **Booking creation** — no couple-facing flow requests a vendor yet, so
  `bookings` only has whatever an admin/dev inserts directly today.
- **Messaging** — Clone-UI's version was entirely fake (static previews, no send,
  no thread view); no real design exists for what couple↔vendor messaging needs
  (real-time? notifications? tied to a booking?). Flag as its own design task
  before building.

## UI

The shared `DataTable` for services/bookings, a plain grid for portfolio,
`react-hook-form` + `zod` for profile/service forms, `sonner` for save feedback.
