# Web-khmer-skeleton

- **ID:** T-0047
- **Repo:** packages/templates, apps/api (schema, seeds, tests), apps/web (types), docs
- **Owner:** SNLRLONG
- **Tier:** T2 · registers new components in a shared package, new seed rows, one new nullable `site_templates.chrome` column (auto picker; no auth/data/payment signal)
- **Claimed by:** Claude session, 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-skeleton/` · **Branch:** `feat/khmer-skeleton` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`, `Tasks/1-backlog/Web-khmer-templates-waves.md` (section 2), `packages/templates/src/chrome/README.md`
- **Depends on:** Web-khmer-section-keys, Web-khmer-chrome (both merged into the integration branch)
- **Touches:** `packages/templates/src/{registry.ts,i18n.tsx}`, `packages/templates/src/sections/{khmer,emerald,garden,cream,sakura,fairytale,kids}/`, `sections/skins.ts`, `sections/skin-strings.ts`, `apps/api/schemas/admin/site_templates.ts`, `apps/api/seeds/{site-templates,section-components}.ts`, `apps/api/src/modules/site-templates/site-templates.service.ts`, `apps/web/src/app/{[slug],templates}/types.ts`, `docs/backend-schema.md`, `apps/api/ER-DIAGRAM.md`, API tests

## Goal
Register every new component id as a typed, themed, non-blank stub for the six Khmer templates, wire per-skin strings, add inactive seed rows (palette, default_sections, default_components, chrome), and add the `chrome` column so the renderer can receive it. Later skin tasks then edit only their own folder, strings file and seed block.

## Decisions
- Added `site_templates.chrome` (json, nullable), exposed by the public template endpoints and the public site payload; the chrome task had no way to get config from the DB. Seed-only, no admin form.
- Registered `details_khmer` as the details/location extension point; `registry_khqr` NOT registered (Web-khqr-gift owns it). Registry default for the gift section is `registry_cards`.
- Palette accents darkened only where < 4.5:1 on the bg: royal_garden #c9a96e to #8a6a2f, royal_cream #c9a04e to #886420, sakura #c2185b to #b01553. Emerald, fairytale and kids as studied.
- All templates and skin component rows seeded inactive; the QA/launch task flips them together.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates, api, web, couple, admin; eslint only the existing missing-`@next/next`-plugin error on `<img>` disable comments, same as ink/Guestbook)  - [x] G3 tests (templates 27, api 134 pass)  - [ ] G4 run it (SSR render test only; not seen in a browser)
- [ ] G5 code review  - Skipped G6: no auth, personal data or new endpoint (the by-slug allowlist gained `chrome`, covered by the test)  - [x] G7 docs sync
- [ ] G8 commit  - [ ] G11 changelog

## Done when
- [x] Every skin component id and shared Khmer section renders in en and kh without missing keys
- [x] Six inactive template rows validate (contrast, sections, registry)
- [ ] Owner runs `lsdb sync` (adds `chrome`) then seeds with `--upsert`
- [ ] Root `CHANGELOG.md` entry added; worktree and branch removed after merge

## Not verified
Browser rendering at 390px, Khmer wording (needs a native speaker), real `lsdb sync`/seed against the sheet.

## G10 release order (added by Web-khmer-review-fixes)
- [ ] `lsdb sync --dry-run`, `lsdb sync`, then `lsdb sync --all-users` BEFORE deploying the API (unknown columns are silently dropped)
- [ ] Deploy, then seed with `--upsert`
- [ ] Read back the first saved value of each new column (a 200 does not prove it was stored)
See `docs/backend-schema.md`, "Release order for schema changes".
