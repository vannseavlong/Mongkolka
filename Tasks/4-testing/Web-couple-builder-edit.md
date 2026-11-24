# Web-couple-builder-edit

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · UI-only change to the couple builder, writes only existing profile fields through the existing profile PATCH; no auth, new endpoint or new package (auto picker)
- **Claimed by:** Claude session, 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-couple-builder-edit/` · **Branch:** `feat/couple-builder-edit`
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** none
- **Depends on:** none
- **Touches:** `apps/couple/src/features/website/{workspace,components,lib}`

## Goal
A couple who picks a template can find and use "Edit" for every section without leaving the builder: panel opens on Content, a visible Edit button on the rail and canvas, hero/story/details editable in a dialog (saved to the profile), and a venue photo picker on the details section.

## Gates
- [x] G1 scope  - [x] G2 static (tsc, eslint, couple build clean)  - [x] G3 tests (5 pass, pure field/tab logic)  - [ ] G4 run it: NOT done (no browser run; needs API + login)
- [ ] G5 code review  - Skipped G6: no auth, new endpoint or new data; same profile PATCH, https-only URL rules mirrored from the Profile page (server still validates)
- [ ] G7 docs sync  - [ ] G8 commit  - [ ] G11 changelog

## Done when
- [ ] Panel opens on Content (falls back to the first tab)
- [ ] Rail row and canvas header show Edit for every section that has an editor; hidden for those without
- [ ] Hero (names, date), Story and Details (times, venues, addresses, dress code, map link, venue photo) open an edit dialog and update the canvas on save
- [ ] Details has an Assets tab to pick or upload the venue photo; the canvas updates at once
- [ ] Loading, error and 360px checked or listed as not checked
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Notes
- Dependency: `tsx` (devDependency of `apps/couple`) for node's test runner on the pure logic, same version range as `packages/templates`; no runtime or bundle impact.
- Shared edit: `saveCover` extracted to `components/profile-image-save.ts` (cover and venue photo use it); `CONTENT_EDITABLE_SECTIONS` moved to `lib/section-editors.ts` and re-exported from the dialog.
- Not verified: 360px layout, keyboard flow of the new dialog, real upload to the venue photo.
