# Web-covenant-template

- **ID:** T-0073
- **Repo:** packages/templates, apps/web, apps/couple, apps/api (section key + seed)
- **Owner:** SNLRLONG
- **Tier:** T2 · new template skin, new section key `video` (api enum, couple editor), new web sub-routes, new seed rows; no auth/payment. Security: user-entered YouTube URL is parsed to an id and embedded via youtube-nocookie only (checked in G6).
- **Claimed by:** Claude session, 2026-11-24
- **Worktree:** `Mongkolka/mongkolka-covenant-template/` · **Branch:** `feat/covenant-template`
- **Started / updated:** 2026-11-24 / 2026-11-24
- **Docs:** this file
- **Depends on:** none
- **Touches:** packages/templates/src/sections/covenant (new), sections/skins.ts, skin-strings.ts, khmer/skin-ornaments.ts, registry.ts, types.ts, sample-content.ts; apps/web `[slug]` sub-routes; apps/couple video form; apps/api section keys + seeds

## Goal
A Christian wedding template in gold, white and pink ("Covenant"): animated Khmer blessing, names and "Dear <guest> and wife" intro, cross reveal into a full-screen hero, Bible verse, story, gallery, YouTube video, events (couple-portal CRUD via agenda), countdown, latest guest photos with "see all", RSVP with a wish, KHQR, map, footer. Guest photos and wishes get their own sub-routes.

## Section mapping (no new keys beyond `video`)
opening, hero, verse, invitation (names + countdown), story, gallery, video (NEW), agenda (events, CRUD in couple portal), details (venue + map), guestbook (latest photos + wishes, see all), rsvp, registry (KHQR), footer.

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates, web, couple, api; eslint has the existing missing `@next/next` plugin error)  - [x] G3 tests (templates 265 pass, api 152 pass; new: covenant.test.ts, video content tests)  - [x] G4 run it (390px, English, sample data via a temporary harness, since removed)
- [ ] G5 code review  - [ ] G6 security (user URL rendered as embed, public sub-routes)  - [ ] G7 docs sync
- [ ] G8 commit  - [ ] G11 changelog

## Done when
- [ ] Template previews at /templates/preview/<slug>, English and Khmer, 360px and desktop
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Not verified / open
- Khmer rendering and tablet/desktop pass; real device Safari/iOS; native-speaker review of the Khmer strings.
- `/<slug>/wishes` and `/<slug>/photos` only built and type-checked, not run against the real API or Firebase rewrites; path-based sites only (not custom domains).
- Map is the existing "view location" button (no embedded map). Hero uses one photo cropped to the screen (no separate landscape/portrait upload).
- Guest line adds "និងភរិយា" / "and spouse" to a single name; a name with "&", "and", "និង" or a comma is shown as given.
- Seeded INACTIVE (`covenant_gold`); `video_skin` row is active. Release order: deploy API, `lsdb sync`, `lsdb seed --upsert`.
- Nothing committed.
