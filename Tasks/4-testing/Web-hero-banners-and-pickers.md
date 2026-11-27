# Web-hero-banners-and-pickers

- **ID:** T-0070
- **Repo:** apps/couple, apps/api, packages/templates, packages/ui
- **Owner:** SNLRLONG
- **Tier:** T2 · shared UI package and renderer, API content validation, new seed rows (auto picker)
- **Claimed by:** Claude session, 2026-11-25 (main checkout, as agreed)
- **Docs:** `Tasks/_plans/Web-hero-redesign.md`
- **Touches:** `packages/ui` (calendar, date-picker, date-time-picker), `packages/templates` (hero-photo, use-orientation, site-renderer, hero/Cinematic|Editorial|Framed, registry), `apps/api` (section-content hero validation, seeds), `apps/couple` (hero-banner-assets, forms using date and select)

## Gates
- [x] G1 scope  - [x] G2 static (tsc in ui, templates, api, couple; couple eslint clean)  - [x] G3 tests (api 162, templates 296, couple 14)  - [~] G4 run it (new heroes previewed in the preview frame at phone and desktop size; builder banners and pickers not exercised against live data)
- [ ] G5 code review  - [ ] G6 n/a  - [x] G7 docs (plan)  - [ ] G8 commit  - [ ] G11 changelog

## Not verified
Uploading a banner end to end, the date picker inside dialogs (focus handling with the nested dropdown), the new heroes inside the real builder (needs `lsdb seed --upsert`), Khmer rendering of the new heroes beyond one screenshot.
