# API-assist-session

- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · auth, token issue, permissions middleware, audit trail (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude (session), 2026-11-27
- **Worktree:** `Mongkolka/api-assist-session/` · **Branch:** `feat/assist-session`, cut from `feat/assist-integration` (which now contains feat/assist-requests)
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** API-assist-requests (same module, so sequential)
- **Touches:** apps/api/src/modules/assist/ (assist.session.core/service/guard/instance + test, controller/routes: session endpoint), middlewares/couple-context.middleware.ts (calls the assist guard). Changed from the plan: no `block-when-assisted` middleware and no edits to the members/drive/auth routers; one allow-list in `assist.session.core.ts` decides, in one place

## Goal
Admin can get a 1-hour editor token for an approved, live request. The token acts as the couple's partner member and is re-validated against the DB on every request. Sensitive routes reject it. Mutating requests are logged.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security (OWASP + /security-review)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [x] `POST /admin/api/assist-requests/:id/session` returns `{ token, expires_at, editor_url }`; 409 unless live `approved`; writes an `open` log row
- [x] Token: `role: couple`, `assist: { request_id, admin_id }`, expiry = min(1 h, request `expires_at`); signed with existing JWT secret
- [x] `requireActiveCouple` re-checks request fresh (approved, not revoked, not expired, same couple); otherwise 403 `Assist access ended`
- [x] Allow-list policy (replaces `blockWhenAssisted`) returns 403 on members, Drive connect/disconnect, password/email change, account deletion, assist routes
- [x] Mutating assisted requests append to `assist_log` (method, path, admin, time; no bodies, no tokens)
- [x] Tests: revoke cuts access on the next request; expiry cuts access; token for couple A cannot read couple B; non-assist tokens unchanged
- [ ] Security result recorded here; secret/token never logged
- [ ] G10 release plan: rollback = unmount assist routes, tokens already issued die within 1 h
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `api-assist-session/` (branch `feat/assist-session`, from `feat/assist-integration` which now has feat/assist-requests merged), uncommitted.
- **Endpoint:** `POST /admin/api/assist-requests/:requestId/session` behind `requireActiveAdmin` and the 30/min limiter. Needs a live approved request, an active couple and an active partner; writes the `open` audit row first (no row means no token); token = `{ user_id (first partner, never a collaborator), role: "couple", email, status, assist: { request_id, admin_id, couple_id } }`, lifetime min(1 h, request expiry); `Cache-Control: no-store`; returns `editor_url` = `<COUPLE_FRONTEND_URL>/dashboard#assist=<token>`.
- **Every request with the claim** (checked in `requireActiveCouple`, once per request even though several routers run the guard): fresh read of the request (live, same couple), the couple (active) and the admin (still an active admin), else 403 `Assist access ended`; a malformed claim is refused, not treated as a normal login.
- **Allow-list, not a block-list** (security review advice, plan said block-list): by first path segment under `/couple/api`. Writes allowed: profile, website, guests, budget-categories, checklist-items, milestones, photos, wishes. Read-only: members, drive, assist, overview, session. Anything else, including any route added later, is refused. Path is lower-cased, slashes collapsed, query and hash dropped before matching (Express routes ignore case).
- **Audit:** each mutating assisted request writes `edit` (method, path pattern with ids replaced, no query string, no body, no token) before the action runs; if the row cannot be written the request is refused (500).
- G2: `tsc` and eslint on the module pass. G3: 288/288 API tests, 41 new in `assist.session.test.ts` (claim parsing, ttl, acting member choice, policy incl. case/slash/query bypass attempts, audit path, open session refusals and ordering, access check for revoke, expiry, other couple, demoted admin, guard once-per-request, refuses a change it cannot log, real JWT expiry round trip).
- Product decision to confirm: website `publish`, `unpublish` and `slug` are allowed for an admin (assisted editing includes publishing; a slug change changes the public URL). Say if they should be blocked.
- Not covered: the real routers and the real `requireActiveCouple` against the sheet (no HTTP-level test; the guard is tested through its factory), G4 against the real API, G5 review and G6 security review (fresh agents), G7 beyond the inbox notes, G10 text (rollback: unmount the session route and the guard call; tokens already issued die within an hour or at the request's expiry), G11, commit.
- Carried over from the earlier security review and still open in API-assist-requests: M1 (legacy tokens never expire, `requireActiveAdmin` only on assist routes), M2 (limiter after the Sheets reads), L1, L3. M1 matters more now: a stale admin token can open editors. The per-use admin check above covers the assisted token itself, not the session endpoint, which does have `requireActiveAdmin`.

## Shipped (2026-11-27)
Merged to `main` (b37c7a2) and pushed. Owner chose: API only, couple card stays on `feat/assist-request`.
- G2/G3 on merged `main`: `tsc` and build pass, 304/304 API tests. `pnpm lint` has one earlier error in `scripts/seed-mock-couple.ts`.
- G5/G6: the earlier fresh-agent re-reviews stopped on a usage limit. Replaced by one inline review by a session that did not write the code (diff, session files, token consumers, OWASP A01/A07/A09); no blocking finding. `/security-review` skill not run.
- Open: M1 (owner rotates `JWT_SECRET` on Render); an assisted admin can edit and delete guests, wishes, photos and website content including slug and publish; refused-path rows are bounded only by the 120/min limit; `/couple/api/session` still answers a revoked assist token with the account status.
- G4 not run against the real API or sheet. G9: owner approved merge and deploy in chat.
- G10 rollback: `git revert -m 1` of the merge and push. Tokens already issued die within 1 hour.
