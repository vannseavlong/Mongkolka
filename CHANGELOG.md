# Changelog

Merges to `main` across all projects, newest first. Tags: `[Web]`/`[API]`/`[Admin]`. Format and rules: `Tasks/README.md`.

## 2026-10-29 · [API] feat(api): template default sections (order and enabled flags)
- Owner: SNLRLONG
- Task: Tasks/4-testing/API-template-default-sections.md
- Branch/PR: feat/template-default-sections (merged to main with --no-ff, local, no PR)
- What changed: `site_templates.default_sections` (nullable JSON list of `{section_key, enabled}`): a couple's first template pick gets rows in the template's order with its enabled flags; "start fresh" (`reset_all`) also resets order and enabled; "keep content" never does; strict validation on admin writes, lenient reads; the couple catalog returns the field and the public by-slug response does not; admin writes include the field only when provided
- Needs: schema sync for the admin `site_templates` sheet (new nullable json column) BEFORE or with the deploy; seed the Grace row only after that; rollback = revert (the extra column is harmless); a failed "start fresh" can leave sections half applied (documented, retry is safe)

## 2026-10-29 · [Web] feat(templates): Grace template skeleton
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-skeleton.md
- Branch/PR: feat/grace-skeleton (merged to main with --no-ff, local, no PR)
- What changed: nine placeholder Grace components (opening, hero, verse, story, gallery, details, RSVP, guestbook, footer) registered and translation-wired; `grace_blush` template row ("Grace Blush & Gold", slug `pink-gold-white`) and nine component rows seeded INACTIVE so couples never see unfinished variants; seed test guards that; seeder export now honors a per-row `status`
- Needs: do not seed until API-template-default-sections is deployed and `lsdb sync` has run; then `npx lsdb seed seeds/section-components.ts --upsert` and `... seeds/site-templates.ts --upsert` from apps/api (the seeder silently drops unknown columns and `--skip-existing` never writes `default_sections`); the final launch task flips the rows and the template to active

## 2026-10-29 · [Web] feat(templates): Grace pack primitives
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-primitives.md
- Branch/PR: feat/grace-primitives (merged to main with --no-ff, local, no PR)
- What changed: shared pieces for the pink, gold and white pack: original cross artwork, gold divider, falling petals, arch photo frame with monogram fallback, scroll reveal that stays visible without JavaScript, section wrapper, and a script font for names (Great Vibes); palette bg #fff3f6, text #4a2c35, accent #8a6418 (4.95:1)
- Needs: none (not used by any template yet)

## 2026-10-29 · [Cross] feat: verse and footer section types
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-section-keys-verse-footer.md
- Branch/PR: feat/section-keys-verse-footer (merged to main with --no-ff, local, no PR)
- What changed: new `verse` and `footer` sections with generic default components, verse editor with six KJV wedding-verse presets, footer editor, Khmer date formatting; the couple builder now lists `guestbook`; new couples get the order opening, hero, verse, story, gallery, details, rsvp, registry, timeline, music, guestbook, footer (existing couples get verse and footer appended, disabled)
- Needs: schema sync for the couple `website_sections.section_key` enum and the admin `section_components.section` enum; seed the two new section_components rows (verse_classic, footer_classic); until the sync every request logs a schema-mismatch warning

## 2026-10-28 · [Web] feat(couple): template gallery with live thumbnails and apply dialog
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-builder-template-apply.md
- Branch/PR: feat/builder-template-apply (merged to main with --no-ff, local, no PR)
- What changed: template picker shows live thumbnails and a preview link; switching templates asks whether to keep text and photos or start fresh and warns that it cannot be undone
- Needs: API catalog change deployed

## 2026-10-28 · [Web] feat(couple): site-wide theme presets and per-section colors
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-builder-site-theme.md
- Branch/PR: feat/builder-site-theme (merged to main with --no-ff, local, no PR)
- What changed: 10 contrast-checked palettes with live hover preview, custom colors, reset to template; per-section Colors tab with 'Use site theme'
- Needs: none

## 2026-10-28 · [Web] feat(couple): asset library tab and picker
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-builder-assets.md
- Branch/PR: feat/builder-assets (merged to main with --no-ff, local, no PR)
- What changed: couples upload and delete images in the builder, pick them for gallery and hero cover, and are warned before deleting an image that is in use
- Needs: API asset library deployed

## 2026-10-28 · [Web] feat(web): live template preview on template subdomains
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-template-preview-subdomain.md
- Branch/PR: feat/template-preview-subdomain (merged to main with --no-ff, local, no PR)
- What changed: `<template-slug>.<ROOT_DOMAIN>` serves a live, noindex preview of a template with sample data (English and Khmer); `/templates` cards link to it; proxy caches the active template slug list for 60 s
- Needs: wildcard DNS and TLS for template subdomains; API catalog change deployed; consider edge rate limiting (junk-host flood grew server memory)

## 2026-10-28 · [Web] feat(couple): builder workspace with section variant browser
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-builder-workspace-variants.md
- Branch/PR: feat/builder-workspace (merged to main with --no-ff, local, no PR)
- What changed: website builder now has a section rail, a live canvas (desktop/mobile) and a section panel; every variant of a section is previewed with the couple's own data and applies with one click; panel tabs are pluggable (`workspace/panel-tabs/*.tab.tsx`)
- Needs: none

## 2026-10-28 · [Admin] feat(admin): template slug and description fields
- Owner: SNLRLONG
- Task: Tasks/4-testing/Admin-template-slug-field.md
- Branch/PR: feat/template-slug-field (merged to main with --no-ff, local, no PR)
- What changed: admin can create and edit templates with slug and description, sees slug errors inline, and gets a preview link per template
- Needs: `NEXT_PUBLIC_ROOT_DOMAIN`, `NEXT_PUBLIC_API_URL` (see apps/admin/.env.example); deploy together with the API catalog change

## 2026-10-28 · [API] feat(api): couple website asset library
- Owner: SNLRLONG
- Task: Tasks/4-testing/API-website-assets.md
- Branch/PR: feat/website-assets (merged to main with --no-ff, local, no PR)
- What changed: new `/couple/api/website/assets` (list, multipart upload, delete with in-use check and `force`, usage lookup); 8 MB / 12000 px / 100 per couple limits; `storageFor(coupleId)` seam; storage keys under `couples/<coupleId>/assets/`
- Needs: schema sync for the new couple table `website_assets` (non-production sheet first); production uploads need `API-s3-storage-verify` (or the Drive driver); quota lock is single-instance only

## 2026-10-28 · [API] feat(api): template catalog slug and apply modes
- Owner: SNLRLONG
- Task: Tasks/4-testing/API-template-catalog-apply.md
- Branch/PR: feat/template-catalog-apply (merged to main with --no-ff, local, no PR)
- What changed: templates get a unique `slug` and `description`; public `GET /public/api/site-templates/by-slug/:slug`; template slugs are reserved (couples cannot claim them, nor `www`/`api`/`admin`…); applying a template takes `mode` (`keep_content` or `reset_all`) and clears per-section styles and the site theme override; unknown or inactive template is now a 404
- Needs: run schema sync for admin `site_templates` (`slug`, `description`); set slugs on existing template rows (seed values: gold-ink-cream, crimson-gold-silk, blush-gold-garden, white-black-mono); Admin app must send `slug` on create (see the Admin entry)

## 2026-10-26 · [Web] fix(couple): responsive website builder, deep-link refresh fix
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-couple-builder-responsive.md
- Branch/PR: committed directly on `main` (6b240b9, 658d827), no branch or PR
- What changed: refreshing any couple-portal page no longer jumps to the dashboard; website builder works on phones (Edit/Preview toggle, wrapping controls); View site / Copy link once published; network errors no longer sign the couple out
- Needs: none
