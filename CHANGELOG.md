# Changelog

Merges to `main` across all projects, newest first. Tags: `[Web]`/`[API]`/`[Admin]`. Format and rules: `Tasks/README.md`.

## 2026-11-28 · [Web] fix(templates): align names on the invitation
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-invitation-align.md
- Branch/PR: fix/invitation-align, merged to main (no PR)
- What changed: on the Khmer invitation, son and daughter names stay level when one family lists fewer parents or none
- Needs: web and couple deploy. Code review not run

## 2026-11-28 · [Web] feat(couple): separate theme and font presets
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-split-font-presets.md
- Branch/PR: feat/split-font-presets, merged to main (no PR)
- What changed: in Design, theme presets change colours and background only; new font presets change fonts only. English text no longer turns into oversized Arial when Siemreap is the Khmer text font
- Needs: web and couple deploy. Code and security review not run

## 2026-11-28 · [Web] feat(templates): background patterns and corners switch
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-style-patterns.md
- Branch/PR: feat/style-patterns, merged to main (no PR)
- What changed: the Design panel has a background pattern picker (None, Diamond weave, Lotus lattice, Falling blossom) and a gold corners switch, on all templates; presets set them too. Existing sites are unchanged until chosen
- Needs: web and couple deployed 2026-11-28. Panel not checked signed in; code and security review not run

## 2026-11-28 · [Web] feat(templates): font choices in a Design panel
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-style-fonts.md
- Branch/PR: feat/style-fonts, merged to main (no PR)
- What changed: "Colors & palette" is now Design; presets set colours and fonts; separate pickers for Khmer heading, Khmer text, English heading and English script, on all templates. Existing sites are unchanged until a font is picked
- Needs: web and couple deployed 2026-11-28. Panel not checked signed in; code and security review not run

## 2026-11-28 · [Web] fix(templates): gold corners in front of the page
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-corners-front.md
- Branch/PR: fix/corners-front, merged to main (no PR)
- What changed: the Covenant gold corners sit above the content and bottom menu; taps pass through
- Needs: web and couple deployed 2026-11-28. Not checked on a real phone

## 2026-11-28 · [Web] fix(templates): seamless Covenant sections
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-seamless-sections.md
- Branch/PR: fix/seamless-sections, merged to main (no PR)
- What changed: Covenant sites no longer show the lotus border or the tint edge between sections
- Needs: web deployed 2026-11-28. Not checked on a real phone

## 2026-11-28 · [Web] feat(templates): reception place line on the map section
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-map-place.md
- Branch/PR: feat/map-place, merged to main (no PR)
- What changed: the map section shows a pin, the reception venue (ceremony if none) and a Get directions link instead of the venue card; date, time and address no longer show there. The couple's Map form has optional Place name and Directions link
- Needs: web and couple deployed 2026-11-28. Code and security review not run; Map form not checked signed in

## 2026-11-28 · [Admin][Web] feat(ui): page titles in the portal header, help requests table
- Owner: SNLRLONG
- Task: Tasks/4-testing/Admin-datatable-header.md
- Branch/PR: feat/admin-datatable-header, merged to main (no PR)
- What changed: admin, couple and vendor show each page title and its actions beside the sidebar toggle, at full width. Admin Help requests is a table with a status filter, couple search and a row action menu
- Needs: admin, couple and vendor deployed 2026-11-28. Code review not run; live pages not checked

## 2026-11-28 · [Web] feat(vendor): Firebase hosting, page kept on reload
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-vendor-firebase-hosting.md
- Branch/PR: feat/vendor-firebase-hosting, merged to main (no PR)
- What changed: vendor builds as a static site with a `vendor` hosting target and `deploy:vendor`; reloading a vendor page no longer jumps to Overview
- Needs: deployed 2026-11-28. Code and security review not run; vendor sign-in on the live site not checked

## 2026-11-27 · [Web] feat(templates): Khmer background and venue card on Covenant
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-kbach-art.md, Tasks/4-testing/Web-kbach-backdrop.md
- Branch/PR: feat/kbach-art, merged to main (no PR)
- What changed: Covenant sites get a fixed diamond weave, gold flame-leaf corners and lotus borders; the map section shows a venue card (name, address, date, time, Maps button) beside the picture. Builder canvas and thumbnails show no pattern
- Needs: web deployed; couple portal not redeployed. Not checked on an iPhone or in the builder preview; code review not run

## 2026-11-27 · [Web] feat(web): share preview per couple link, generated at build
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-share-previews.md
- Branch/PR: feat/share-previews, merged to main (no PR)
- What changed: `pnpm build` in web writes a page per couple listed in `apps/web/share-previews.txt` (or `SHARE_PREVIEW_SLUGS`) with their names, date and hero photo for Telegram, Facebook and X previews
- Needs: list the published slugs, then build and deploy web. Not checked with a real couple or on a real platform; code and security review not run

## 2026-11-27 · [Web] feat(couple): ask Mongkolka for help, and admin help sessions
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-couple-assist-request.md, Tasks/4-testing/Web-couple-assist-session.md
- Branch/PR: feat/assist-request, feat/assist-session-web via feat/assist-integration, merged to main (no PR)
- What changed: Profile has a "Help from Mongkolka" card (ask, cancel, end help, recent activity). The couple app accepts an admin's editor link: token kept in that tab only, banner with time left and Exit, people and Drive actions hidden, ended screen when access is cut
- Needs: deployed to couple-mongkolka.web.app. Not tested against the real API and sheet. Web (mongkolka.web.app) was also redeployed from main

## 2026-11-27 · [Admin] feat(admin): help requests screen
- Owner: SNLRLONG
- Task: Tasks/4-testing/Admin-assist-requests.md
- Branch/PR: feat/assist-requests-admin via feat/assist-integration, merged to main (no PR)
- What changed: Help requests page with Pending, Approved and Closed tabs; accept, decline with reason, end access, open the couple's editor; pending count in the sidebar
- Needs: deployed to admin-mongkolka.web.app. Not tested against the real API and sheet

## 2026-11-27 · [API] feat(api): assisted editing requests and editor session
- Owner: SNLRLONG
- Task: Tasks/4-testing/API-assist-requests.md, Tasks/4-testing/API-assist-session.md
- Branch/PR: feat/assist-requests, feat/assist-session via feat/assist-integration, merged to main (no PR)
- What changed: couples can create, cancel and revoke a help request; admins can list, accept, decline, revoke and open a 1-hour editor token. Every assisted request is re-checked, limited to an allow-list and written to `assist_log`. Assisted tokens are refused by default outside the couple routes. Blank `JWT_EXPIRES_IN` now means 7 days
- Needs: rotate `JWT_SECRET` on Render (old tokens never expire). Used by the admin and couple screens above. Render deploys main automatically. Not tested against the real sheet

## 2026-11-27 · [Web] feat(couple): image library without tabs, plus tile to upload
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-library-no-tabs.md
- Branch/PR: fix/library-no-tabs merged to main (no PR)
- What changed: the image library has no Library / Upload tabs; photos show at once, the first tile is a "+" that uploads, and files can be dropped anywhere on the library
- Needs: none. Deployed to couple-mongkolka.web.app. Not checked in a browser: picker dialog, builder panel, real mouse drag, delete focus return

## 2026-11-27 · [Web] fix(couple): make the active tab clear in the image library
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-library-active-tab.md
- Branch/PR: fix/library-active-tab merged to main (no PR)
- What changed: the Library / Upload tabs of the image library (Storage page and the photo picker dialog) now show the active tab as a filled, bold tab; before, both tabs looked alike. The shared Tabs component is unchanged
- Needs: none. Deployed to couple-mongkolka.web.app

## 2026-11-27 · [Web] feat(couple): storage page with image library and usage summary
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-storage-library.md
- Branch/PR: feat/storage-library merged to main (no PR)
- What changed: the Storage page shows summary tiles (images used of the limit, space used, where files are kept) and the couple's image library beside the Google Drive card, so photos can be uploaded and deleted there. Stacks on phones. The shared progress bar now exposes its value to screen readers
- Needs: none. Deployed to couple-mongkolka.web.app

## 2026-11-27 · [Web] feat(couple): profile photos from the image library and sectioned layout
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-profile-enhance.md
- Branch/PR: feat/profile-enhance merged to main (no PR)
- What changed: the couple Profile page lets couples pick or upload their cover and venue photos from the image library (no more pasting URLs), with previews and Remove. Page is split into section cards with a side menu on desktop, a loading skeleton and error states. Member invite and remove buttons no longer save the profile as a side effect
- Needs: none. Deployed to couple-mongkolka.web.app

## 2026-11-27 · [Web] fix(web): builder preview waits for the section to mount before scrolling
- Owner: SNLRLONG
- Task: none (ad hoc request)
- Branch/PR: fix/preview-scroll-wait, merged to main (no PR)
- What changed: the earlier gate fix did not work live, because sections only mount about a second after the gate opens. The preview now watches for the selected section to appear and scrolls to it, re-aligning for 2.5s while photos load. Verified live: Gallery picked with the gate shut scrolls to the Gallery after opening
- Needs: none

## 2026-11-27 · [Web] fix(web): builder preview scrolls to the section once the opening gate opens
- Owner: SNLRLONG
- Task: none (ad hoc request)
- Branch/PR: fix/preview-scroll-gate, fast-forwarded to main (no PR)
- What changed: in Full page mode, a section picked while the opening gate was still shut left the preview at the top after the gate opened; it now scrolls to that section
- Needs: none

## 2026-11-27 · [Web] fix(deploy): revalidate html on every load so new releases show at once
- Owner: SNLRLONG
- Task: none (ad hoc request)
- Branch/PR: fix/html-no-cache, fast-forwarded to main (no PR)
- What changed: `firebase.json` sends `Cache-Control: no-cache` for every file on web, admin and couple, then the existing immutable header for `/_next/static/**`. Pages were cached for an hour, so a deploy could show the old site and old preview for up to an hour
- Needs: admin picks it up on its next deploy

## 2026-11-27 · [Web] feat(web): active nav link, live template card previews, own sample map
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-template-cards.md
- Branch/PR: feat/web-template-cards merged to main (no PR)
- What changed: Header marks the current page (desktop and mobile menu, `aria-current`). Template cards on /templates and the landing page show a lazy, scaled live preview of the template's first screen. Covenant sample map replaced by our own `map-sample.svg`; the real venue's hand-drawn map files are removed
- Needs: not checked at 360px or on the Covenant preview page itself; Ink & Gold card can catch its cover mid-animation. Covenant sample hero photo and Vutha/Nita names look like a real couple and are unchanged

## 2026-11-27 · [Web] fix(web): gallery mix layouts form, all styles stackable, preview View all and scroll
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-preview-see-all.md
- Branch/PR: feat/preview-see-all · 4594f12, fast-forwarded to main (no PR)
- What changed: Mix layouts box is compact (no overflow, no long text) and offers every style from the Style tab; Covenant, Plates and Skin can be stacked and show their heading once. In the builder, "View all photos" shows every photo in place and the preview re-aligns to the selected section after images load or a save
- Needs: none. Preview scroll fix and stacked Covenant/Plates/Skin not checked in a browser before deploy

## 2026-11-27 · [Web] fix: serve landing photos as static files instead of Unsplash hotlinks
- Owner: SNLRLONG
- Task: none (follow-up to the landing revamp)
- Branch/PR: feat/web-landing-static-images merged to main (no PR)
- What changed: [Web] 16 resized photos saved in `apps/web/public/landing/` (1.5 MB); `photo()` in `landing/content.ts` now returns local paths, so the page makes no calls to Unsplash
- Needs: full page not re-checked in a browser after the switch; hero photo is about 515 KB

## 2026-11-27 · [Web] feat(web): gallery layout stack, photo limit for all layouts, thumbnail photo list
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-gallery-stack.md
- Branch/PR: feat/gallery-stack · 09f86cd, fast-forwarded to main (no PR)
- What changed: "Photos shown" now caps Grid, Masonry, Carousel, Plates and Skin as well as Covenant (only where a "View all" link exists). A gallery can stack layouts (Grid, Masonry, Carousel), each with its own photo count, even on a Covenant style. The gallery form lists photos as thumbnail and file name, with "Add by link" validated
- Needs: none (no API or sheet change, no seed). Narrow-width and loading/error states, and Skin and Plates with a limit, not checked in a browser

## 2026-11-27 · [Web] feat: richer landing page with stock photos, brand theme defaults and responsive layout
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-landing-revamp.md
- Branch/PR: feat/web-landing-revamp merged to main (no PR)
- What changed: [Web] landing page rebuilt: photo hero, stats, story, features, photo mosaic, how-it-works, template and vendor sections with loading states, vendor categories, testimonials, FAQ, photo CTA, new footer and sticky header. `globals.css` now ships Sage & Champagne defaults plus derived brand tokens so the page keeps its colours when the active-theme API is empty or down. Copy and image ids moved to `landing/content.ts`; app URLs to `lib/app-urls.ts`
- Needs: template and vendor cards with live API data, Khmer text, and the lower sections at 360px not checked. Photos load from Unsplash

## 2026-11-27 · [Web][Admin] feat: brand logo, favicon and share image
- Owner: SNLRLONG
- Task: none (ad hoc request)
- Branch/PR: d2c3da2 and fca13c8 on main (no PR); deployed to mongkolka, admin-mongkolka and couple-mongkolka
- What changed: [Web][Admin] interlocking-rings logo (colors from the portfolio: `#3B82F6`, `#1E40AF`, `#F59E0B`) as `icon.svg`, `favicon.ico` and `apple-icon.png` in web, admin, couple and vendor. [Web] `opengraph-image.png` and `twitter-image.png` (1200x630) with alt text, `manifest.webmanifest`, `icon-192/512.png`, and `metadataBase`, Open Graph, Twitter and theme-color metadata in `layout.tsx`. New `BrandMark` in `packages/ui` replaces the Heart and Store icons in the admin, couple and vendor sidebars
- Needs: vendor is not deployed (no hosting target). Sidebar size and collapsed view, and the social preview on a real platform, not checked in a browser

## 2026-11-27 · [API] feat: seed couple sheets for active couples only
- Owner: SNLRLONG
- Task: Tasks/4-testing/API-seed-active-couples.md (still open: reviews and an `--apply` run)
- Branch/PR: feat/seed-active-couples merged to main (no PR)
- What changed: [API] `scripts/seed-active-couples.ts` seeds only active couples' sheets; dry run unless `--apply`
- Needs: none. Code review, security review and a real write not done

## 2026-11-27 · [Admin][API][Web] feat: admin setting for upload photo quality and resize size
- Owner: SNLRLONG
- Task: Tasks/4-testing/Admin-image-quality.md (T-0059, still open: needs a real upload check)
- Branch/PR: feat/admin-image-quality merged to main (no PR)
- What changed: [Admin] "Photo quality" and "Resize photos to" under Settings, Image uploads. [API] `webpQuality` (40-100, default 80) and `resizeTo` (600-8000, default 2048) in the upload limits. [Web] couple uploads are resized and compressed in the browser (JPEG kept on Safari); covenant sample map served as WebP
- Needs: no sheet sync or seed. Code review and browser check not done

## 2026-11-28 · [Web] feat: Storage screen to connect Google Drive (couple portal)
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-couple-drive-connect.md (T-0020, closed 2026-11-27 by the owner; not run: needs a real-account render check)
- Branch/PR: feat/couple-drive-connect merged to main (no PR)
- What changed: [Web] new `/settings/storage` screen and sidebar item: connect, reconnect and disconnect Google Drive (confirmation explains Drive photos stop showing after disconnect), states for loading, error, no access, not available, not connected, connected, needs reconnect; toast for the `?drive=` result Google redirects back with; reconnect banner on Guestbook and the image library
- Needs: API from the entry below deployed first; 360px width, real Google account run and code review not done

## 2026-11-28 · [API] feat: per-couple Google Drive storage through lsdb
- Owner: SNLRLONG
- Task: Tasks/5-done/API-couple-drive-storage.md (T-0018, closed 2026-11-27 by the owner; not run: needs a real-account run)
- Branch/PR: feat/couple-drive-storage merged to main (no PR)
- What changed: [API] couples can connect their own Google Drive (`drive.file`); uploads then go to their Drive through lsdb `DriveStorageAdapter` and are served by a public `/media/:coupleId/:fileId` route (ETag, long cache, rate limit, images only). Refresh tokens encrypted at rest (`DRIVE_TOKEN_KEY`). `storageFor(coupleId)` falls back to the default driver on any Drive failure and flags `needs_reconnect` on a revoked grant. New `couple_drive_connections` admin table; `/couple/api/drive` status, connect, callback, disconnect. Guest photos now use `storageFor()` with key `couples/<id>/guest-photos/...`. Off unless `DRIVE_TOKEN_KEY` is set
- Needs: `lsdb sync` (adds `couple_drive_connections`), set `DRIVE_TOKEN_KEY` (`openssl rand -base64 32`), `DRIVE_GOOGLE_REDIRECT_URI` and `PUBLIC_API_URL` on the API host, add the redirect URI to the Google OAuth client and enable `drive.file` on the consent screen, deploy API; disconnect-with-copy, load check and security review not done

## 2026-11-28 · [Cross] feat: bilingual verse and story, wish-only reply, gallery sub-page rework, video and details cleanup
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-hero-banners-and-pickers.md (plan: Tasks/_plans/Web-hero-redesign.md)
- Branch/PR: main (no PR)
- What changed: [Web] Verse and Our story have Khmer and English text (verse also reference and meaning each); story stored on the section with the profile story as fallback; Covenant reply form is a wish form only (name and message, sent to the guestbook); gallery "show all" is one consistent button that opens the sub-page, the sub-page is redesigned (sticky back arrow, framed tiles, site viewer) and coming back restores the reader's place with no cover or opening replay; video has no card, caption or YouTube link; one cross in the story; Event details panel grouped (Ceremony, Reception, More); less helper text in panels; editable cover sub-title. [API] verse, story and cover content validation, covenant seed fix, admin build type fix
- Needs: same as the previous entry (`lsdb sync`, seeds, deploy, `/*/gallery` rewrite); existing verse text typed in the English box should be moved to the Khmer box; Khmer wording of the wish form and presets needs native review; tablet and reduced-motion checks and code review not run

## 2026-11-27 · [Cross] feat: section titles, gallery sub-page, envelope hero banner, invitation prefill, Khmer wording
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-hero-banners-and-pickers.md (plan: Tasks/_plans/Web-hero-redesign.md)
- Branch/PR: main (no PR)
- What changed: [Web] per-section Khmer and English titles (Content panel; replace the template heading in every template); new `/<slug>/gallery` sub-page with all photos and a viewer, and a "View all photos" button under every gallery; Envelope Reveal hero ends on the full banner and is centred; hero names larger and higher; Invitation form pre-fills names, initials and event date from the profile; one language switch in the preview bar that also saves the site language; the builder frame is the same size in Section and Full page; click-to-upload hero banners; Khmer wording "រឿងរ៉ាវពួកយើង" and "កម្រងរូបភាព"; injected style tags are keyed by content so open pages pick up CSS edits. [API] `website_sections.title` column and validation, seed fix (component_id first so `lsdb seed --upsert` matches on it) and a test that guards it
- Needs: `lsdb sync --dry-run`, `lsdb sync`, `lsdb sync --all-users` (adds `title` and `default_language`), deploy API, `lsdb seed seeds/section-components.ts --upsert` (rerun until 0 failed; Google read quota) and site-templates, activate rows in admin; deploy web with the new `/*/gallery` Firebase rewrite and restart the web dev server for the dev route; the seed bug overwrote the `opening_curtain` row earlier (re-created by the fixed seed); Khmer wording needs native review; tablet, reduced motion and code review not run

## 2026-11-26 · [Cross] feat: opening content, site language, hero banners and reveal heroes, shadcn pickers
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-hero-banners-and-pickers.md (plan: Tasks/_plans/Web-hero-redesign.md)
- Branch/PR: main (no PR)
- What changed: [Web] Opening section form (Khmer and English wording, names, date, time, place; the cover reads the same); default site language setting (Khmer unless changed) and a Khmer/EN preview switch; Hero portrait and landscape banners (picked by screen orientation) uploaded from the Hero Content panel; new heroes Cinematic, Editorial, Framed, Gift Box, Book and a rebuilt cinematic Envelope Reveal; shadcn DatePicker, DateTimePicker and Select replace native date inputs and selects; template default style always listed in the style picker. [API] `couple_profile.default_language`, `PATCH /couple/api/website/language`, validation for opening and hero content, 8 new hero catalog rows
- Needs: `lsdb sync --dry-run`, `lsdb sync`, `lsdb sync --all-users`, deploy API, `lsdb seed seeds/section-components.ts --upsert` and site-templates, activate rows in admin; sites now open in Khmer by default; Khmer wording of new heroes needs native review; tablet and reduced-motion checks and code review not run

## 2026-11-25 · [Cross] feat: cover section (animated intro before the opening) for Covenant
- Owner: SNLRLONG
- Task: Tasks/4-testing/API-cover-section-key.md, Web-cover-sequence.md, Web-covenant-cover.md (plan: Tasks/_plans/Web-cover-section.md)
- Branch/PR: main (no PR)
- What changed: [Web] new `cover` section that plays first (butterflies or garden bloom, couple names and date), then fades to reveal the opening gate, which mounts only at reveal; not skippable, reduced motion shows a still cover; builder preview plays cover then opening, Replay intro, thumbnails in the Style tab; two Covenant covers, original SVG/CSS. [API] `cover` added to the section key enums and seeds (2 component rows inactive, Covenant default_sections starts with cover; every template lists cover disabled)
- Needs: `lsdb sync` if the sheet enforces the section enum, `lsdb seed --upsert`, activate the cover rows in admin; existing Covenant couples get Cover appended disabled at the bottom; browser check (Desktop and Mobile, EN and KH, public site) and code review not run

## 2026-11-24 · [Cross] feat: Covenant Gold & Blush Christian wedding template (inactive)
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-covenant-template.md
- Branch/PR: feat/covenant-template (merged to main, no PR)
- What changed: [Web] new `covenant` skin: animated Khmer blessing, names and guest intro, cross reveal into a full-screen hero, verse card, memories (latest guest photos and wishes), `/<slug>/photos` and `/<slug>/wishes` pages; [Cross] new `video` section (YouTube, server-validated, couple portal form, Firebase rewrites); `covenant_gold` template and component rows seeded inactive
- Needs: deploy API, `lsdb sync`, `lsdb seed --upsert`, then activate in admin; Khmer, tablet/desktop and real-API check, code review not run

## 2026-11-24 · [Web] feat: couple builder edit buttons and in-builder editing
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-couple-builder-edit.md
- Branch/PR: feat/couple-builder-edit (merged to main, no PR)
- What changed: [Web] the section panel opens on Content; pencil Edit button on every section row and in the canvas header; hero, story and details open an edit dialog that saves to the couple profile (names, date, love story, times, venues, addresses, dress code, map link, venue photo); details gets an Assets tab for the venue photo; `tsx` dev dependency and `test` script in apps/couple
- Needs: browser check (360px, keyboard, real upload) and code review not run

## 2026-11-22 · [Cross] feat: six Khmer e-invitation templates (inactive)
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-khmer-*.md, Web-khqr-gift.md, Web-skinned-sections-*.md (plan: Tasks/_plans/Web-khmer-einvite-templates.md)
- Branch/PR: feat/khmer-einvite-integration (merged to main, no PR)
- What changed: [Web] shared chrome (dock, music toggle, particles, reveals), new `invitation`, `agenda`, `letters` sections, KHQR gift card on `registry`, skin-aware gallery, guestbook, story, details, RSVP and footer, and six original skins (`emerald_kbach`, `royal_garden`, `royal_cream`, `sakura_romance`, `fairytale_storybook`, `kids_fantasy_birthday`). [API] section schemas, server-side validation (https-only map/link URLs, ISO `startsAt`, length caps), nullable `site_templates.chrome` column, inactive template and component seed rows
- Needs: before deploying the API run `lsdb sync --dry-run`, `lsdb sync`, then `lsdb sync --all-users`, then deploy and seed with `--upsert`; read back the first saved `chrome` and gift values; templates stay inactive until the QA task (`Web-khmer-templates-waves`) passes; browser check (360px to desktop), code review and human review of the two T3 tasks (KHQR gift, review fixes) were not run

## 2026-11-21 · [Web] feat: public site as static export on Firebase Hosting
- Owner: SNLRLONG
- Task: Tasks/6-deploy/Web-hosting-deploy.md
- Branch/PR: feat/web-hosting-deploy (merged to main, no PR)
- What changed: apps/web is a static export at mongkolka.web.app; couple sites use path URLs (`/<slug>`) instead of wildcard subdomains and load data client-side; `proxy.ts` removed; new `GET /public/api/site-by-domain/:host` for custom domains; reserved slugs extended; admin and couple build path-based preview URLs
- Needs: check a real couple page and a custom domain; code and security review were not run

## 2026-11-21 · [Cross] feat: configurable image upload limits with WebP conversion
- Owner: SNLRLONG
- Task: Tasks/5-done/API-asset-upload-limits.md
- Branch/PR: feat/asset-upload-limits · #3
- What changed: [API] image library limits (max MB, max pixels, images per couple) read from env `ASSET_MAX_MB`, `ASSET_MAX_DIMENSION`, `ASSET_MAX_PER_COUPLE` and overridable by an admin through the new `platform_settings` sheet table (30 s cache, clamped to ceilings of 100 MB, 16383 px, 1000 images); new `GET/PATCH /admin/api/settings/uploads` and `GET /couple/api/website/assets/limits`. [Admin] new Settings page (Image uploads). [Web] the couple image library reads the limits from the API and converts JPEG/PNG to WebP at quality 1.0 in the browser before upload (keeps the original if WebP is larger or the browser cannot encode it)
- Needs: run `pnpm exec lsdb sync` in apps/api for the new `platform_settings` table, then deploy API before the apps; set `ASSET_MAX_MB` (or use Admin > Settings) to fit photos over 8 MB; G4 browser check, code review and security review not yet run

## 2026-11-02 · [Cross] chore: Firebase Hosting for admin and couple, API on Render
- Owner: SNLRLONG
- Task: Tasks/6-deploy/Admin-firebase-hosting.md
- Branch/PR: feat/firebase-hosting · #1
- What changed: admin and couple build as static exports and deploy to admin-mongkolka.web.app and couple-mongkolka.web.app (`pnpm deploy:admin`, `pnpm deploy:couple`); `firebase.json`, `.firebaserc` and `render.yaml` added; API live on Render free at https://mongkolka-api.onrender.com (Google Sheets via lsdb, tokens in a Render Secret File)
- Needs: web (mongkolka.web.app) and vendor not deployed yet; uploads on Render are local disk and lost on restart until R2 is set (see Tasks/2-todo/API-render-hardening.md)

## 2026-10-30 · [Cross] feat: Grace template launch prep (foil text, brand link, previews, how-to)
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-qa-launch.md
- Branch/PR: feat/grace-launch (merged to main with --no-ff, local, no PR)
- What changed: the whole Grace page walked end to end and tidied (alternating pink/white grounds, one cross per section, unified script headings, gallery and guest-wall column counts); foil text darkened (lightest stop about 4.0:1 on pink, 4.3:1 on white); footer credit link from the web app's ROOT_DOMAIN (plain text when unset); template preview pages show all sections with a sample guest photo wall, honor `?to=` (capped at 80 characters) and the template's section order; the public by-slug template response now returns a cleaned `default_sections`; owner how-to in docs/grace-template-howto.md
- Needs: ROOT_DOMAIN set on apps/web for the footer link; Grace template and its nine component rows are still seeded INACTIVE and have not been seeded: sync first (`npx lsdb sync`, `--all-users` for existing couple sheets), then `npx lsdb seed seeds/section-components.ts --upsert` and `npx lsdb seed seeds/site-templates.ts --upsert`, then switch active on a COPY of the dev sheet to review

## 2026-10-30 · [Web] feat(templates): Grace opening gate
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-opening.md
- Branch/PR: feat/grace-opening (merged to main with --no-ff, local, no PR)
- What changed: pink and gold invitation gate: white arched window with a double gold line and a cross at the apex, "Dear {name}" from the `?name=` / `?to=` link parameter in script type (or "You are invited"), couple names, date, one full-width "Open the invitation" button; the arch doors swing apart and the gate fades; reduced motion opens immediately; fits landscape phones; Khmer supported
- Needs: nothing (not part of an active template yet)

## 2026-10-29 · [Web] feat(templates): Grace RSVP and guest photo wall
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-rsvp-guestbook.md
- Branch/PR: feat/grace-rsvp-guestbook (merged to main with --no-ff, local, no PR)
- What changed: pink, gold and white RSVP (prefilled name, accept/decline pills, guests stepper, retry and success states, focus and error announcements) and guest photo and wish wall (upload with preview, 500-character wish counter, pending/approved messages, arch-framed masonry wall, share/directions/calendar actions); same data contract as the ink guestbook; the stepper sends plusOne and appends a fixed `Guests: N` line to the message until the API gets a structured field
- Needs: nothing (the section components are not yet in an active template); follow-up task API-rsvp-guest-count

## 2026-10-29 · [Web] feat(templates): Grace gallery (lightbox) and details sections
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-gallery-details.md
- Branch/PR: feat/grace-gallery-details (merged to main with --no-ff, local, no PR)
- What changed: arch-framed gallery with a keyboard and swipe lightbox (focus trap, pinch-zoom, failed-image handling) and ceremony/reception detail cards with directions links and a dress-code strip
- Needs: nothing

## 2026-10-29 · [Web] feat(templates): Grace hero and story sections
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-hero-story.md
- Branch/PR: feat/grace-hero-story (merged to main with --no-ff, local, no PR)
- What changed: hero with the couple's photo in a gold arch (monogram fallback), script names, date and scroll cue that fit above the fold from 320x568 to 1440x900, and a story card with a letter-only drop cap
- Needs: nothing

## 2026-10-29 · [Web] feat(templates): Grace verse and footer sections
- Owner: SNLRLONG
- Task: Tasks/4-testing/Web-grace-verse-footer.md
- Branch/PR: feat/grace-verse-footer (merged to main with --no-ff, local, no PR)
- What changed: verse section with a large cross ornament and Khmer text support, and a footer with names, localized date, message, hashtag and an optional credit link (`brandUrl`, plain text when unset)
- Needs: apps/web must pass `brandUrl` to the footer (launch task) once the production domain is settled

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

## 2026-10-26 · [Web] feat(templates): Khmer Kbach template
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-khmer-kbach-template.md (T-0023, entry added 2026-11-27)
- Branch/PR: committed on main (91e20ec, no branch)
- What changed: Khmer ornament wedding template (arch gate, arch photo hero, story and details sections) with catalog seed rows
- Needs: Khmer text, tablet and desktop never checked

## 2026-10-26 · [Web] fix(couple): responsive website builder, deep-link refresh fix
- Owner: SNLRLONG
- Task: Tasks/5-done/Web-couple-builder-responsive.md
- Branch/PR: committed directly on `main` (6b240b9, 658d827), no branch or PR
- What changed: refreshing any couple-portal page no longer jumps to the dashboard; website builder works on phones (Edit/Preview toggle, wrapping controls); View site / Copy link once published; network errors no longer sign the couple out
- Needs: none
