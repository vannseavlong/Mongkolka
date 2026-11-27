# Web-couple-assist-request

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T2 · new card on the profile screen, calls new API (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude (session), 2026-11-27
- **Worktree:** `Mongkolka/couple-assist-request/` · **Branch:** `feat/assist-request`, cut from `feat/assist-integration` (which now equals main)
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** Web-profile-enhance (done, on main). API-assist-requests is paused and unmerged: this task is built against its contract (plan, "Data and API") and checked against a throwaway stub, so no in-app mock is shipped
- **Touches:** apps/couple/src/features/assist/ (new: data/assist-api.ts, lib/assist-state.ts, components/assist-card.tsx), one line in features/profile/index.tsx

## Goal
Profile has an 'Ask Mongkolka to help' card: send a request with a note, see its state (pending, approved until <date>, declined with reason, ended), cancel while pending, revoke while approved, and see recent help activity.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new)  - [ ] G4 run it
- [ ] G5 code review  - [ ] G7 docs sync  - [ ] G8 PR message  - [ ] G11 changelog

## Done when
- [x] States: none, pending, approved (expiry + Revoke), declined (reason), revoked/expired; loading, error
- [x] Note field 5-500 chars with counter; double submit prevented
- [x] Revoke asks for confirmation and says access ends at once
- [x] Activity list shows last 20 entries (time, what, 'Mongkolka admin')
- [x] State derivation is a pure function with tests
- [x] 360px check; mock removed before merge
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `couple-assist-request/` (branch `feat/assist-request`, from `feat/assist-integration`), uncommitted. New `features/assist/` (data/assist-api.ts, lib/assist-state.ts, lib/use-assist.ts, components: assist-card, ask-dialog, assist-activity) and a "Help from Mongkolka" section (card + side menu entry) in the profile page. Built against the contract in the plan, no in-app mock: `cancel` and `revoke` send the `request_id` (the API accepts it as optional).
- G2: `tsc`, eslint pass. G3: 69/69 couple tests (13 new, `lib/assist-state.test.ts`: view derivation, fail-closed expiry, time left rounding down, note validation, activity wording, DTO mapping).
- G4: run in Chrome against a throwaway stub of the contract (not the real API, which is unmerged and paused). Checked: none, ask dialog (empty submit shows the message and sends nothing; real note sends), pending with Cancel, approved (date, "6 days left", activity incl. admin edits), end-help confirmation then ended, declined with reason, 403, 500 with Try again. 360px: card and dialog fit, no sideways scroll. Found and fixed: declined text ran the reason into the next sentence.
- Not checked: the real API and a collaborator account (a 403 on asking would show the server's message in the dialog; not exercised), cancel button click in the browser (logic only), expiry passing while the page stays open (covered by a unit test only), build was not re-run after the last copy fix.
- Not done: G5 code review, G7, G11, commit. This task merges into `feat/assist-integration`, not `main`.

## Code review (G5, fresh agent, 2026-11-27) and fixes
Contract matches the API code (routes, bodies, shapes, derived `expired`, `{error}` bodies); no blockers. Fixed: card refreshes after a failed cancel/revoke (a 409 means an admin acted meanwhile), double-submit guard in the action runner, dialog cannot be closed while the request is in flight, old action error no longer shows in a newly opened dialog, long notes wrap at 360px, status text announced politely, heading order in the activity block, 403 on ask/cancel shows "Only the partners on this account can do this.", more tests (71 pass), `tsc`/eslint/`next build` clean.
Open, needs the API: a collaborator still sees the Ask and Cancel buttons (the API allows only partners); the client has no role to hide them. Fix needs `member_role` on `GET /couple/api/assist` in API-assist-requests. Also unverified: the `edit` activity `path` prefixes (API-assist-session writes them later).
Committed on branch `feat/assist-request`. G5 second pass after the fixes, G7, G11: not done. Merges into `feat/assist-integration`, not `main`.

## Held (2026-11-27)
Owner: do not merge until the admin Help requests screen exists, so couples cannot send requests nobody sees. The API it needs is on `main`. Activity wording for view, blocked and reconciled rows is uncommitted in `couple-assist-request/` (72/72 couple tests, `tsc` pass).
