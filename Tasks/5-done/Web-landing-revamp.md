# Web-landing-revamp

- **ID:** T-0075
- **Repo:** apps/web
- **Owner:** SNLRLONG
- **Tier:** T1 · UI-only change inside apps/web landing components and web globals.css; no shared package, API or dependency change (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude session, 2026-11-27
- **Worktree:** `Mongkolka/web-landing-revamp/` · **Branch:** `feat/web-landing-revamp`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** none
- **Depends on:** none
- **Touches:** apps/web/src/app/page.tsx, apps/web/src/app/globals.css, apps/web/src/components/landing/*, apps/web/src/components/site-header.tsx, site-footer.tsx

## Goal
1. Landing page looks richer (stock photos, more sections), not "too simple".
2. Brand theme tokens never go missing: the web app ships a wedding default palette plus derived tokens, so the page is coloured even when the active-theme API is empty or down.
3. Whole landing page responsive (about 360px up to desktop).

## Gates
- [x] G1 scope  - [x] G2 static (tsc + eslint clean)  - [x] G4 run it (desktop in Chrome; 360px via iframe: no horizontal overflow; tap targets, Khmer text and template/vendor cards with live API data not checked)  - [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [x] Hero, stats, how-it-works, features, templates, vendors, testimonials, final CTA, footer redesigned
- [x] Narrow-width (360px) check done
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
