# Web-grace-qa-launch

- **Repo:** packages/templates, apps/web
- **Owner:** SNLRLONG
- **Tier:** T2 · edits a shared primitive and the public site page (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-qa-launch), 2026-10-30
- **Worktree:** `Mongkolka/grace-launch/` · **Branch:** `feat/grace-launch`
- **Started / updated:** 2026-10-30 / 2026-10-30
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** all Grace component tasks (merged)
- **Touches:** packages/templates/src/sections/grace/* (any file, including shared.tsx), packages/templates/src/sample-content.ts, apps/web/src/app/[slug]/page.tsx and site-view.tsx, apps/web/src/app/templates/template-preview.tsx and templates/preview, docs/tasks/template.md

## Goal
Make the Grace pink, gold and white template work as one whole page and ready for the owner to review: darken the shared foil text, wire the footer credit link from the web app, make the template preview pages show every section including the guest photo wall, run a whole-page QA at phone, tablet and desktop in English and Khmer, fix integration issues found, and write the owner's step-by-step to see it. Do NOT flip the template or its component rows to active (the owner does that after reviewing).

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates, web, couple, api, admin; eslint grace + touched web paths clean; next build web and couple pass first try)  - [x] G3 tests (API 96/96 incl. the seed guard; none for templates: no runner)  - [~] G4 run it (whole flow walked with headless Chrome over CDP against a stub API and the real pages: ?to=Sokha, open, every section, lightbox, guestbook wish + photo, RSVP; full-page screenshots at 390/820/1200 px en and kh and 667x375 landscape with reduced motion; the author read only part of the screenshots)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (owner looks at the template)  - [ ] G11 changelog

## Done when
- [ ] `FoilText` stops are darkened for text use; large script text is at least 3:1 everywhere (hero names, opening names), re-measured
- [ ] Footer gets `brandUrl` from apps/web (production domain from env; plain text when unset)
- [ ] Template preview pages (`/templates/[id]` and `/templates/preview/[slug]`) render all Grace sections including a sample guest photo wall and a working no-op RSVP
- [ ] Whole-page screenshots at 390, 820 and 1200 px, English and Khmer, reviewed and integration issues fixed
- [ ] Owner's "how to see it" steps written (seed commands, toggle active on a dev sheet copy, URLs)
- [ ] Template and component rows still inactive in the seeds (the seed test guards it)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-30
Built in commit 177fd5a on `feat/grace-launch` (agent was interrupted once by a network error and resumed). Foil text: new `foilTextGradient` in shared.tsx, lightest stop 88% accent = 3.88:1 on #fff3f6 and 4.20:1 on white (before 2.29:1 and 2.48:1); `FoilText` API unchanged with the solid accent fallback. Footer credit: `apps/web/src/lib/brand-url.ts` builds the URL from ROOT_DOMAIN (http for localhost, https otherwise, undefined when unset) and passes it from [slug]/page.tsx to SiteView and extraProps("footer"); both template preview pages pass it too; footer_classic ignores it. Previews: SAMPLE_GUESTBOOK (6 photos, 4 wishes), SAMPLE_GUESTBOOK_ACTIONS and sampleGuestbookSubmit (resolves `pending`); `?to=`/`?name=` work on /templates/preview/[slug]; the preview uses the template's default_sections when present, otherwise all 12 sections.
OPEN: the public API does not return `default_sections` (allowlist), so on the real API the preview shows registry, timeline and music (sample content exists) and puts RSVP before guestbook; fix is one line: add "default_sections" to PUBLIC_FIELDS in site-templates.service.ts (and update the test that asserts it is NOT exposed).
Integration fixes made after looking at screenshots: five pink sections in a row (verse, gallery and footer are now white so the grounds alternate); doubled crosses (cross above heading plus a cross divider -> diamond divider); inconsistent headings unified to the script foil style; lone third gallery photo centred; gallery 3 columns from 640 px up; guestbook wall 2 columns on phones and 3 from 640 px up; footer "&" spacing.
Contrast on the final page at 1200 px: DOM script over 65 text nodes, none below 4.5:1 (3:1 large); lowest 4.95:1 (gold on pink). The script skips aria-hidden text (hero SCROLL hint, opening gate text; the gate names are foil text, covered by the numbers above).
Owner docs: docs/tasks/template.md (new Grace section) and docs/grace-template-howto.md (steps a-f). All seed statuses still inactive; no seeds run.
Not verified: real API data and uploads (stub only), real iPhone/Android Safari, a screen reader, native-speaker Khmer review, the author did not read all screenshots end to end (read: English 390 px sections, English 820 px down to the guestbook, Khmer 1200 px hero/verse/story/guestbook, landscape opening and hero); stub photos repeat three images.
Next: G5 review, G7, G8, G9 (owner looks at the template), G11.

## Review 2026-10-30 (fresh agent, G5; tsc/eslint/API tests/builds run; page walked at 390 and 1200 px en and kh with ?to=Sokha; reduced-motion pass)
Verdict: OK to move to testing; no blockers. Verified: the earlier review fixes survived (Opening untouched by this diff and its button hit area intact; lightbox focus/Esc/ArrowRight; footer brandUrl link and plain-text fallback; verse semantics; heading levels one h1, h2 sections, h3); alternating grounds; no overflow or hydration warnings; scan of 67 text nodes including aria-hidden ones (opening gate colors computed by hand: muted 5.9-6.4:1, accent 4.95-5.36:1) all at or above 3:1 large and 4.5:1 small except the Khmer hero "&" (decorative, 3.86:1, 22 px); FoilText solid fallback correct and Grace-only (kbach has its own separate FoilText, ink does not use it); `ROOT_DOMAIN` read only on the server and passed as a prop; preview pages noindex, sample data only; lsdb flags in the howto exist as written; scope clean (19 files, no seed status change, no dependency or lockfile change, no throwaway files).
Sent back: 1 previews show the wrong sections on the real API because the public by-slug response omits default_sections: expose a NORMALISED default_sections via parseDefaultSections in toPublicTemplate (section keys and booleans only; /public/api/site-templates already returns full rows) and update the test that asserted it was NOT exposed; 3 contrast numbers measured 3.86:1 (pink) and 4.18:1 (white), not 3.88/4.20; 5 brand-url.ts localhost detection is case-sensitive and prefix-based (`localhost.evil.com` gets http; `LocalHost:5501/` gets https); 6 previewSections renders blank if every key is unknown; 7 no length cap on ?to=/?name=; 9 the howto says `lsdb sync` takes an actor, it syncs all actors in the config and existing couple sheets need `--all-users`. Nit: FoilText emits a <style> per instance inside headings (about 9, pre-existing pattern): hoist if cheap.
Skipped: Khmer "&" contrast, 14 px footer credit tap target (unchanged).
Not verified: real-device Safari, a 320 px guestbook wall, a screen reader.

## Merged to main 2026-10-30
Merged locally with --no-ff after review and fixes; combined typecheck (templates, web, couple, api, admin), grace lint, API tests (96/96), couple lint (0 errors) and production builds of web, couple, admin and api pass. Moved to 4-testing, not 5-done: G9 is the owner looking at the template on a running app (not done), the fix commit was not re-reviewed by a fresh agent, the 90 percent foil stop (about 4.01:1 on pink, 4.34:1 on white, recomputed by hand) was not re-measured in a browser, no tests for templates (no runner), real-device Safari, a screen reader and the Khmer copy review are not done. The template and its nine component rows stay inactive until the owner approves (flip in the seed files and update the guard test, see docs/grace-template-howto.md step f).
