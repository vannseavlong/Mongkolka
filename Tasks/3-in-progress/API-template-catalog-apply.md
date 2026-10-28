# API-template-catalog-apply

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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
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
