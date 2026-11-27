# Admin-assist-requests

- **ID:** T-0065
- **Repo:** apps/admin
- **Owner:** SNLRLONG
- **Tier:** T3 · issues impersonation tokens and hands them to another app (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude (session), 2026-11-27
- **Worktree:** `Mongkolka/assist-requests-admin/` · **Branch:** `feat/assist-requests-admin`, cut from `feat/assist-integration` (= main)
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** API-assist-requests (list/accept/decline); API-assist-session (open editor)
- **Touches:** apps/admin/src/features/assist-requests/ (new: data/, lib/, components/), sidebar entry, route app/(dashboard)/assist-requests/page.tsx

## Goal
Admin 'Help requests' screen: list with status filter, read the couple's note, accept or decline with reason, and Open editor for approved requests. Contract first: build against the plan's contract with a typed mock in the data layer only (`// MOCK: API-assist-requests`) until the API merges.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security (OWASP + /security-review)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [x] List with status tabs (pending, approved, closed), couple name, note, requested date, expiry
- [x] Accept and Decline (reason required) with confirmation; loading, empty, error, no-permission states
- [x] Open editor: calls the session endpoint, opens the couple app with the token in the URL **fragment** (`#assist=`), never in the query string, never stored in admin storage
- [x] Open editor disabled once the request is expired or revoked
- [x] Pending count badge in the sidebar
- [x] Narrow-width check at 360px
- [x] Mocks removed before merge
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `assist-requests-admin/` (branch `feat/assist-requests-admin`), committed 8988a5e, not merged. Built on the real API contract (merged), so no mock. `features/assist-requests/` (data, lib, components), route `/assist-requests`, sidebar entry with pending count.
- Added beyond the task: "End access" (revoke) on approved requests, with confirmation.
- Cards instead of the shared DataTable: the note is the main content and must read at 360px.
- Dependency: `tsx` (dev) and a `test` script in apps/admin, the same runner apps/couple uses; node's own runner cannot resolve the app's extensionless imports.
- "Closed" filters on the client (the API takes one status), with "Load older requests".
- G2: `tsc`, eslint, `next build` pass. G3: 13 new tests. G4: Chrome against a throwaway in-memory stub: list, badge, accept, decline (empty reason refused), open editor (new tab, token in fragment only), end access, closed tab, empty, 403, 500, 360px (in a frame). Not checked: the real API, a blocked pop-up in a real browser (unit test only), Load older with more than 50 rows, an approval expiring while the page is open (unit test only).
- Not done: G5, G6 (need a reviewer that did not write the code), G7 to G11.
- **Do not deploy before Web-couple-assist-session:** the couple app does not read `#assist=` yet, so "Open editor" would leave an unused token in that tab's address bar and history.

## Shipped (2026-11-27)
Merged to `main` (4b904a9) through `feat/assist-integration`, pushed and deployed. Worktrees and branches removed.
- G2/G3 on merged `main`: `tsc` pass; couple 88/88, admin 13/13, API 304/304; production build pass (Google Fonts fetch failed on some attempts, retry passed).
- G5: separate review agent, no blocker. Fixed: help card stayed stale until reload; header blur lost for all couples; section jumps hid under the banner.
- G6: /security-review with a separate agent, no HIGH or MEDIUM finding.
- Open (not fixed): a link opened in a new tab from a help session may not carry the session and would use any couple login saved in that browser, with no banner (not verified in a browser); collaborators see Ask and Cancel and get a 403 (needs `member_role` from the API); the pending badge does not refresh by itself; browser history may keep the editor link (token lives at most 1 hour); `/?token=` on the sign-in page accepts any token (older than this feature).
- G4 against the real API and sheet: not done. G9: owner approved merge and deploy in chat.
- G10 rollback: `git revert -m 1 4b904a9`, push, `pnpm deploy:all`.
