# Web-couple-assist-session

- **ID:** T-0067
- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T3 · auth token handling, session storage, permissions in the UI (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude (session), 2026-11-27
- **Worktree:** `Mongkolka/assist-session-web/` · **Branch:** `feat/assist-session-web` (removed after merge)
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** API-assist-session; Admin-assist-requests
- **Touches:** apps/couple/src/lib/auth.ts (token source), new features/assist/components/assist-banner.tsx, app/(dashboard)/layout.tsx (mount banner), UI hiding for blocked areas (members, storage connect)

## Goal
The couple app accepts an admin's assist token from the URL fragment, keeps it in sessionStorage only, shows a permanent banner with time left and Exit, and hides the actions the API will reject.

## Gates
- [x] G1 scope  - [x] G2 static  - [x] G3 tests (new + edge cases)  - [ ] G4 run it
- [x] G5 code review (strict)  - [x] G6 security (OWASP + /security-review)  - [ ] G7 docs sync
- [x] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [x] G11 changelog

## Done when
- [x] Fragment `#assist=<token>` read once, then removed with `history.replaceState`; not written to localStorage, logs or analytics
- [x] `getToken()` prefers the sessionStorage assist token; Exit clears it and returns to the admin app
- [x] Banner on every dashboard page: couple name, time left, Exit; role=status
- [x] On 403 `Assist access ended`: clear token, show a clear message, no retry loop
- [x] Members, Drive connect/disconnect and account actions hidden or disabled with a reason (server still enforces)
- [x] Tests for token source order and fragment parsing
- [x] Security result recorded here (token in URL fragment, XSS exposure of sessionStorage, referrer leakage)
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `assist-session-web/` (branch `feat/assist-session-web`, from `feat/assist-integration` = main), uncommitted.
- `lib/assist-session.ts` (store, pure), `lib/auth.ts` (token source, one place for auth failures), `instrumentation-client.ts` (captures and strips the fragment before the router starts), banner, ended screen, members and Drive actions hidden, sidebar "Sign out" becomes "Exit help session".
- Rule added: a help tab never falls back to the couple login stored in that browser, also after access ends or the link is bad.
- `NEXT_PUBLIC_ADMIN_URL` is optional; defaults to admin-mongkolka.web.app in production and localhost:3001 in dev.
- The banner reads the couple's names from /profile, so the couple's activity shows a "looked at your profile" row.
- G2: `tsc`, eslint (0 errors, 3 earlier warnings), static build pass. G3: 72/72, 16 new. G4: production export in Chrome against a throwaway stub: fragment stripped, requests use the assist token, own login untouched, members and Drive read-only, cut access shows the ended screen and a reload sends no requests, 360px, Exit.
- Not checked: the real API; the website builder with the banner (height now subtracts it, not seen); uploading during a session; expiry while open (unit test only); the sidebar exit dialog; dev server.
- Security notes for G6: sessionStorage is readable by any script on this origin; the browser's own history may keep the original URL with the token (valid at most 1 hour, re-checked on every request) because the handoff is a URL fragment. Closing that needs a one-time code exchange in the API.
- **Open before release:** the "Ask Mongkolka to help" card (feat/assist-request) must hide its ask/cancel/revoke buttons in a help session (the API already refuses them). Do it when the branches meet in integration.
- Not done: G5, G6, G7 to G11, commit.

## Shipped (2026-11-27)
Merged to `main` (4b904a9) through `feat/assist-integration`, pushed and deployed. Worktrees and branches removed.
- G2/G3 on merged `main`: `tsc` pass; couple 88/88, admin 13/13, API 304/304; production build pass (Google Fonts fetch failed on some attempts, retry passed).
- G5: separate review agent, no blocker. Fixed: help card stayed stale until reload; header blur lost for all couples; section jumps hid under the banner.
- G6: /security-review with a separate agent, no HIGH or MEDIUM finding.
- Open (not fixed): a link opened in a new tab from a help session may not carry the session and would use any couple login saved in that browser, with no banner (not verified in a browser); collaborators see Ask and Cancel and get a 403 (needs `member_role` from the API); the pending badge does not refresh by itself; browser history may keep the editor link (token lives at most 1 hour); `/?token=` on the sign-in page accepts any token (older than this feature).
- G4 against the real API and sheet: not done. G9: owner approved merge and deploy in chat.
- G10 rollback: `git revert -m 1 4b904a9`, push, `pnpm deploy:all`.

## Status and what is left (2026-11-27)
- Live: merged and deployed. Why still in `4-testing`: never run against the real API and Google Sheet.
- Test with a test couple: send a request, accept it, Open editor, make a change, end the help as the couple, check the admin tab stops.
- Owner: set a new `JWT_SECRET` on Render (not confirmed yet).
- Render: one deploy built, then failed with "Port scan timeout, no open ports" (commit not recorded). The earlier version kept serving; the API starts normally in a local run of the same code. Retry with "Clear build cache & deploy" (not confirmed yet).
- Security result: `/security-review` on the integration diff, no HIGH or MEDIUM finding (token handling, malicious link, account fallback in the same tab, XSS, navigation).
- Check first: a link opened in a new tab from a help session may not carry the session and would use a couple login saved in that browser, with no banner (not verified in a browser). Admins should stay in one tab until checked.
- Known: browser history may keep the editor link (token lives at most 1 hour). Closing it needs a one-time code exchange in the API.
- Follow-up, older than this feature: `/?token=` on the sign-in page accepts any token.
- Touched more than planned: `lib/api.ts`, the upload client, website builder height, storage cards, sidebar, profile offsets.
- Not checked: website builder with the banner, uploading during a session, sidebar exit dialog.
- Gates open: G4 (stub only), G7, G9, G10.
