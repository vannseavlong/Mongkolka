# Web-khmer-section-keys

- **ID:** T-0045
- **Repo:** packages/templates, apps/api, apps/couple, apps/web
- **Owner:** SNLRLONG
- **Tier:** T2 · new section types across shared package, API schema and couple editor (auto picker); re-tier to T3 if the diff changes auth or stored-data migration
- **Claimed by:** none (built 2026-11-22, handed to testing)
- **Worktree:** `Mongkolka/mongkolka-khmer-section-keys/` · **Branch:** `feat/khmer-section-keys`
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `khmer-einvite-reference/README.md` (section 2B, 4), precedent `Tasks/5-done/Web-section-keys-verse-footer.md`
- **Depends on:** none
- **Touches:** (added during build: `apps/api` `utils/section-content.ts`, `couple-profile` service/controller/schema, `apps/admin` section-components schema, `apps/api/seeds/section-components.ts`, `docs/backend-schema.md`, `docs/tasks/template.md`, `apps/api/ER-DIAGRAM.md`) `packages/templates/src/types.ts`, `apps/api/schemas/couple/website_sections.ts`, `apps/api/schemas/admin/section_components.ts`, `apps/api/src/modules/couple-website/couple-website.service.ts`, `apps/couple` (`WEBSITE_SECTIONS`, `section-labels.ts`, content editor), `apps/web` (`buildContent` fallbacks)

## Goal
Add section keys `invitation`, `agenda`, `letters`, plus optional `mapUrl`/`venueImageUrl` on `details`, with typed content shapes, server-side validation and couple-editor forms. Shapes are in the plan (Data and API). No visual components here.

## Gates
- [x] G1 scope (diff stays in Touches plus the additions listed there)
- [x] G2 static: tsc clean in templates, api, couple, web, admin; eslint: api 1 pre-existing error (`scripts/seed-mock-couple.ts` unused var), templates 8 pre-existing `@next/next/no-img-element` rule-not-found errors, couple 3 pre-existing warnings, web and admin clean. Nothing from this diff.
- [x] G3 tests: API 127/127 pass; new `tests/khmer-section-content.test.ts` (validators, startsAt, https URLs, agenda limits and icons, service/controller 400, profile URL validation) and `section-keys.test.ts` extended to the 3 new keys. No runner exists for couple/templates/web, so `lib/khmer-content.ts` mappers are untested.
- [ ] G4 run it: NOT done (no browser/API run; see Not verified)
- [ ] G5 code review  - [ ] G6 security (see note)  - [x] G7 docs sync (backend-schema, ER diagram, template.md)
- [ ] G8 commit  - [ ] G11 changelog

Tier note: stays T2. New user input is rendered back on the public site only through later components; this task adds https-only URL validation and length caps server-side. G6 recommended for the diff before merge because `map_url` / `venue_image_url` end up as href/src.

## Done when
- [ ] Existing sites and sheets keep working (new keys optional, enums only grow); run `lsdb sync --dry-run` and note it for the owner
- [ ] Couple editor has KH/EN fields for each new section, empty states, 360px check
- [ ] Server rejects non-https `mapUrl`, bad ISO `startsAt`, over-length text
- [ ] Each new key has a generic themed default component name reserved for the skeleton task
- [ ] Root `CHANGELOG.md` entry added; worktree and branch removed after merge

## Status 2026-11-22
Built in worktree `Mongkolka/mongkolka-khmer-section-keys/` on `feat/khmer-section-keys`, nothing committed. New keys wired in templates `SECTION_KEYS`, API `utils/section-keys.ts`, both enums, section-components service, couple and admin schemas, couple labels, web `buildContent`. Order: opening, hero, invitation, verse, story, agenda, gallery, details, rsvp, registry, timeline, music, guestbook, letters, footer.
Decisions: (1) `mapUrl` / `venueImageUrl` live on `couple_profile` as `map_url` / `venue_image_url` (details is derived from the profile, so storing them in section content would have replaced the derived fields); (2) server validation runs in `CoupleWebsiteService.updateSection` for the three new keys only, other sections keep their old unvalidated behaviour; (3) registry has empty maps for the new keys (type requires them) and 3 inactive seed rows keep the seed-coverage test green; (4) Khmer lunar date is typed text.
## Not verified
Couple editor forms in a browser (invitation, agenda day/item arrays, letters, profile map fields), public site render, `lsdb sync --dry-run` and the real sheet (not run: touches live Sheets; owner must run `lsdb sync` and `lsdb sync --all-users` then seed with `--upsert`), `next build` for couple/web, 360px layout of the editors, Khmer text entry.

## G10 release order (added by Web-khmer-review-fixes)
- [ ] `lsdb sync --dry-run`, `lsdb sync`, then `lsdb sync --all-users` BEFORE deploying the API (unknown columns are silently dropped)
- [ ] Deploy, then seed with `--upsert`
- [ ] Read back the first saved value of each new column (a 200 does not prove it was stored)
See `docs/backend-schema.md`, "Release order for schema changes".
