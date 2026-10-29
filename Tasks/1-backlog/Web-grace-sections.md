# Web-grace-sections (wave 3 and 4 of the Grace template)

- **Repo:** packages/templates (+ apps/api seeds, apps/web for QA)
- **Owner:** SNLRLONG
- **Tier:** T2 per slice · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md
- **Depends on:** Web-grace-skeleton (registry, strings and seeds already wired), Web-grace-primitives
- **Touches:** only `packages/templates/src/sections/grace/<slice files>` and `.../grace/strings/<slice>.ts`; no edits to registry.ts, i18n.tsx or seeds

Split into five parallel slices, each its own task and branch when promoted to `2-todo/`. Each replaces its stub with the real component, English and Khmer strings, empty/loading/error states, reduced-motion support, and works at 320px to 1200px in the builder canvas and on the public site.

## Slices
1. **`Web-grace-opening`** - `opening_grace`. Arched gold-line window on a pink gradient, cross at the top of the arch, "Dear {name}" in script type from `guestGreeting` (the `?name=`/`?to=` param), "You are invited" when there is no name, falling petals, tap to open (arch doors part), `onOpen` after the animation; keyboard operable; names and date from `couple`.
2. **`Web-grace-hero-story`** - `hero_grace` (couple photo in the gold arch frame, script names, date, small cross, scroll cue, monogram fallback when `coverPhotoUrl` is empty) and `story_grace` (love story in a soft white card with gold divider).
3. **`Web-grace-gallery-details`** - `gallery_grace` (gold-framed arch tiles on pink, tap to enlarge with keyboard close, empty returns null) and `details_grace` (ceremony and reception cards, dress code, map link where an address exists).
4. **`Web-grace-rsvp-guestbook`** - `rsvp_grace` (name prefilled from the greeting, attend yes/no, guest count, message, submitted and error states) and `guestbook_grace` (the guest photo and wish wall: same props, same `GuestbookData`/`onSubmit` contract as `guestbook_wall`; extract the shared logic of `ink/Guestbook.tsx` into a helper without changing the ink version's behavior; pending/approved result states; approved photos displayed). **Re-tier up to T3 if the diff touches `apps/api` guest-photos or storage.**
5. **`Web-grace-verse-footer`** - `verse_grace` (verse text, reference, optional Khmer text, cross ornament) and `footer_grace` (names, date, cross, thank-you message, hashtag, small Mongkolka credit link).

## Wave 4: `Web-grace-qa-launch` (after all slices and `API-template-default-sections`)
- Sample content for verse and footer in the shared `SAMPLE_CONTENT`; check `pink-gold-white.<root>` and `/templates` preview.
- Walk every section at phone, tablet and desktop, English and Khmer; contrast check on the final palette; keyboard pass on opening, gallery lightbox, RSVP and guestbook.
- Run through the real flow: pick the template in the builder, upload assets, publish, open `?to=Name`, guest uploads a photo, couple approves it.
- Flip the template row to `active` in the seed; owner runs the live seed (`lsdb seed seeds/site-templates.ts --upsert` and section-components) after copying the sheet.
- Owner reviews the template (the client-facing acceptance).

## Done when
- [ ] All nine Grace components built, no stubs left
- [ ] Owner has reviewed the template and signed off
- [ ] Template row active and seeded
- [ ] Root `CHANGELOG.md` entries added
