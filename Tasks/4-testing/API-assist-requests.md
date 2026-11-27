# API-assist-requests

- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · permissions, new admin-sheet tables, new public-facing endpoints (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/api-assist-requests/` · **Branch:** `feat/assist-requests`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Docs:** Tasks/_plans/Web-storage-profile-assist.md
- **Depends on:** none
- **Touches:** apps/api/src/modules/assist/ (new: routes, controller, service, model, tests; mounted for couple and admin), seeds/admin.ts or new seed for tables, Docs/backend-schema.md, config route mounting

## Goal
Couples can create, cancel and revoke a help request; admins can list, accept and decline. Contract in the plan (`assist_requests`, `assist_log` tables, routes under `/couple/api/assist` and `/admin/api/assist-requests`).

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security (OWASP + /security-review)  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [x] Tables defined and synced (`npx lsdb sync --table assist_requests,assist_log`, 2026-11-27, admin sheet; read back OK, 0 rows)
- [x] Couple routes: get, create (note 5-500 chars, one open request, 3/day rate limit), cancel, revoke (idempotent)
- [x] Admin routes: list (limit max 50, cursor), accept (+7 days, idempotent), decline with reason
- [x] State machine tested: every illegal transition returns 409; `expired` derived on read
- [ ] Authorization tested: a couple cannot read or touch another couple's request; vendor/couple tokens get 403 on admin routes
- [x] Layering config/controllers/models/modules/services/middlewares/utils respected; validation server side
- [x] `Docs/backend-schema.md` updated
- [ ] Security result recorded in this file (OWASP A01, A04, A07, A09)
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge

## Progress (2026-11-27)
Built in `api-assist-requests/` (branch `feat/assist-requests`, from `feat/assist-integration`), uncommitted.
- Files: `schemas/admin/assist_requests.ts`, `assist_log.ts`, `src/modules/assist/` (core, model, service factory, instance, controller, routes, test), registered in `config/database.ts` and both route files.
- Contract changes from the plan: `POST /couple/api/assist/cancel` and `/revoke` take **no body**; the server acts on the couple's open request (else the newest, so a retry is a no-op). Status `expired` is derived, not stored. Couple activity shows `actor_role` and `action` only, never admin ids.
- G2: `tsc --noEmit` passes. `eslint .` has one pre-existing error in `scripts/seed-mock-couple.ts` (unused import), not in this diff.
- G3: 236/236 API tests pass; 13 new in `assist.test.ts` (transitions, idempotent accept/revoke, 7-day expiry not extended by retry, 3/day limit counted for valid notes only, one open request, cross-couple cancel is 404, suspended couple cannot be accepted, admin list filter/cursor/limit cap, activity hides admin ids).
- Authorization: admin routes sit behind `requireAuth` + `requireRole("admin")` in `admin-api.routes.ts`; couple routes behind `requireActiveCouple`. Not covered by an HTTP-level test (no supertest in the repo).
- Not done: `lsdb sync`, G4 against a real sheet, G5 review and G6 security review (fresh agent), release plan G10. Rate limiter and locks are in-memory, so they assume one API instance (as the other modules do).

## Code review (G5, fresh agent, 2026-11-27) and fixes
No important findings. Fixed: (1) a retry of a finished action now writes the audit row if the first attempt failed after the change; (2) cancel/revoke accept an optional `request_id` that wins over the open-request default, so a late duplicate cannot cancel a newer request; (3) admin list returns 400 for an unknown `status` or a non-date `cursor`, and pushes stored statuses down to the data layer; (4) a suspended couple cannot create a request (403). 242/242 API tests (19 in `assist.test.ts`), typecheck and eslint on the module clean.
Left on purpose: rows with the identical millisecond `requested_at` across a page boundary can be skipped (cursor is the timestamp only); the admin list still reads the whole table (cached 15 s); the daily allowance is spent before the sheet write succeeds.
G5 re-run after the fixes: not done.

## Security review (G6, fresh agent, OWASP Top 10 2021, 2026-11-27)
Result: no way found to get a request approved without an admin, forge a status, or extend or bypass expiry through the API. A03 injection, A05, A06, A10: no issue (Sheets writes are RAW, no query language, no outbound calls). Open findings, not yet fixed:
- F1 medium: admin identity comes from a JWT that never expires and is not rechecked (`password-auth.service.ts` signs with no `expiresIn`; admin routes only check the role claim). Fix: `requireActiveAdmin` on assist routes, `expiresIn` on login tokens.
- F2 medium: any couple member, including a collaborator, can request and cancel. Fix: partner only for create and cancel; revoke stays open to all members.
- F3 medium: `effectiveStatus` stays `approved` when `expires_at` is empty or unparsable. Fix: fail closed.
- F4 low-medium: no generic rate limit on GET/cancel/revoke; each call does full-table reads.
- F5 low: tables and reads grow without bound (follow-up: archive job).
- F6 low: `create` has no audit-row repair if the log write fails; repair row is attributed to the retrying actor; locks are single-instance.
- F7 low: no admin revoke route (add before the session task).
- F8 info: admin and couple UIs must render note, reason and names as text.
- For API-assist-session: reread the request on every assisted call, require live and active couple, bind token to request_id and couple_id, TTL at most `expires_at`, write `open`/`edit` rows before the action, store route pattern not query string in `path`.
G6 stays unticked until F1 to F3 are fixed and the review is re-run.

## Security re-review (G6, fresh agent, 2026-11-27, after fixes)
F1 to F4, F6, F7 confirmed fixed; nothing blocks merging. New findings, not yet fixed:
- M1 medium: tokens issued before the deploy have no `exp` and stay valid; `requireActiveAdmin` covers only the assist routes, so a suspended admin keeps the rest of `/admin/api` until the token ends. Needs a decision: rotate `JWT_SECRET` at deploy (logs everyone out) and/or move `requireActiveAdmin` onto all of `adminApiRouter` (one extra Sheets read per admin call; shared router, outside this task's files).
- M2 medium: the per-user limiter runs after `requireActiveCouple` / `requireActiveAdmin`, which already do the Sheets reads. Move it right after `requireAuth`.
- L1 low: a repaired audit row for accept/decline/cancel/revoke records the retrying actor and time, not `decided_by` / `decided_at`.
- L2 for API-assist-session: `isLive` does not check the couple is still active (a suspended couple keeps a live approval). The token task must re-read the couple and the request on every call and use the real admin id as actor.
- L3 low: a blank `JWT_EXPIRES_IN` makes `jwt.sign` throw, so password login returns 500. Validate or fall back to `7d`.
- Test gaps: `requireActiveAdmin` untested; router wiring (partner guard after couple context) verified by reading only; the repair test uses one actor.

## Paused (2026-11-27)
Owner: ignore the security findings for now and keep the task in todo. Not merged and not deployed. Work stays uncommitted in `Mongkolka/api-assist-requests/` (branch `feat/assist-requests`, from `feat/assist-integration`); it has `.env` and `.lsdb-tokens.json` symlinks into the main checkout. The two tables `assist_requests` and `assist_log` already exist in the admin sheet (synced 2026-11-27). Open security findings M1, M2, L1, L3 above; G5 re-run, G6 and G10 not done.

## Shipped (2026-11-27)
Merged to `main` (b37c7a2) and pushed. Owner chose: API only, couple card stays on `feat/assist-request`.
- G2/G3 on merged `main`: `tsc` and build pass, 304/304 API tests. `pnpm lint` has one earlier error in `scripts/seed-mock-couple.ts`.
- G5/G6: the earlier fresh-agent re-reviews stopped on a usage limit. Replaced by one inline review by a session that did not write the code (diff, session files, token consumers, OWASP A01/A07/A09); no blocking finding. `/security-review` skill not run.
- Open: M1 (owner rotates `JWT_SECRET` on Render); an assisted admin can edit and delete guests, wishes, photos and website content including slug and publish; refused-path rows are bounded only by the 120/min limit; `/couple/api/session` still answers a revoked assist token with the account status.
- G4 not run against the real API or sheet. G9: owner approved merge and deploy in chat.
- G10 rollback: `git revert -m 1` of the merge and push. Tokens already issued die within 1 hour.
