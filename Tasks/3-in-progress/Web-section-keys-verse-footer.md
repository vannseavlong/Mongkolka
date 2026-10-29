# Web-section-keys-verse-footer

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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
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
