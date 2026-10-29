# Web-section-keys-verse-footer

- **ID:** T-0024
- **Repo:** packages/templates, apps/api, apps/couple, apps/web
- **Owner:** SNLRLONG
- **Tier:** T2 · spans 4 places, shared package and API enums (auto picker) (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-section-keys-verse-footer), 2026-10-29
- **Worktree:** `Mongkolka/section-keys-verse-footer/` · **Branch:** `feat/section-keys-verse-footer`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, docs/tasks/template.md, docs/backend-schema.md
- **Depends on:** none
- **Touches:** packages/templates/src/{types,registry,index}.ts + sections/verse + sections/footer (new), apps/api/schemas/{couple/website_sections,admin/section_components}.ts, apps/api/src/modules/couple-website/couple-website.service.ts (SECTION_KEYS only), apps/api/seeds/section-components.ts, apps/couple/src/features/website (data/schema.ts, workspace/section-labels.ts, section-content-dialog.tsx, lib/build-content.ts), apps/web/src/app/[slug] (buildContent), docs/backend-schema.md, docs/tasks/template.md

## Goal
Add two new section types, `verse` and `footer`, end to end, each with a generic themed default component (`verse_classic`, `footer_classic`) so any template can use them. Also add the missing `guestbook` key to the couple builder (zod enum, labels).

- `SECTION_KEYS` order for new couples: opening, hero, verse, story, gallery, details, rsvp, registry, timeline, music, guestbook, footer (existing couples' rows keep their order; missing keys are appended disabled by the existing mechanism).
- Content shapes: `VerseContent { text, reference, textKh? }`, `FooterContent { message?, hashtag? }` (footer names and date come from the couple).
- Couple content editor for both: the verse editor offers a short list of well-known wedding verse presets (English, public-domain translation, plus reference) and free text including optional Khmer text; the footer editor has message and hashtag.
- Verse with no text and footer render nothing / a minimal footer per "empty returns null" rule; neither may throw on missing content.
- The web `buildContent` supplies footer defaults from the couple.
- Update the API's two enums and the `SECTION_KEYS` mirror; seeds for the two section_components rows. Note in the task file that the admin sheet `section_components` and the couple `website_sections` enums change, so the release needs a schema sync.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates, api, couple, web; couple lint 0 errors; api lint 1 pre-existing error; next build couple and web pass)  - [x] G3 tests (API 54/54 incl. 5 new key-list tests; none for couple/templates/web: no runner)  - [~] G4 run it (couple against a stub API: rail, verse preset, footer; public web render and kh path not checked)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Both keys appear in the builder rail with friendly labels; guestbook appears too
- [ ] Verse and footer render in the builder canvas and the public site for an existing template
- [ ] Content editors save and the canvas updates
- [ ] Empty content renders nothing and does not throw
- [ ] API accepts the new keys; tests for key lists in the API and templates
- [ ] Docs updated; release note says schema sync is required
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit 1763831 on `feat/section-keys-verse-footer`, not merged. New SECTION_KEYS order: opening, hero, verse, story, gallery, details, rsvp, registry, timeline, music, guestbook, footer (existing couples keep display_order; missing keys appended disabled, so verse and footer land at the end for them). `verse_classic` (null without text; textKh when language is kh) and `footer_classic` (names, date, message, hashtag). Couple: schema/labels now include verse, guestbook, footer; verse editor with six KJV presets (text checked against bible-api.com translation=kjv, line breaks collapsed) and free text incl. Khmer; footer editor. API enums, SECTION_KEYS mirror and two section_components seed rows (seed not run).
RELEASE NOTE: schema sync required for the couple `website_sections.section_key` enum and the admin `section_components.section` enum; the two new section_components rows must be seeded. Written in docs/tasks/template.md.
Not verified: public site render, kh path of the new components, Khmer field in a browser, live API/sheets. Tests deferred for couple/templates/web.
Process note: the builder briefly navigated another agent's shared browser tab (3058) to its own URL; no repo effect.
Next: G5 review, G7, G8, G11.

## Review 2026-10-29 (fresh agent, G5; tsc clean in 5 packages, API tests 54/54; ran the public site against a stub)
No blockers; not ready for testing until the should-fix items are done. Verified: all key lists the author touched are consistent (templates, API mirror, both enums, couple list and labels, content-editable list, registry, seeds, docs); public site renders verse and footer end to end in English and `?lang=kh` (XSS escaped, null content safe, partial footer fine); four verses checked against bible-api.com KJV match (Genesis 2:24 and Colossians 3:14 not checked); with onSchemaMismatch 'warn' writes with the new keys still succeed before sync (the app-level enum check uses the new schema; Sheets appends RAW), every request logs a mismatch warning until `lsdb sync`.
Sent back: 1 missed key lists (API section-components SECTIONS, admin section-components WEBSITE_SECTIONS: admin cannot create a verse or footer variant or set it as a template default; test does not cover these); 2 SAMPLE_CONTENT has no verse or footer (blank tiles and previews); 3 verse preset leaves a stale textKh and the select cannot re-apply a preset; 4 long hashtag overflows at 320 px, no max lengths.
Nits sent back: accent small-text contrast (about 2.2:1 with a sample theme), verse semantics, footer date not localized in Khmer, docs note about ordering for existing couples. Skipped: "Partner One" fallback in the footer (same as existing hero behavior).
Scope note: the fix touches apps/admin and apps/api/src/modules/section-components, which were not in the original Touches.

## Fixes 2026-10-29 (commit 780aca7)
Review items 1-4 and nits fixed: verse, footer and guestbook added to the API section-components `SECTIONS` and the admin `WEBSITE_SECTIONS` (repo-wide grep found no other lists); section-keys test now also covers couple WEBSITE_SECTIONS, SECTION_LABELS, admin list and API SECTIONS; SAMPLE_CONTENT has a Genesis 2:24 KJV verse and a footer message and hashtag; preset clears textKh and the select resets; zod max lengths (hashtag 60, footer message 300, verse text 600, reference 60, textKh 600) and break-words; verse is figure/blockquote/figcaption with cite; text color for small text (accent only on a decorative rule); `formatWeddingDate(iso, language?)` with a built-in Khmer formatter (Chrome here has no km locale data); docs line about existing couples.
Results: tsc clean (templates, api, couple, web, admin); API tests 55/55; lint couple 0 errors, admin clean, api 1 pre-existing error; next build couple, web, admin pass (admin not rebuilt after the last Khmer date edit; it does not use the changed files). Browser: sample verse and footer in the web preview in kh, Khmer date "១២ ធ្នូ ២០២៦", no overflow at 320 px with a 130-character hashtag, preset clears Khmer text and can be re-applied.
Not verified: builder variant-browser tiles with the new sample content, contrast ratio measured (follows from the theme text color). Release: schema sync for both enums and seeding the two section_components rows.

## Merged to main 2026-10-29
Merged locally with --no-ff after review and fixes; combined typecheck (api, couple, web, admin, templates), API tests (55/55) and production builds of couple, web and admin pass. Moved to 4-testing, not 5-done: no tests for couple/templates/web (no runner), no fresh re-review of the fix commits, live schema sync and seeding not done (see CHANGELOG Needs).
