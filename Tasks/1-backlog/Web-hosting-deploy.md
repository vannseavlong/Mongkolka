# Web-hosting-deploy

- **ID:** T-0038
- **Repo:** apps/web
- **Owner:** SNLRLONG
- **Tier:** T3 · release/deploy and hosting config, DNS (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/web-hosting-deploy/` · **Branch:** `feat/web-hosting-deploy` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-11-02
- **Docs:** Tasks/6-deploy/Admin-firebase-hosting.md, Tasks/1-backlog/Web-custom-domain-routing.md
- **Depends on:** owner decision on hosting (below); API live
- **Touches:** firebase.json / hosting config, apps/web/next.config.ts, apps/web/src/proxy.ts

## Goal
Get the public site (landing, marketplace, templates, and couple sites at `/[slug]`) live. `mongkolka.web.app` currently returns 404 (nothing deployed).

## Why it is blocked
The web app needs a server: `/[slug]` renders per request with `cache: no-store`, `proxy.ts` rewrites wildcard subdomains, and `marketplace/[vendorId]` and `templates/[templateId]` are dynamic. It cannot be a static export on free Spark.

## Decision needed (owner)
- Firebase App Hosting on Blaze: official route, needs a billing card, about $0 at pilot volume, keeps `mongkolka.web.app`
- Vercel free tier: stays free, supports SSR, URL is not `.web.app`
- Static landing page only first: couple sites would not work yet

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Hosting chosen and written here
- [ ] `apps/web/.env.production` has the API URL (done locally); `ROOT_DOMAIN` decided (wildcard subdomains need a real domain, not `.web.app`)
- [ ] Web deployed; `/`, `/templates`, `/marketplace` and a couple `/[slug]` page load against the live API
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
