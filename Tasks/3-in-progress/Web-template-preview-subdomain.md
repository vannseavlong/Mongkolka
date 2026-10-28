# Web-template-preview-subdomain

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
