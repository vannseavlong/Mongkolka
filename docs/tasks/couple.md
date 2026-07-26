# Couple Portal (`apps/couple`) — built

Read [overview.md](../../overview.md) and [docs/backend-schema.md](../backend-schema.md)
first. The website builder is covered in more depth in
[docs/tasks/template.md](template.md) — this doc covers the dashboard shell,
planning/budget, guests, and the invite-partner flow.

## Structure

Same feature-folder pattern as `apps/admin`/`apps/vendor` (see
[overview.md](../../overview.md#frontend-structure-feature-folder-pattern-shadcn-admin-adapted)):
each area is its own `src/features/<name>/`, with routes under
`src/app/(dashboard)/<page>/` as thin wrappers. **Built as separate pages, not one
tabbed dashboard** — `overview`, `guests`, `budget`, `checklist`, `milestones`,
`profile` (couple details + members), and `website` (the builder) each have their
own route and their own sidebar entry, rather than `CoupleDashboard.tsx`'s
Overview/Planning/Website/Guests tab structure. Functionally equivalent ground is
covered; the navigation shape differs.

## Overview (`/dashboard`)

Stat cards from a single `GET /couple/api/overview` call — total/confirmed/declined
guests, budget spent vs. allocated, checklist completed vs. total, days until the
wedding (computed server-side from `couples.wedding_date`), and the website's
publish status. The endpoint aggregates real `guests`/`budget_categories`/
`checklist_items` server-side; the page does not maintain any of its own numbers.

## Guests (`/guests`)

Full CRUD (`apps/api`'s `couple-guests` module) over the couple's own `guests`
table (see [docs/backend-schema.md](../backend-schema.md#guests)) — create/edit via
one combined dialog, delete via `AlertDialog`, RSVP status changed inline via a
`<Select>` in the table (no dialog for that one field, since it's the most common
edit). A guest can also arrive here via the public site's RSVP form
(`POST /public/api/site/:slug/rsvp`, unauthenticated, find-by-name-or-create) — see
[docs/tasks/template.md](template.md).

Not built: QR-code invites, Telegram bot sending (Clone-UI's Telegram button only
opened a chat link, never sent anything — not carried over as real functionality).

## Budget (`/budget`)

CRUD over `budget_categories` (name, allocated, spent, a hex color swatch via
`<input type="color">`) — same table the Overview page's budget stat reads from.

## Checklist (`/checklist`)

CRUD over `checklist_items` — `category` is a real same-sheet foreign key, selected
via a `<Select>` populated from `budget_categories` (not free text); `completed` is
an inline checkbox, not routed through the edit dialog.

## Milestones (`/milestones`)

CRUD over `milestones`, rendered as a vertical timeline (not a table — a better fit
for a wedding countdown) sorted by `months_before` descending. `completed` is an
inline checkbox.

## Profile (`/profile`)

Two things on one page:

- A form over the couple's own details — `partner1_name`/`partner2_name`/
  `partner2_email`/`wedding_date` (on the admin-sheet `couples` catalog row) plus
  `love_story`/`cover_photo_url`/ceremony+reception details/`dress_code` (on the
  couple's own `couple_profile` row) — merged into one API response
  (`GET /couple/api/profile`) and one `PATCH`.
- A members section: list of `couple_members` (email + `partner`/`collaborator`
  Badge), an invite-by-email mini-form, and a remove button on collaborator rows.
  See "Invite-partner flow" below.

## Invite-partner flow

Built differently than originally sketched here (this doc previously proposed
extending `selfRegisterOnUser` with a pending-invite branch) — instead, inviting is
a **separate, direct action** that doesn't touch the self-registration path at all:

1. Partner 1 registers the normal way (self-register → pending → admin-approves →
   sheet created, `couples` + first `couple_members` row created,
   `member_role: 'partner'`) — unchanged.
2. From the Profile page, partner 1 enters partner 2's email →
   `POST /couple/api/members/invite`. If no `users` row exists yet for that email
   (role `couple`), one is created directly as **`active`**, pointed at the
   **same** `actor_sheet_id` as partner 1 — no new Sheet, no pending/approval step,
   since they're joining an already-active tenant. A `couple_members` row is added
   (`member_role: 'collaborator'`, `invited_by` set to partner 1's `user_id`).
3. Partner 2 signs in with Google whenever they like. `selfRegisterOnUser` (used
   unmodified) finds the already-existing `active` `users` row for their email and
   returns it as-is — no new row created. `requireActiveCouple` (the couple-context
   middleware) resolves their `couple_members` row the same way it resolves
   partner 1's, and they land in the same couple portal with the same data.

Removing a member is guarded: a couple must keep at least one member, so removing
the last remaining one is rejected (`409`). See
`apps/api/src/modules/couple-members/` and
`apps/api/src/middlewares/couple-context.middleware.ts`.

## Website builder

See [docs/tasks/template.md](template.md) — lives at `/website` in this app.

## UI

The shared `DataTable` for guests/checklist tables, `Card` for overview stats and
budget/profile sections, `AlertDialog` for delete confirmations,
`react-hook-form` + `zod` for every form, `sonner` for feedback.
