# Web-couple-assist-session

- **Repo:** apps/couple
- **Owner:** SNLRLONG
- **Tier:** T3 · auth token handling, session storage, permissions in the UI (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/assist-session-web/` · **Branch:** `feat/assist-session-web`
- **Started / updated:** - / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** API-assist-session; Admin-assist-requests
- **Touches:** apps/couple/src/lib/auth.ts (token source), new features/assist/components/assist-banner.tsx, app/(dashboard)/layout.tsx (mount banner), UI hiding for blocked areas (members, storage connect)

## Goal
The couple app accepts an admin's assist token from the URL fragment, keeps it in sessionStorage only, shows a permanent banner with time left and Exit, and hides the actions the API will reject.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security (OWASP + /security-review)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Fragment `#assist=<token>` read once, then removed with `history.replaceState`; not written to localStorage, logs or analytics
- [ ] `getToken()` prefers the sessionStorage assist token; Exit clears it and returns to the admin app
- [ ] Banner on every dashboard page: couple name, time left, Exit; role=status
- [ ] On 403 `Assist access ended`: clear token, show a clear message, no retry loop
- [ ] Members, Drive connect/disconnect and account actions hidden or disabled with a reason (server still enforces)
- [ ] Tests for token source order and fragment parsing
- [ ] Security result recorded here (token in URL fragment, XSS exposure of sessionStorage, referrer leakage)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
