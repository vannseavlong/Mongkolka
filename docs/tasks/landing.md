# Landing / Marketing (`apps/web`) — mostly built

Read [overview.md](../../overview.md) first — this doc covers `apps/web`'s
marketing/public surfaces (landing, about, contact, marketplace browse, template
preview, registration entry, nav/footer). The public per-couple wedding site renderer
is a separate,
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

The landing page also links to two new teaser sections built alongside the
marketplace/template work below: "Explore vendors" → `/marketplace` and "Browse
templates" → `/templates`.

## What's built: header/nav, marketplace, template preview, About/Contact

A shared `SiteHeader`/`SiteFooter` (`apps/web/src/components/`) with real routes —
Marketplace, Templates, About, Contact — plus the existing "For vendors"/"Start
planning" CTAs and a mobile `Sheet` menu. No session-derived `userType`: `apps/web`
has no auth session at all (no JWT, no login) to derive one from, so this is a plain
static nav, not the session-aware version originally sketched below.

**Marketplace** (`/marketplace`, `/marketplace/[vendorId]`) — a real, paginated,
server-rendered vendor list backed by new public `apps/api` endpoints
(`apps/api/src/modules/public-marketplace/`), not a client-side filter over a
hardcoded array. Category pills and search are client-side controls
(`vendor-filters.tsx`) that push URL query params (`?category=&search=&page=`), read
server-side on each render. Categories come from the shared `vendor_categories`
table (one source, per the original design goal). The vendor detail page composes
the vendor's catalog row + `vendor_profile` (bio) + `portfolio_items` + `services` —
reusing the existing `VendorProfileService`/`VendorPortfolioService`/
`VendorServicesService` rather than duplicating model queries. Only `status: 'active'`
vendors are ever exposed publicly (404 otherwise, same pattern as the public site
resolver's `findPublishedCoupleBySlug`).

**Template preview** (`/templates`, `/templates/[templateId]`) — a gallery of active
`site_templates` (theme swatches), and a **live** render for each one: the real
`packages/templates` `SiteRenderer` fed a fixed sample couple ("Alex & Sam") and
hand-written sample content per section (`apps/web/src/app/templates/[templateId]/
template-preview.tsx`), mirroring `apps/couple`'s `WebsitePreview` pattern exactly so
it's the same renderer a real couple's site uses — not a static screenshot. This
wasn't in the original checklist below; added since it surfaces the same public
`site_templates` catalog the marketplace work already needed a public read path for.

**About / Contact** — both static content pages. Contact is intentionally **not**
wired to a submission backend — the message-destination design (table vs. email
forwarding) is still unresolved (Phase 7 in [TODO.md](../../TODO.md)); building that
silently here would have meant guessing a design that hasn't been made yet.

**Not carried over from Clone-UI**: `FloatingElements` and `InvitationCardDemo`
(pink/motion decorative widgets) — skipped as decorative-only and not needed for the
"clean version" restyle; see "Decorative-only, low priority" below, still accurate.

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
