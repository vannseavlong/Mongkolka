# API-assist-session

- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · auth, token issue, permissions middleware, audit trail (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/assist-session/` · **Branch:** `feat/assist-session`
- **Started / updated:** - / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** API-assist-requests (same module, so sequential)
- **Touches:** apps/api/src/modules/assist/ (session endpoint, log), middlewares/couple-context.middleware.ts (assist branch), new middlewares/block-when-assisted.middleware.ts, mounts on couple-members, couple-drive, auth password routes

## Goal
Admin can get a 1-hour editor token for an approved, live request. The token acts as the couple's partner member and is re-validated against the DB on every request. Sensitive routes reject it. Mutating requests are logged.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security (OWASP + /security-review)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] `POST /admin/api/assist-requests/:id/session` returns `{ token, expires_at, editor_url }`; 409 unless live `approved`; writes an `open` log row
- [ ] Token: `role: couple`, `assist: { request_id, admin_id }`, expiry = min(1 h, request `expires_at`); signed with existing JWT secret
- [ ] `requireActiveCouple` re-checks request fresh (approved, not revoked, not expired, same couple); otherwise 403 `Assist access ended`
- [ ] `blockWhenAssisted` returns 403 on members, Drive connect/disconnect, password/email change, account deletion, assist routes
- [ ] Mutating assisted requests append to `assist_log` (method, path, admin, time; no bodies, no tokens)
- [ ] Tests: revoke cuts access on the next request; expiry cuts access; token for couple A cannot read couple B; non-assist tokens unchanged
- [ ] Security result recorded here; secret/token never logged
- [ ] G10 release plan: rollback = unmount assist routes, tokens already issued die within 1 h
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
