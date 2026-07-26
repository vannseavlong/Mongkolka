# Landing / Marketing (`apps/web`) — landing page built, rest not started

Read [overview.md](../../overview.md) first — this doc covers `apps/web`'s
marketing/public surfaces (landing, about, contact, marketplace browse, registration
entry, nav/footer). The public per-couple wedding site renderer is a separate,
**built** concern covered in [docs/tasks/template.md](template.md) — it shares this
app but not the domain-routing setup below, since that was never built (the public
site is path-based, `/[slug]`, not hostname-routed).

`apps/web` never imports `longcelot-sheet-db` or holds Google credentials — every page
that needs data calls `apps/api` over HTTP. This is true of both the landing page (no
data needed yet) and `/[slug]` (calls the public API server-side).

## What's built: the landing page

A single clean page (`apps/web/src/app/page.tsx`) — header with logo + CTAs, hero
headline/subhead + two CTA buttons, a three-step "how it works" strip, footer. Much
smaller than `LandingPage.tsx`'s full port described below (no testimonials,
marketplace preview tiles, or `InvitationCardDemo`) — scoped down since the
marketplace, testimonials, and invitation-card features it would showcase don't
exist yet either. CTAs link straight to the couple/vendor portals' own login
(`NEXT_PUBLIC_COUPLE_URL`/`NEXT_PUBLIC_VENDOR_URL` env vars, defaulting to the dev
ports), which already self-registers on first Google sign-in — there's no dedicated
registration-chooser page (see "Registration entry" below, still not built).

Everything below this point is **still open** — kept as design reference for when
it's picked up.

## Domain routing (not built)

The public wedding site is served at `apps/web`'s `/[slug]` today — a path, not a
hostname. If subdomain/custom-domain routing (`{slug}.mongkolka.com`, or a couple's
own verified domain via `couples.custom_domain`) becomes a real requirement, it needs
Next.js middleware reading the `Host` header: root domain → normal routing; anything
else → rewrite to the `/[slug]` route after resolving the hostname to a slug
(subdomain parsed directly; custom domain needs a lookup against
`couples.custom_domain` — a backend call, not something middleware can do by
string-parsing alone). Not started — flag before assuming it's a quick add.

## Header / Nav

Not built beyond the landing page's own minimal header (logo + two CTA buttons, no
dropdown/session-aware nav). If a fuller nav is needed: `userType` should come from a
real session (JWT decoded from stored token / a `/me`-style check), not client-only
state; a services/categories dropdown should be driven by `vendor_categories`
([docs/backend-schema.md](../backend-schema.md#vendor_categories)), not a hardcoded
list.

## About / Contact

Not built. `ContactUs.tsx` (in `/Clone-UI`) needs a real submission destination if
ported — either a `contact_messages` table (admin sheet, since there's no "actor" a
message belongs to before registration) or an email-forwarding integration; not
designed in [docs/backend-schema.md](../backend-schema.md) yet.

## Marketplace / browse

Not built — no public vendor-browsing surface exists yet, and no vendor has a public
profile page to link to (see [docs/tasks/vendor.md](vendor.md)). When built:
categories should come from `vendor_categories`, one shared source
([docs/backend-schema.md](../backend-schema.md#vendor_categories)); vendor cards from
a real, paginated public endpoint (filtered by `category_id`, `status: 'active'`),
not a client-side filter over an in-memory array.

## Registration entry

Not built as a dedicated page — the landing page's CTAs link directly to each
portal's existing self-registering OAuth login (`GET /couple/auth/google` /
`GET /vendor/auth/google`), which is sufficient for actually creating an account but
isn't a marketing-style couple-vs-provider chooser. If a real chooser/form is wanted
later: category/wedding-date fields collected before the OAuth redirect would need to
carry through to the `onUser` callback (e.g. via query params or a short-lived
pending-registration record) — the OAuth callback is what actually creates the
`users` row, not a plain form POST.

## Decorative-only, low priority, not built

`FloatingElements.tsx` (drifting hearts/sparkles) and `InvitationCardDemo.tsx`
(landing-page-only flip/open envelope decoration, `/Clone-UI`) — trivial,
self-contained, pure decoration. Neither is wired to real data if ported; the
invitation-card *feature* (`InvitationCustomizer.tsx`) is a separate, unscoped
concept (see [TODO.md](../../TODO.md) Phase 7) and shouldn't be confused with this
decorative widget.

## UI

The landing page uses `packages/ui`'s `Button` + `lucide-react` icons only so far. If
the rest of this doc gets built: shadcn `Dialog`/`NavigationMenu`/`Card` for
nav/modals, `react-hook-form` + `zod` for every form, Framer Motion for hero/
testimonial polish. **i18n**: no `next-intl` here or anywhere — the project already
decided against routing-based i18n (see
[overview.md](../../overview.md#i18n)); if the marketing pages need `en`/`kh` later,
reuse `packages/templates`' `LanguageProvider` pattern rather than introducing a
different library for one app.
