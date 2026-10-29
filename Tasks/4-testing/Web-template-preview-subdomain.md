# Web-template-preview-subdomain

- **ID:** T-0032
- **Repo:** apps/web
- **Owner:** SNLRLONG
- **Tier:** T2 · new route and proxy behavior (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-template-preview-subdomain), 2026-10-28
- **Worktree:** `Mongkolka/template-preview-subdomain/` · **Branch:** `feat/template-preview-subdomain`
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** API-template-catalog-apply
- **Touches:** apps/web/src/proxy.ts, app/templates (preview route, gallery cards), shared sample content

## Goal
Serve each template at `<template-slug>.<ROOT_DOMAIN>` as a full live site with sample data. Proxy resolves reserved template slugs before the couple-slug rewrite; unknown subdomains still fall through to the couple route. Templates gallery links to the subdomain preview and shows name + palette.

## Gates
- [x] G1 scope  - [x] G2 static (tsc, eslint, next build pass)  - [ ] G3 tests  - [~] G4 run it (curl with Host headers against a stub API; no browser, Khmer or visual check)
- [ ] G5 code review  - [ ] G6 security (if input/upload)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] `green-blue-sky.<ROOT_DOMAIN>` renders the template with sample couple data, in English and Khmer
- [ ] Couple slug subdomains behave exactly as before (test both)
- [ ] Proxy lookup is cached and cannot take the site down if the API is slow
- [ ] Preview pages are `noindex`, never show real couple data
- [ ] `/templates/[id]` still works as path fallback in dev (no wildcard DNS)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit dbd921c on `feat/template-preview-subdomain` (based on feat/builder-workspace), not merged. proxy.ts is async: for `<slug>.<ROOT_DOMAIN>` it asks `GET /public/api/site-templates/by-slug/:slug` (1.5s timeout; hits cached 5 min, 404s 1 min, errors 10s; max 500 entries) and rewrites to `/templates/preview/<slug>`, else the unchanged couple rewrite. New noindex preview route; template-preview.tsx now uses the shared sample content; /templates cards link to the subdomain when ROOT_DOMAIN and slug are set.
Verified by curl against a stub: template host 200 with sample name and noindex, repeat requests hit the cache, couple host falls through, slow API times out after about 1.5s and falls through.
Not verified: Khmer and visual rendering, real API, wildcard DNS and TLS.
Known tradeoff: a couple site request while the API is slow costs up to 1.5s once per 10s per slug.
Next: G5 review, G3 decision, G7, G8, G11.

## Review 2026-10-28 (fresh agent, G5 + security read; code read only, nothing run)
No blockers. Sent back: S1 preview has no Khmer (no ?lang, no toggle) so the Khmer criterion is unmet; S2 proxy cache has no in-flight de-duplication and junk subdomains can evict real entries -> switch to one cached set of active template slugs from the public list with a shared in-flight promise. Nits: import API_URL, tighten SLUG_PATTERN and skip reserved labels, error.tsx for API-down, comment on ROOT_DOMAIN defaults.
Checked fine by reviewer: host injection (pattern runs before fetch URL and rewrite), no shadowing between template and couple slugs (API enforces both directions), noindex, no real couple data, public couple route untouched.
Deferred: robots.txt/favicon rewritten on template hosts (cosmetic), template_id `preview` shadowing (theoretical).

## Fixes 2026-10-28 (commit 6aae115)
Fixed: S1 preview reads `?lang=` and renders LanguageToggle (HTML checked for Khmer text; not seen rendered); S2 proxy now fetches the public template list once and caches the slug SET as a single entry (60 s, shared in-flight promise, previous set kept 10 s on error, 1.5 s timeout), so junk hosts add no cache entries; API_URL imported from @/lib/api; SLUG_PATTERN follows the API rule and skips a SHORT reserved list (www, api, admin, app, mail, couple, vendor, web, static, cdn; not the full API RESERVED_SLUGS, so the two lists can drift); friendly error.tsx for the preview; comment on ROOT_DOMAIN defaults.
Curl tests against a stub with Host headers: 20 concurrent cold requests -> 1 list call; template host 200 + noindex; ?lang=kh 200; couple host falls through; slow API served from the previous set; API down -> 500 in about 25 ms; 600 junk hosts -> zero list calls. tsc, eslint, next build pass.
Open observation: during the junk-host flood the Next server RSS grew 186 MB -> 360 -> 416 MB (second round grew less). Attributed to rendering a couple/not-found page per junk host, not measured against a pre-change baseline. Worth a look before production (rate limiting at the edge/CDN, or return 404 early for hosts that fail both lookups).
Not verified: error.tsx shown in a browser, toggle rendering, real API, wildcard DNS and TLS. Tests: none.
Next: G3 decision, G7, G8, G11; re-review optional.

## Merged to main 2026-10-28
Merged locally with --no-ff after review and fixes; combined typecheck, API tests (49/49) and production builds of couple, web and admin pass. Moved to 4-testing, not 5-done, because open items remain: G3 tests (couple-app tasks have no runner; merged without them at the owner's request), live runs against the real API and sheets, G9/G10 for T3 tasks, schema sync and slug backfill (see CHANGELOG Needs).
