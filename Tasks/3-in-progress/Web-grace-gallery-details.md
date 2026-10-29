# Web-grace-gallery-details

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-gallery-details), 2026-10-29
- **Worktree:** `Mongkolka/grace-gallery-details/` · **Branch:** `feat/grace-gallery-details`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Gallery.tsx, grace/Details.tsx, grace/strings/gallery.ts, grace/strings/details.ts

## Goal
Replace the `GraceGallery` and `GraceDetails` stubs. Gallery: the couple's photos (`content.photos: string[]`) as gold-framed arch tiles on pink with tap-to-enlarge (lightbox with keyboard close, arrow keys, focus return); empty returns null; a broken image does not leave a broken tile. Details: ceremony and reception cards (time, venue, address), dress code, map link built safely from the address; missing fields omit their row.

## Gates
- [x] G1 scope (owned files plus one new file gallery-lightbox.tsx)  - [x] G2 static (tsc clean templates, web, couple; eslint grace clean; next build web and couple pass)  - [x] G3 tests (API 96/96, not re-run after the final one-line lint fix; none for templates: no runner)  - [~] G4 run it (headless Chrome 320/390/820/1200 px; keyboard in a real browser; swipe simulated; reduced motion; no hydration warnings)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] Gallery with 1, 3, 12 photos and with a broken URL; lightbox open/close/next/prev by mouse, touch and keyboard, focus returns to the tile
- [ ] Details with all fields, with only the ceremony, and with none (renders nothing)
- [ ] Map link is URL-encoded and opens with rel noopener
- [ ] Responsive 320px to 1200px, English and Khmer
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit d5c3a9f on `feat/grace-gallery-details`, not merged. Gallery: "Our moments" gold script heading with a gold line and small cross, arch-topped tiles with a thin double gold frame (2 columns on phones, 3 on desktop, gentle CSS stagger, fade up on scroll), lightbox (dark full screen: close, prev/next, counter "3 / 12"; Esc, arrow keys, swipe; role dialog aria-modal "Photo viewer"; focus into the viewer, Tab trapped, focus returns to the tile; page scroll locked and restored), broken URL hides its tile, empty renders nothing, 1 photo centred, 2 photos narrower layout, lazy loading, alt "Photo n of N" (en and kh). Details: "The celebration" heading under a cross-and-leaf ornament, two white double-gold-bordered cards (cross icon for the Ceremony, drawn glass for the Reception) with time, venue, address and a "Get directions" Google Maps search link (URL-encoded, new tab, rel noopener noreferrer, hidden "(opens in a new tab)" note), dress-code strip between two gold hairlines; missing fields omit rows, empty cards omitted, one card centred, nothing renders null.
Open points: the large gold script headings use FoilText (foil gradient) whose lighter tints are not strictly 4.5:1 (large text; small gold text uses the plain accent) - owner may prefer solid gold headings; the preview needed Google Fonts network access so the dev server ran unsandboxed.
Not verified: a real touch device, real photos (gradient data URIs used), a screen reader, contrast measured on the final page, Safari/iOS, very tall or very wide lightbox images, API tests after the final lint fix.
Next: G5 review, G7, G8, G11.

## Review 2026-10-29 (fresh agent, G5; tsc and eslint clean; ran in a real browser at 500 px; build and API tests not run)
No blockers; verdict: move to testing after the should-fix items. Verified: lightbox focus on Close, body overflow hidden, Shift+Tab/Tab trap, ArrowRight wrap, Esc closes and restores overflow and focus; duplicates, "", "  ", a number and `javascript:` entries produce no tile; broken URL tile removed; 50 photos load lazily (12 at once) with no overflow; 300x3000 and 4000x300 images fit; two h2s with h3 cards; the portal escapes the transformed preview box; Google Maps URL encoding (`&`, `#`, `/`, `?`, Khmer) and link rel/target; no scrollbar layout shift and StrictMode cleanup; z-index 100 above the language toggle; reduced motion; string keys in en and kh.
Sent back: 1 FoilText headings: lightest stop 2.29:1 on #fff3f6 (85% stop 3.65:1, solid accent 4.95:1): the two headings now use solid accent; the shared FoilText darkening goes to the launch task (it also affects the hero names); 2 `failed` set keyed by URL never reset, and a failure while the lightbox is open shifts the photo being shown; 3 lightbox image has no onError or loading state or neighbour preload; 4 touch: pinch-zoom disabled, swipe fires on dx alone, no touchcancel.
Nits sent back: stopPropagation on Esc/arrows, trim URLs, Array.isArray guard, sr-only counter text, dedupe style tags. Skipped: focus returns to the last-shown tile (acceptable, arguably better).
Not tested: real touch device, Safari/iOS, a screen reader, reduced-motion emulation console, Khmer rendering (builder asked to render it).
