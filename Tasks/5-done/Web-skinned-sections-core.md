# Web-skinned-sections-core

- **ID:** T-0057
- **Repo:** packages/templates, apps/api (seeds + tests), apps/web (preview sample content)
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package, edits seeds and the template preview (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude session, 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-skinned-sections-core/` · **Branch:** `feat/skinned-sections-core`
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** `Tasks/_plans/Web-khmer-einvite-templates.md`
- **Depends on:** the six skins (merged in `feat/khmer-einvite-integration`)
- **Touches:** `packages/templates/src/sections/skinned/` (new), `registry.ts`, `sections/khmer/Details.tsx`, `chrome/dock-*`, `sample-content.ts`, `apps/api/seeds/*`, `apps/api/tests/*seed*`, `apps/web/src/app/templates/template-preview.tsx`

## Goal
User direction: keep each template's look, style and design concept, not the reference page structure. The Khmer-specific sections (invitation, agenda, letters, KHQR registry) stay as optional sections, off by default. The default page uses the standard sections (opening, hero, story, gallery, details, RSVP, guestbook, footer), and `story_skin`, `details_skin`, `rsvp_skin` and `footer_skin` carry the active skin's design.

## What was built
- `sections/skinned/`: `StorySkin`, `DetailsSkin` (the shared location block with the standard "Event Details" heading), `RsvpSkin` (same behaviour as the product's RSVPs: name prefill, attend yes/no, guest count, note, sending/error/thank-you), `FooterSkin` (skin card, crest with monogram, names in the skin heading style, divider, date, message, hashtag, credit link).
- `skin-ui.tsx`: per-skin buttons, fields, choice pills, steppers and one original signature mark (lozenge, rose sprig, peony, blossom, hydrangea, star-heart). Kept in the skinned folder instead of each skin's `ornaments` file so no sibling skin file is touched.
- Pure logic with tests: `story-logic`, `rsvp-logic`, `footer-logic`.
- Chrome: a `story` dock target (icon + EN/KH label), so the dock can include it.
- Seeds: all six templates default to `story_skin`/`details_skin` (kids keeps `details_kids`)/`rsvp_skin`/`footer_skin`; `default_sections` = standard sections on, invitation/verse/agenda/registry/timeline/music/letters present and off; dock include list `story, details, gallery, rsvp, guestbook`. Four new INACTIVE `section_components` rows.
- Preview: `sampleContentFor(skin)` gives the kids template birthday wording for story, RSVP note and footer.
- `DetailsKhmer`: optional `headingKey`; sub-labels now plain accent text (the foil heading style left a pale box behind small labels on Sakura).

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates, api; eslint only the existing missing `@next/next` rule definition)  - [x] G3 tests (templates 191, api 147 pass; new: skinned.test.ts, seed tests)  - [x] G4 run it (see below)
- [ ] G5 code review  - [ ] G6 n/a (no auth/data/new endpoint; RSVP submit path unchanged)  - [x] G7 docs sync (none needed)
- [ ] G8 commit  - [ ] G11 changelog

## G4 result
Real `SiteRenderer`, English, chrome on, at a 390px-wide frame: story, details, RSVP and footer checked in all six templates; Kids also at 360px with no horizontal overflow. Found and fixed: Sakura footer was flat (its blossom art lives on the card surface, so the footer now sits on the skin card), and a pale box behind small Details labels.

## Not verified
- Khmer view of these four sections in a browser (render-tested in both languages only); the browser connection dropped.
- Reduced motion, iOS/Android Safari, tablet and desktop widths, anything under 345px.
- RSVP submit and error states in a browser (logic unit-tested; the preview submit is a no-op).
- Khmer wording: RSVP and footer reuse the existing `grace.*` strings; a native speaker should review.
- Dock labels still truncate ("Gall…", "Locat…") at 390px: chrome styling, not changed here.
- Kids invitation sample still reads as a wedding (invitation is off by default; only story, RSVP note and footer got kids sample text).

## Done when
- [ ] Root `CHANGELOG.md` entry added at merge to `main`
- [ ] Worktree and branch removed after merge
