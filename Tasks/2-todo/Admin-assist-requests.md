# Admin-assist-requests

- **Repo:** apps/admin
- **Owner:** SNLRLONG
- **Tier:** T3 · issues impersonation tokens and hands them to another app (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/assist-requests-admin/` · **Branch:** `feat/assist-requests-admin`
- **Started / updated:** - / 2026-11-27
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
- [ ] List with status tabs (pending, approved, closed), couple name, note, requested date, expiry
- [ ] Accept and Decline (reason required) with confirmation; loading, empty, error, no-permission states
- [ ] Open editor: calls the session endpoint, opens the couple app with the token in the URL **fragment** (`#assist=`), never in the query string, never stored in admin storage
- [ ] Open editor disabled once the request is expired or revoked
- [ ] Pending count badge in the sidebar
- [ ] Narrow-width check at 360px
- [ ] Mocks removed before merge
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
