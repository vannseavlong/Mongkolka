# Landing / Marketing (`apps/web`)

Read [overview.md](../../overview.md) first — this doc covers `apps/web`'s
marketing/public surfaces (landing, about, contact, marketplace browse, registration
entry, nav/footer). The public per-couple wedding site renderer is a separate concern
covered in [docs/tasks/template.md](template.md), but both share this one app and its
domain-routing setup below.

`apps/web` never imports `longcelot-sheet-db` or holds Google credentials — every page
here that needs data calls `apps/api` over HTTP.

## Domain routing (build this first — everything else depends on it)

One Next.js app serves three different things by hostname:
- `mongkolka.com` → marketing/landing (this doc).
- `{slug}.mongkolka.com` or a couple's verified custom domain → their public wedding
  site ([docs/tasks/template.md](template.md)).
- Everything else under `mongkolka.com` (`/about`, `/contact`, `/marketplace`, …) →
  marketing pages, same as root.

Implement as Next.js middleware reading the `Host` header: root domain → normal
routing; anything else → rewrite to a `/_sites/[slug]` (or similar internal) route
after resolving the hostname to a slug (subdomain parsed directly; custom domain
needs a lookup against `couples.custom_domain` — this lookup is a backend call, not
something middleware can do by string-parsing alone, keep that in mind for where the
resolution actually happens).

## Header / Nav

Adapts `Header.tsx`'s structure (logo, nav links, services dropdown, language
switcher, register/login/logout state) but:
- Replace the `Page` union + `onNavigate` callback (a manual page-swap model,
  duplicated verbatim between `App.tsx` and `Header.tsx` in Clone-UI) with real
  `next/link`/routes.
- `userType` should come from a real session (JWT decoded from stored token / a
  `/me`-style check), not a prop threaded from local component state.
- The Services dropdown in Clone-UI lists 6 categories but every item navigates
  identically to `/marketplace` without applying a filter — wire it for real, driven
  by `vendor_categories` ([docs/backend-schema.md](../backend-schema.md#vendor_categories))
  rather than a hardcoded list, so a click actually pre-filters the marketplace page.

## Landing page

`LandingPage.tsx` is clean, stateless, presentational — port close to as-is: hero,
"why choose us" grid, embedded `InvitationCardDemo` (keep as pure decoration, see
below), couple-platform preview teaser, marketplace preview tiles, testimonials,
footer. Replace hardcoded Unsplash URLs with a real asset pipeline and wire CTAs to
real routes (`/register`, `/marketplace`) instead of local state callbacks.

## About / Contact

`AboutUs.tsx` is fully static — port near-verbatim, no backend implications.

`ContactUs.tsx`'s form is currently `setTimeout`-faked ("Message Sent!" after 3s, no
actual submission). Needs a real destination — either a `contact_messages` table
(admin sheet, since there's no "actor" a contact message belongs to before
registration) or an email-forwarding integration. Not designed in
[docs/backend-schema.md](../backend-schema.md) — pick one before building; it's a
small, self-contained decision that doesn't block anything else.

## Marketplace / browse

`Marketplace.tsx`'s filtering (search + category tabs) is a reasonable UI reference,
but its `vendors` array is hardcoded and its category list is a second, independent
hardcoded copy of the same 6 categories `RegistrationFlow.tsx` also hardcodes
separately. Real version:
- Categories come from `vendor_categories`, one shared source
  ([docs/backend-schema.md](../backend-schema.md#vendor_categories)) — not
  redeclared here or in the registration flow.
- Vendor cards come from a real, paginated `GET /public/vendors` endpoint (filtered by
  `category_id`, `status: 'active'`) — not a client-side `.filter()` over a full
  in-memory array, which won't scale past a handful of vendors.
- The `showFilters` toggle button in Clone-UI opens nothing (dead state, no filter
  panel exists) — either build a real filter panel (price range, location) or drop
  the button; don't carry over a control that does nothing.
- Each vendor card should link to that vendor's public profile page (new — see
  [docs/tasks/vendor.md](vendor.md), which currently has no page here to link to;
  build both together).

## Registration entry

`RegisterDialog.tsx` (the couple-vs-provider chooser modal) is clean and directly
portable — notably the one place in all of Clone-UI that actually uses its own shadcn
`Dialog` rather than a hand-rolled overlay; use it as the reference pattern for every
other modal across the whole product, not just here.

`RegistrationFlow.tsx`'s two forms (couple / provider) are a reasonable field
reference — partner 1 + partner 2 email, wedding date for couples; category, business
name, email, location for providers — but have zero validation and a fake submit
(`onComplete(userType)` fires regardless of form state). Real version:
- `react-hook-form` + `zod` validation for both forms.
- Real submit hits the existing Google-OAuth registration flow already built in
  `apps/api` (see git history) — this form's "submit" is really "tell me your
  intent, then redirect into Google sign-in," not a traditional form POST, since
  actual account creation happens via the OAuth callback's `onUser`. Design the
  couple/provider category/wedding-date fields as data to carry through to that
  callback (e.g. via query params or a short-lived pending-registration record),
  not fields submitted to a plain form endpoint.
- The provider category picker should come from `vendor_categories`, same as
  Marketplace — third place in Clone-UI that redeclares this list independently.
- The photo-upload dropzone is decorative/non-functional in Clone-UI — real file
  upload is new work, not adaptation.

## Decorative-only, low priority

`FloatingElements.tsx` (drifting hearts/sparkles background) is trivial and
self-contained — copy verbatim, no changes needed.

`InvitationCardDemo.tsx` is a landing-page-only decorative widget (flip/open
envelope animation) with its **own**, separate 6 template definitions, inconsistent
with the real `InvitationCustomizer.tsx` (different ids, different color format). If
kept, keep it exactly as decoration with its own tiny independent config — it is not
the real invitation feature (which is Phase 2 anyway, see
[overview.md](../../overview.md)) and shouldn't be wired to real data.

## UI

shadcn `Dialog`/`NavigationMenu`/`Card` for nav and modals, Framer Motion for the
hero/testimonial/floating-elements polish (the one place heavier animation earns its
keep), `react-hook-form` + `zod` for every form. Recommend `next-intl` for `en`/`kh`
instead of the copy-pasted `translations` dict pattern every Clone-UI component
repeats independently (see [overview.md](../../overview.md#i18n)).
