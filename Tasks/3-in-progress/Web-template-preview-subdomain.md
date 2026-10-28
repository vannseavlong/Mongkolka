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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
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
