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
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (no runner for templates: pure helpers only)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G6 security (if auth/data/input)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review (optional)  - [ ] G11 changelog

## Done when
- [ ] RSVP prefilled from `?to=`; validation and error/success states; works with the real `onSubmit` shape
- [ ] Guestbook: photo picker preview, wish form, pending vs approved result messages, approved photo wall, empty state, upload error state
- [ ] The ink guestbook behaves exactly as before (if touched)
- [ ] Responsive 320px to 1200px, English and Khmer, keyboard accessible forms with labels
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
