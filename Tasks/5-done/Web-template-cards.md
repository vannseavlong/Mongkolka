# Web-template-cards

- **Repo:** apps/web, packages/templates (sample data only)
- **Owner:** SNLRLONG
- **Tier:** T1 · UI plus sample-data change, no API, auth or dependency change (auto picker)
- **Claimed by:** Claude session, 2026-11-27
- **Worktree:** `Mongkolka/web-template-cards/` · **Branch:** `feat/web-template-cards`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Depends on:** none
- **Touches:** apps/web/src/components/site-header.tsx, nav-links.ts, nav-active.ts, apps/web/src/app/templates/page.tsx, template-thumb.tsx, landing/live-previews.tsx, packages/templates/src/sample-content.ts, apps/web/public/templates/covenant/

## Goal
1. Header shows which page is active.
2. Template cards show a real mini preview of the template, not just "Aa".
3. Covenant preview map is ours (sample venue), not a real venue's hand-drawn map.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G4 run it  - [x] G8 PR message  - [x] G11 changelog

## Done when
- [x] Active link styled and `aria-current` set, desktop and mobile menu
- [x] Cards on /templates and the landing page render the template's hero, lazily
- [x] Real-venue map files removed
- [x] Root `CHANGELOG.md` entry added
