# Web-profile-enhance

- **ID:** T-0079
- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · edits a screen with new image controls, reuses shared AssetPicker, no API change (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-profile-enhance/` · **Branch:** `feat/profile-enhance`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** none
- **Touches:** apps/couple/src/features/profile/ (index.tsx split into components/, new components/photo-field.tsx, lib/profile-form.ts), reads features/website/components/asset-picker*.tsx

## Goal
Profile has real photo upload for cover and venue (pick or upload via the image library, remove, preview) instead of URL text boxes, and a cleaner layout. Prepares a slot for the help card (Web-couple-assist-request).

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [x] Cover photo and venue photo use `AssetPicker` (single); picked URL sets the form value, saved by "Save changes"; Remove clears it
- [x] Previews: cover 3:4 arch (as today), venue 4:3; empty state with "Add photo"
- [x] URL text inputs removed; existing saved URLs still display
- [x] Layout: sectioned cards, sticky section nav on desktop, one column at 360px; `index.tsx` split so no file is over about 200 lines
- [x] Form schema and mapping moved to `lib/`; test for the mapping
- [x] Loading skeleton instead of `return null`; save error shown
- [x] Not touched: the builder's instant-save helper `saveProfileImage` (different flow)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `couple-profile-enhance/` (branch `feat/profile-enhance`), uncommitted. All files are new or inside `apps/couple/src/features/profile/` (G1 scope ok; `index.tsx` went from 340 to 88 lines).
- G2: `tsc --noEmit`, `eslint src/features/profile`, `next build` pass.
- G3: 43/43 couple tests pass, 5 new (`lib/profile-form.test.ts`).
- Decision: the https-only rule was dropped for `venue_image_url` in the form (a library photo is an own-file URL, `http://localhost` in dev); the API still validates it. `map_url` keeps https.
- Not done: G4 (not run in a browser: no `.env` or login for the real sheet in this worktree), narrow-width check at 360px, G5 code review, G7 (no docs affected). The help-card slot for Web-couple-assist-request is simply a new component placed in `index.tsx` after `StorySection` or in the nav column; no placeholder was added.
- Pre-existing, untouched: the member invite input sits inside the profile `<form>`, so Enter there submits the profile form.
- Tier re-check on real diff: still T2.

## Code review (G5, fresh agent, 2026-11-27) and fixes
Fixed: members section moved outside the profile `<form>` (its invite and remove buttons submitted the profile); photo field has one keyboard path, a broken-image fallback and a screen reader label; 403 state on the page; removed photos sent as `""` through `toPayload` (tested); `PROFILE_KEY` moved to `data/profile-api.ts`; photo fields wrapped in `FormItem`/`FormMessage`; wrong comment on server validation corrected; weak tests replaced. `tsc`, eslint, `next build` and 44/44 couple tests pass.
Left on purpose: `AssetPicker` is still imported from `features/website` (user decision).
Follow-up outside this task: the API stores `cover_photo_url` without validating it (only `venue_image_url` is checked by `ownPathOrHttpsUrl`). Needs a change in `apps/api/src/modules/couple-profile/couple-profile.service.ts`.
G5 re-run after the fixes, G4 (browser) and the 360px check: not done.

## Shipped (2026-11-27)
Merged to `main` (`44da57c`), pushed, deployed to https://couple-mongkolka.web.app (`pnpm deploy:couple`). Live bundle checked for the new photo field text; the page itself was not opened with a login.
Skipped on the owner's request to ship: G4 (no browser run), the 360px check, and a second G5 pass after the review fixes. G2 (tsc, eslint, build) and G3 (44 tests) passed before the merge.
