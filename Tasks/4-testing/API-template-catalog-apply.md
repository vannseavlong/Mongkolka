# API-template-catalog-apply

- **ID:** T-0025
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · fields another app depends on, schema change on admin sheet, slug rules (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (API-template-catalog-apply), 2026-10-28
- **Worktree:** `Mongkolka/template-catalog-apply/` · **Branch:** `feat/template-catalog-apply` 
- **Started / updated:** 2026-10-28 / 2026-10-28
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/template.md, Docs/backend-schema.md
- **Depends on:** none
- **Touches:** apps/api/src/modules/site-templates, modules/couple-website (selectTemplate), utils/slug.ts, modules/public-site routes, seeds/site-templates.ts, Docs/backend-schema.md

## Goal
Give templates a public identity and a real apply action: `site_templates.slug` + `description`, public by-slug lookup, reserved template slugs (couple slug validation rejects them, existing couple slugs checked), and apply `mode` (`keep_content` | `reset_all`) on `POST /couple/api/website/template`.

## Gates
- [x] G1 scope  - [x] G2 static (tsc+eslint on changed folders clean; pnpm lint has 1 pre-existing error in scripts/seed-mock-couple.ts)  - [x] G3 tests (16/16, mocked models)  - [ ] G4 run it (API never started; by-slug route checked over HTTP with stubbed model)
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Seeds updated: every existing template has a unique slug (e.g. `green-blue-sky`)
- [ ] `GET /public/api/site-templates/by-slug/:slug` returns template + component defaults, 404 for unknown or inactive
- [ ] `updateSlug` rejects reserved template slugs; test covers it
- [ ] `keep_content` clears component_id, color_override and theme_override but keeps content; `reset_all` clears content too; cache invalidated
- [ ] Response shape documented; Admin and Web tasks can start from it
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-28
Built in commit 3043264 on `feat/template-catalog-apply`, not merged.
Contract: public `GET /public/api/site-templates/by-slug/:slug`; admin create now REQUIRES `slug` (Admin app create form breaks until `Admin-template-slug-field` ships); couple `POST /couple/api/website/template` takes `mode` (default keep_content), returns `{settings, mode}`, client must refetch sections; both modes clear `theme_override`; unknown/inactive template now 404; reserved template slugs give 409 on couple slug change.
Run live after merge (not done): schema sync for admin `site_templates` (slug, description); set slugs on existing rows (gold-ink-cream, crimson-gold-silk, blush-gold-garden, white-black-mono) if seed skips existing rows.
Next: G5 and G6 by a fresh agent, then G9, G10, G11.

## Review 2026-10-28 (fresh agent, G5+G6)
No blockers. Sent back to the builder: junk-slug cache flooding (load all active templates once), partial-failure apply with early cache invalidation (allSettled, clear sections before profile write), reserved infrastructure slugs (www, api, admin...), explicit public response allowlist, status enum, revert formatting churn, missing tests.
Accepted/deferred: narrow cross-sheet race between a template slug and a couple claiming the same slug (documented); reset_all clears only content (documented); multi-instance cache staleness up to 60s.

## Fixes 2026-10-28 (commit 045b75d)
Review findings fixed: by-slug lookup reads all active templates once into a single-key 60s cache (no per-slug keys); apply clears sections with allSettled first and writes the profile only if all clears succeed, cache invalidated after everything settles; RESERVED_SLUGS enforced in updateSlug (409), template slug check (400) and placeholder generation; public response limited to template_id, name, slug, description, default_theme, default_components; status enum validation; formatting churn reverted; new tests. 27/27 tests, tsc and eslint (changed folders) clean, all with mocked models.
Docs now state the cross-sheet slug race is accepted and that reset_all clears only content.
Still open: re-review of the fix commit, live schema sync and slug backfill, real Sheets null/unique behavior, G9, G10, G11.

## Merged to main 2026-10-28
Merged locally with --no-ff after review and fixes; combined typecheck, API tests (49/49) and production builds of couple, web and admin pass. Moved to 4-testing, not 5-done, because open items remain: G3 tests (couple-app tasks have no runner; merged without them at the owner's request), live runs against the real API and sheets, G9/G10 for T3 tasks, schema sync and slug backfill (see CHANGELOG Needs).
