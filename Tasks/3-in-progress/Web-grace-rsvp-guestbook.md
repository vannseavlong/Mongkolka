# Web-grace-rsvp-guestbook

- **Repo:** packages/templates
- **Owner:** SNLRLONG
- **Tier:** T2 · new components in a shared package (auto picker, see `PIPELINE.md`)
- **Claimed by:** sub-agent (Web-grace-rsvp-guestbook), 2026-10-29
- **Worktree:** `Mongkolka/grace-rsvp-guestbook/` · **Branch:** `feat/grace-rsvp-guestbook`
- **Started / updated:** 2026-10-29 / 2026-10-29
- **Docs:** Tasks/_plans/Web-grace-wedding-template.md, Tasks/1-backlog/Web-grace-sections.md
- **Depends on:** Web-grace-skeleton (merged)
- **Touches:** packages/templates/src/sections/grace/Rsvp.tsx, grace/Guestbook.tsx, grace/strings/rsvp.ts, grace/strings/guestbook.ts, and a new shared helper file next to sections/ink/Guestbook.tsx only if logic is extracted

## Goal
Replace the `GraceRsvp` and `GraceGuestbook` stubs. RSVP: name prefilled from the guest greeting (`useGuest()`), attending yes/no, number of guests, message, submitted and error states, same `onSubmit` contract as `rsvp/Card.tsx`/`Reply.tsx`. Guestbook: the guest photo and wish wall for guests who join the wedding: same props and data contract as `sections/ink/Guestbook.tsx` (`GuestbookWallProps`, `GuestbookData`, `onSubmit`), pending/approved result states, approved photos displayed as a Grace wall, plus the directions/calendar/share actions if the ink version has them. Extract shared logic from the ink guestbook into a helper only if needed to avoid duplication, without changing the ink version's behavior. Re-tier to T3 if the diff touches apps/api guest-photos or storage.

## Gates
- [x] G1 scope (owned files plus new rsvp-ui.tsx and guestbook-logic.ts; no apps/api, ink or shared edits; stays T2)  - [x] G2 static (tsc clean templates, web, couple; eslint grace clean; next build web and couple pass)  - [x] G3 tests (API 96/96 incl. strings parity; none for templates: no runner; guestbook-logic.ts is pure and ready for tests)  - [~] G4 run it (390 px, about 840 px and 1440 px in a browser; Khmer layout; RSVP failure and success; photo preview and pending result; wall, broken-image fallback, too_large mapping; no hydration warnings; no real Tab pass; no 820/1200 screenshots, no empty wall or Khmer RSVP/error screenshots)
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] RSVP prefilled from `?to=`; validation and error/success states; works with the real `onSubmit` shape
- [ ] Guestbook: photo picker preview, wish form, pending vs approved result messages, approved photo wall, empty state, upload error state
- [ ] The ink guestbook behaves exactly as before (if touched)
- [ ] Responsive 320px to 1200px, English and Khmer, keyboard accessible forms with labels
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Status 2026-10-29
Built in commit d7871f9 on `feat/grace-rsvp-guestbook`, not merged. RSVP: pink section, gold cross, script "Kindly reply", couple message and deadline, white double-gold-border card with name prefilled from the greeting, two large pill choices ("Joyfully accept" / "Regretfully decline"), note field, guests stepper (1-10, only after accept), gold "Send my reply"; inline validation, retry message on failure with the form kept, success with cross and thank-you (gentler line for decline), "Change my reply", focus moves to the success message. Guestbook: white section "Share your joy" with a cross divider, pink card with dashed gold upload zone, arch-shaped preview with change and remove, name, wish with live counter (500), "Share with everyone"; the form needs a name plus a photo or a wish; inline errors (unsupported type, too large, rate or guest limit, uploads off, network) keep the form filled; pending or approved message after submit; "From our guests" 1/2/3 column masonry wall of arch-framed photos in white note cards with name and wish, wish-only notes, broken image -> cross panel, empty state "Be the first to share a moment"; directions, calendar and share buttons when `actions` is provided (same .ics output as ink). New files: rsvp-ui.tsx (form styles, `onAccent` picks white or dark text on the gold, card style), guestbook-logic.ts (MAX_WISH, photo validation, upload error mapping, ICS builder copied from ink).
Points for the owner: (1) the RSVP API accepts only {name, attending, plusOne, message}: the guests stepper sets plusOne = guests > 1 and, for a party larger than 1, APPENDS "Guests in my party: N" to the message (translated), changing what the couple reads; alternatives: a plus-one toggle, or a guest-count API field in a separate task. (2) The ink guestbook's gift-report option is left out (not in the Grace brief).
Not verified: prefers-reduced-motion toggled, a real phone photo or camera upload (synthetic PNG), live API, contrast measured (reasoned from the palette), a real Tab-key pass.
Next: G5 review, G7, G8, G11.
