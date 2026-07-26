# Admin Portal (`apps/admin`)

Read [overview.md](../../overview.md) and [docs/backend-schema.md](../backend-schema.md)
first.

## What's already built

`apps/api`'s admin auth (`login-only`) and the approval endpoints
(`/admin/api/users/:userId/approve|reject`) already exist — see git history. This doc
covers the actual admin UI, which doesn't exist yet, plus the additional
endpoints/tables ([docs/backend-schema.md](../backend-schema.md)) it needs beyond
`users`.

## Reference: `SuperAdminDashboard.tsx`

Closest existing analog (five tabs: Overview, Manage Users, Manage Templates, Approve
Providers, Manage Marketplace). Useful as a visual/layout reference; **not** reusable
as-is:

- No route guard at all — `App.tsx` renders it purely off a client-side `userType`
  flag flipped by a dev-only floating button. The real app has actual JWT-based
  `role: 'admin'` auth already (`requireAuth`/`requireRole` in `apps/api`) — the
  Next.js side needs its own equivalent (middleware or a layout-level check) before
  rendering *anything* in this app.
- Every action (suspend/delete a user, approve/reject a provider, delete a template)
  is `confirm()` + local `useState` mutation + `alert()` — no real endpoint called
  anywhere. All of these need real API calls.
- No pagination, no server-side search — search/filter is a client-side `.filter()`
  over a 3-4-item hardcoded array. Fine at prototype scale, not fine for a real
  admin table; plan real pagination once user/vendor/couple counts grow.
- The "View Marketplace" tab's stats (`totalServices`, `totalBookings`,
  `averageRating`) and revenue figure are hardcoded strings, not computed from
  anything — real versions need to aggregate from `bookings`
  ([docs/backend-schema.md](../backend-schema.md#bookings)) and vendor/couple counts.

## Pages/tabs to build

Structure as real Next.js routes (`/users`, `/templates`, `/vendors`, `/marketplace`),
not one giant tab-switched component like `SuperAdminDashboard.tsx` — 900 lines in one
file is exactly the "mess" [overview.md](../../overview.md) says not to copy.

### Overview
Stat cards computed from real counts: total users (by role), pending approvals
(couples + vendors), active templates. No fake revenue figure unless
`bookings.amount` aggregation is actually wired.

### Manage users
Table over `users` (search + `role`/`status` filter, paginated). Suspend/reactivate
→ `PATCH` on a user's `status`. Deleting a login identity is different from deleting
a couple/vendor tenant (`couple_members`/`vendors` rows outlive an individual login
being removed) — don't conflate "remove a user" with "remove a couple/vendor," they
operate on different tables.

### Approve couples / vendors
Two lists (or one filterable list) over `couples`/`vendors` where `status = pending`.
Approve → the existing `/admin/api/users/:userId/approve` endpoint already handles
provisioning the sheet on the `users` row; extend this flow to also create the
matching `couples`/`vendors` catalog row (see
[docs/backend-schema.md](../backend-schema.md#couples)) and, for couples, the first
`couple_members` row (`member_role: 'partner'`) — today's endpoint only touches
`users`, it needs to reach these new tables too when this ships. Reject → `status:
'rejected'`/`'inactive'` on the catalog row, matching `SuperAdminDashboard.tsx`'s
approve/reject color-coding (orange/green/red) as the visual reference.

### Manage templates
CRUD over `website_templates`
([docs/backend-schema.md](../backend-schema.md#website_templates)) — name, section,
preview colors, active/inactive toggle. This is metadata-only management; admin is
not editing template layout code here (that's a code change, done by a developer, not
a portal feature) — make sure the UI doesn't imply otherwise (no "edit template
design" button that has nowhere real to go).

### Manage vendor categories
CRUD over `vendor_categories` — not in `SuperAdminDashboard.tsx` at all (Clone-UI
hardcodes categories in two different files with no admin management), but necessary
now that categories are a real lookup table instead of a fixed enum
([docs/backend-schema.md](../backend-schema.md#vendor_categories)).

### Marketplace overview (read-only)
Real aggregates from `bookings`, once that table has real data — don't build fake
stat cards ahead of having anything to aggregate; this can come after
bookings/vendor browsing exist in [docs/tasks/vendor.md](vendor.md).

## UI

shadcn `Table` (with real pagination) for every list, `Tabs`/`Sidebar` for the
navigation shell, `AlertDialog` for suspend/reject confirmations (not
`confirm()`/`alert()`), `Sonner` for action feedback, `react-hook-form` + `zod` for
the template/category forms.
