# Admin Portal (`apps/admin`) — built

Read [overview.md](../../overview.md) and [docs/backend-schema.md](../backend-schema.md)
first.

## Structure

`apps/admin` follows the feature-folder pattern described in
[overview.md](../../overview.md#frontend-structure-feature-folder-pattern-shadcn-admin-adapted):
each feature under `src/features/<name>/` has its own zod schema, a
provider+dialogs context for create/edit/delete state, and a `DataTable`
(TanStack Table, from `packages/ui`). Routes under `src/app/(dashboard)/<page>/`
are thin wrappers rendering the feature's `index.tsx`. A layout-level
`getToken()` check (in `app/(dashboard)/layout.tsx`) redirects to the login gate
if there's no JWT — there's no Next.js middleware-based route guard, the check
happens client-side in the dashboard layout.

Reference used for the visual/content shape only, not the code:
`SuperAdminDashboard.tsx` in `/Clone-UI` (five tabs: Overview, Manage Users,
Manage Templates, Approve Providers, Manage Marketplace) — its lack of real auth,
`confirm()`/`alert()`-based actions, hardcoded stats, and single 900-line
tab-switched file were all deliberately not carried over; see
[overview.md](../../overview.md#clone-ui-what-it-is-and-how-it-was-used).

## Features built

### `overview` (`/dashboard`)
Stat cards from `GET /admin/api/overview`: total couples, total vendors, pending
couples, pending vendors, active templates — real counts, no fake revenue figure
(bookings aggregation isn't wired into this page; see Marketplace note below).

### `users` (`/users`)
Table over `users` — search + `role`/`status` filter, deactivate action
(`PATCH` on `status`). Deleting a login identity is a different operation from
deleting a couple/vendor tenant (`couple_members`/`vendors` rows outlive an
individual login being removed) — the UI doesn't conflate the two.

### `approvals` (`/approvals`)
Filtered view over the same `users` data (`status = pending`), reusing the
`users` feature's zod schema. Approve calls
`POST /admin/api/users/:userId/approve`, which — beyond flipping the `users` row
to `active` and provisioning the actor's real Sheet — also creates the matching
`couples`/`vendors` catalog row (and, for couples, the first `couple_members`
row, `member_role: 'partner'`) via `CouplesService.provisionCouple()` /
`VendorsService.provisionVendor()`. Reject sets `status: 'inactive'`.

### `couples` (`/couples`)
Browse all `couples` rows, suspend/reactivate.

### `vendors` (`/vendors`)
Browse all `vendors` rows, suspend/reactivate, with the vendor's category shown
via a small cell component resolving `category_id` → `vendor_categories.label_en`.

### `vendor-categories` (`/vendor-categories`)
CRUD over `vendor_categories` — `key`, `label_en`, `label_kh`, `icon`
(a `lucide-react` icon name), active/inactive toggle.

### `site-templates` (`/site-templates`)
CRUD over `site_templates` — `template_id`, `name`, `default_theme` (four color
inputs + font-style select), `default_components` (a Select per section,
options pulled live from `section-components`), active/inactive toggle. Two
separate catalogs, not one — see
[docs/tasks/template.md](template.md#the-two-axes-component-and-color) for why
`site_templates` and `section_components` are split.

### `section-components` (`/section-components`)
CRUD over `section_components` — `component_id`, `section`, `name`, preview
colors, active/inactive toggle. Both this and `site-templates` are
metadata-only management; admin doesn't edit component implementation code
here (that's `packages/templates`, a developer change) — no "edit component
design" button that has nowhere real to go.

## Not built

- **Marketplace overview / real booking aggregates** — `bookings` exists and is
  read (read-only) from the vendor portal, but nothing creates a booking yet
  (no couple-facing "request this vendor" flow), so there's no real data to
  aggregate into admin-side marketplace stats. Build alongside
  [docs/tasks/vendor.md](vendor.md)'s public vendor profile / booking-request
  flow.

## UI

The shared `DataTable` (`packages/ui`, TanStack Table — sorting, column
visibility, faceted filters, pagination) for every list, `AlertDialog` for
suspend/reject confirmations, `Sonner` for action feedback, `react-hook-form` +
`zod` for every form.
