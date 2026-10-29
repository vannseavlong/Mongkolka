# Grace Blush & Gold: how to see the template (owner steps)

Template id `grace_blush`, public slug `pink-gold-white`. Everything is seeded **inactive**, so nothing is visible to guests until you flip it (step f).

## a. Prerequisites
1. `API-template-default-sections` is deployed (adds the `default_sections` column and the new section enums).
2. From `apps/api`, run `npx lsdb sync` (it syncs every actor in lsdb.config, no actor flag; adds the new enums and the `default_sections` column). Existing couple sheets need `npx lsdb sync --all-users`; preview it first with `--dry-run`.

## b. Seed (from `apps/api`, on a COPY of the dev sheet)
The seeders silently drop columns that are not in the schema, so sync first.
```
npx lsdb seed seeds/section-components.ts --upsert
npx lsdb seed seeds/site-templates.ts --upsert
```
Use `--upsert`: a `--skip-existing` re-seed never writes `default_sections` to an existing row.

## c. Activate for review (admin app, dev sheet copy only)
Toggle `grace_blush` and the nine section components to **active**: `opening_grace`, `hero_grace`, `verse_grace`, `story_grace`, `gallery_grace`, `details_grace`, `rsvp_grace`, `guestbook_grace`, `footer_grace`.

## d. URLs
- `/templates` (catalog) and `/templates/<template_id>` (framed preview).
- `/templates/preview/pink-gold-white` (full page). Add `?to=Name` for the opening greeting and `?lang=kh` for Khmer. Preview uses sample couple data, a sample guest wall and a no-op RSVP/guestbook (nothing is sent). Tap "Open the invitation" to enter.
- As a couple: in the builder pick the template, upload a cover photo and gallery images, fill the story/verse/footer, publish, then open `<slug>.<root>/?to=Name`.
- Footer credit link: set `ROOT_DOMAIN` on apps/web (the same env proxy.ts uses). Unset = plain text "Made with Mongkolka", no link.

## e. What to check, and what is unverified
Check: opening gate (arch doors, "Dear <Name>") then hero, verse, story, gallery (tap a photo for the lightbox), details, guestbook (photo + wish, "pending" message, the wall), RSVP (prefilled name, accept, guests), footer; English and Khmer; phone, tablet, desktop.
Known unverified: real API data and real uploads (the QA used a local stub API); real-device Safari/iOS and Android; screen-reader pass; Khmer copy has had no native-speaker review.

## f. Launch (after you approve)
Edit the seeds, update the test, re-seed:
1. `apps/api/seeds/site-templates.ts`: in the `grace_blush` row change `status: "inactive"` to `status: "active"` (and remove the "stays inactive" comment).
2. `apps/api/seeds/section-components.ts`: in the nine `*_grace` rows (`opening_grace` ... `footer_grace`) change `status: "inactive"` to `status: "active"`.
3. `apps/api/tests/grace-template-seed.test.ts`: change both template assertions (`assert.equal(grace.status, "inactive")`, two places) and the loop (`assert.equal(r.status, "inactive", ...)`) to `"active"`, and rename the tests.
4. Run `pnpm test` in apps/api, then `npx lsdb seed seeds/section-components.ts --upsert` and `npx lsdb seed seeds/site-templates.ts --upsert` against production.
