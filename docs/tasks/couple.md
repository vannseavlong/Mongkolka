# Couple Portal (`apps/couple`)

Read [overview.md](../../overview.md) and [docs/backend-schema.md](../backend-schema.md)
first. The website builder is covered separately in
[docs/tasks/template.md](template.md) — this doc covers the dashboard shell,
planning/budget, guests, and the invite-partner flow the multi-user account model
requires.

## Auth note: this is not built yet

`apps/api`'s current couple auth (`selfRegisterOnUser`) only checks
`findOne({ where: { email, role: 'couple' } })` — it has **no concept of joining an
existing couple**. Partner 2 logging in today would go through the exact same path as
a brand-new couple: land in `pending`, and (if approved) get their **own separate**
sheet — two independent weddings instead of one shared one. This has to be fixed
before the couple portal can support two partners, per
[overview.md](../../overview.md#the-couple-account-is-multi-user). See
"Invite-partner flow" below for the fix.

## Dashboard shell

Adapts `CoupleDashboard.tsx`'s tab structure: Overview / Planning / Website / Guests
(drop the dead `'marketplace'` tab type that exists in Clone-UI's type union but has
no button or content — either build it for real, linking out to
[docs/tasks/vendor.md](vendor.md)'s marketplace browse, or remove it; don't leave a
tab that goes nowhere).

**Overview tab must not duplicate state.** In Clone-UI, `CoupleDashboard.tsx` shows
its own hardcoded `totalBudget`/`spent`/`daysUntilWedding`, and `PlanningManager.tsx`
separately tracks the *actual* budget via `budget_categories` — two independent fakes
that happen to both total $20,000 by coincidence. The real Overview tab reads
`budget_categories`/`checklist_items` (below) as its one source of truth; it does not
carry its own numbers.

`daysUntilWedding` is computed from `couples.wedding_date`, not hardcoded.

The floating feedback modal (star rating + comment) — if kept, needs a real submit
target. Not designed in [docs/backend-schema.md](../backend-schema.md) since there's
no stated requirement for it yet; either add a lightweight `feedback` table in the
admin sheet (same shape as any other admin-visible, cross-actor-adjacent record) or
drop the feature. Flag before building.

## Planning (checklist + budget + milestones)

Adapts `PlanningManager.tsx` directly against the real `budget_categories`,
`checklist_items`, `milestones` tables
([docs/backend-schema.md](../backend-schema.md#budget_categories)) — this file has
the best-modeled data in the whole reference prototype, so the UI/interaction design
(progress bars, over-budget red-flagging, milestone timeline computed from
`months_before` + wedding date) is a solid reference to keep. Changes required:

- Real persistence (currently pure `useState`) via the couple's own sheet.
- `category` on a checklist item is a real same-sheet foreign key now — validate it
  exists before allowing selection (a `<Select>` populated from `budget_categories`,
  not free text).
- Every add/edit modal → `react-hook-form` + `zod`, replacing hand-rolled
  `useState`-per-field forms.
- The native `<input type="color">` swatch picker for budget category colors is fine
  to keep as-is — no reason to replace a working native control with something
  heavier.

## Guests

Adapts `GuestManager.tsx` directly — its `Guest` interface is close to schema-ready
(see [docs/backend-schema.md](../backend-schema.md#guests)). Changes required:

- Real CRUD against the couple's own `guests` table, scoped automatically since it's
  the couple's own sheet (no explicit tenant filter needed in queries).
- Replace `window.confirm()` before delete with a shadcn `AlertDialog`.
- "Generate QR Codes" and real Telegram-send are both unwired stubs in Clone-UI (the
  Telegram button only *opens* a chat link — it doesn't send anything via a bot API).
  Treat both as new work, not adaptation, and size separately if wanted for v1.
- RSVP-originated guest updates (a guest self-responds via the public site's `rsvp`
  section, see [docs/tasks/template.md](template.md)) write to this same table
  through a separate, unauthenticated, single-couple-scoped endpoint — not a
  couple-portal-authenticated one.

## Invite-partner flow (new — required for the multi-user model)

Not present in Clone-UI at all (its registration form collects both partner emails
up front and pretends both are registered instantly). Real flow needed:

1. Partner 1 registers today's way (self-register → pending → admin-approves →
   sheet created, `couples` + `couple_members` rows created with `member_role:
   'partner'`).
2. From inside the couple portal, partner 1 enters partner 2's email → creates a
   pending invite (a small addition needed: either a `pending_invites` column/flag,
   or reuse `couple_members` with a `status` column set to `invited` before
   `joined_at` is set — pick one when implementing, both are minor variations on the
   same table).
3. Partner 2 signs in with Google. The couple `onUser` callback in `apps/api` needs a
   **new branch**: before falling into "create a brand-new pending couple," check
   whether this email matches a pending invite. If so, attach them as a `partner`
   `couple_members` row on the **existing** `couple_id`/`actor_sheet_id` — active
   immediately, no separate admin approval (partner 1, who's already approved,
   effectively vouches for them).
4. If no pending invite matches, fall through to today's existing behavior
   (brand-new pending couple).

This is a real code change to `apps/api/src/auth/registration.ts`'s
`selfRegisterOnUser`, not just a schema addition — call this out explicitly when
picking up implementation, it's not a couple-portal-only feature.

## UI

shadcn `Tabs` for the dashboard shell, `Card`/`Progress` for overview stats,
`Table`/`Dialog`/`AlertDialog` for guests and planning, `react-hook-form` + `zod` for
every form. Framer Motion used tastefully for section transitions (matches the visual
feel Clone-UI already established), not required for functional pieces like tables.
