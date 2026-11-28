# Map section: reception place line instead of the venue card

- **Repo:** Mongkolka (web, couple, templates)
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package, user-typed link rendered as href (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-map-place/` · **Branch:** `feat/map-place`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Depends on:** none
- **Touches:** `packages/templates/src/sections/covenant/{Map.tsx,text-logic.ts,strings.ts,covenant-more.test.ts}`, `packages/templates/src/types.ts`, `apps/couple/src/features/website/components/map-content-form.tsx`

## Goal
Guests are invited to the reception, so the map section names it. A centred pin, place name and directions link replace the venue card, and the couple can set name and link in the Map form.

## Decisions
- Name: map `placeName`, else reception venue, else ceremony venue. Link: map `mapUrl` (https only), else profile `map_url`.
- Date, time and address no longer show in the map section.
- No API change: both fields live in map section content, which the server does not validate (same as the other map fields). The https rule is enforced at render.

## Gates
- [x] G1 scope
- [x] G2 static: typecheck clean for templates and couple; web build passed; templates lint has the same 36 errors as `main`
- [x] G3 tests: templates 386/386, couple 88/88
- [ ] G4 run it: section rendered at 360px with built CSS. Not checked: couple form in a browser, builder preview, live data, Postcard variant, iPhone
- [ ] G5 code review: not run
- [ ] G6 security: not run
- [x] G7 docs sync: no contract docs affected
- [x] G8 commit message  - [ ] G9 human review (optional)  - [x] G11 changelog

## Done when
- [ ] Owner approves the layout and the Khmer link wording
- [x] Web and couple deployed
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Merged and deployed (2026-11-28)
Merged to `main`, not pushed. On the merged code: templates 386/386, couple 88/88, web and couple builds pass. Both deployed. Live `/vutha-nita` shows the pin, place name and directions link at desktop width.
Why still in `4-testing`: code and security review not run; Map form not used signed in; live page not checked on a phone.
