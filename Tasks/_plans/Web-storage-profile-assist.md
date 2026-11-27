# Plan: storage page + profile upload + admin-assisted editing

Date: 2026-11-27 · Owner: SNLRLONG · Status: planned, nothing built

## Goal
1. The couple **Storage** page also shows the couple's image library and looks polished.
2. The couple **Profile** page lets the couple upload or pick their cover and venue photos (today they paste a URL) and has a cleaner layout.
3. A couple can **ask Mongkolka for help**; an admin accepts and can then edit that couple's site for **7 days**. The couple can revoke at any time. Every assisted action is logged. (Decision by the user, 2026-11-27: request + time-limited access.)

## Flow

### A. Storage page (`/settings/storage`)
| Step | State |
|---|---|
| Page shows Drive connect card | exists (`features/storage`, on `main`) |
| Header + storage summary (images used / limit, size total, where files live) | new |
| Image library (upload, browse, delete) below or beside the Drive card | new (reuse `AssetLibrary`, manage-only: no `onPick`) |
| Two columns at `lg`, stacked at 360px | new |

### B. Profile (`/profile`)
| Step | State |
|---|---|
| Cover photo: URL text input + preview | change: preview becomes a button "Change photo" opening `AssetPicker` (single) + "Remove" |
| Venue photo: URL text input | change: same control, 4:3 preview |
| Picked URL goes into the form value, saved with "Save changes" | change (consistent with the rest of the page; the builder's `saveProfileImage` saves instantly, the profile page does not) |
| Section layout: sticky section nav on desktop, cards grouped (Couple, Photos, Story, Events, Venue, Members) | change |
| Help card "Ask Mongkolka to help" | new, see C |

### C. Assisted editing
1. Couple opens Profile, taps **Ask Mongkolka to help**, writes a note (what they need), submits. (new)
2. API stores an `assist_requests` row, status `pending`. One open request per couple. (new)
3. Admin sees it in the admin app ("Help requests"), reads the note, **Accepts** or **Declines** with a reason. (new)
4. On accept: `expires_at = now + 7 days`, status `approved`. Couple sees "Mongkolka is helping you until <date>" with **Revoke**. (new)
5. Admin clicks **Open editor**. API issues a short-lived (1 h) token: `role: couple`, couple's partner member, plus claim `assist: { request_id, admin_id }`. The admin app opens the couple app with the token in the URL **fragment**. (new)
6. Couple app reads the fragment once, removes it, stores the token in **sessionStorage** (never the couple's own localStorage login) and shows a fixed banner "Editing <couple> as Mongkolka admin · ends <time> · Exit". (new)
7. Every request carrying the `assist` claim is re-checked against the DB (approved, not revoked, not expired). Revoke or expiry cuts access on the next request. (new)
8. Every mutating request under assist is written to `assist_log`. The couple sees "Recent help activity" in the same card. (new)

## Data and API (contract; backend rules from AGENTS.md applied)

Source of truth: two new admin-sheet tables (sheet-db, `npx lsdb sync` before seeding).

`assist_requests`: `request_id` (unique), `couple_id`, `note`, `status` (`pending|approved|declined|revoked|expired|cancelled`), `requested_by` (user_id), `requested_at`, `decided_by` (admin user_id), `decided_at`, `decline_reason`, `expires_at`, `revoked_at`.
`assist_log`: `log_id` (unique), `request_id`, `couple_id`, `admin_id`, `method`, `path`, `at`.

Dates are ISO UTC strings. `expired` is derived on read (`expires_at < now`), not written by a job.

| Caller | Route | Notes |
|---|---|---|
| couple | `GET /couple/api/assist` | latest request + last 20 log rows. Empty = `{ request: null, activity: [] }` |
| couple | `POST /couple/api/assist` `{ note }` | note 5 to 500 chars, trimmed. 409 if a `pending` or live `approved` request exists. Rate limit 3 per day per couple (`utils/rate-limit`) |
| couple | `POST /couple/api/assist/cancel` | only while `pending` |
| couple | `POST /couple/api/assist/revoke` | only while `approved`. Idempotent: revoking a revoked request returns 200 |
| admin | `GET /admin/api/assist-requests?status=&cursor=&limit=` | limit max 50, newest first; couple names joined server side |
| admin | `POST /admin/api/assist-requests/:id/accept` | only `pending`. Sets `expires_at` (+7 days), idempotent on repeat |
| admin | `POST /admin/api/assist-requests/:id/decline` `{ reason }` | only `pending` |
| admin | `POST /admin/api/assist-requests/:id/session` | only live `approved`. Returns `{ token, expires_at, editor_url }`. Writes an `open` log row |

Rules (server-enforced, client is UX only):
- Assist token resolves the couple through `requireActiveCouple`, which gets a new branch: when the JWT has `assist`, load the request fresh and 403 `Assist access ended` unless `approved`, not revoked, not past `expires_at`, and `couple_id` matches the member's couple.
- The assist token never carries `partner` rights for: couple members (invite/remove), Drive connect/disconnect, password or email change, account deletion, assist routes themselves. A `blockWhenAssisted` middleware on those routers returns 403.
- Token lifetime: 1 hour, never beyond `expires_at`. Admin re-opens the editor to get a new one.
- No assist data in any public site response. Tokens and fragments are never logged. `assist_log` stores method and path only, no bodies.
- Existing data: new tables only; no migration. Backward compatible: tokens without `assist` behave as today.
- Cost: one extra admin-sheet read per assisted request (tables prefetched with the existing `adminContext().prefetch`).

Alternative considered: permission toggle with no expiry. Rejected by the user (broad, no audit).
Alternative cost: full admin login-as via the couple's password reset: no audit, rejected.

## Gaps and decisions
- No admin-acts-as-couple mechanism exists. Decision: assist claim on a normal couple JWT, resolved in `requireActiveCouple` (smallest change, reuses all couple routes).
- Which member does the admin act as? Decision: the couple's `partner` member with the lowest `joined_at`; the audit row records the real admin id.
- Couple app keeps its token in `localStorage`. Decision: assist token goes to `sessionStorage`, read first by `getToken()`, so the admin's own browser session is not mixed with a real couple login and closing the tab ends it.
- Admin app and couple app are separate origins; handoff via URL fragment (never sent to servers or logged).
- Profile has no partner photo field. Decision: out of scope (backlog), only `cover_photo_url` and `venue_image_url` exist.
- Storage summary has no server total. Decision: derive count and bytes from the assets list (`size_bytes`), limit from `/website/assets/limits`.
- Drive: `Web-couple-drive-connect` (claimed, worktree `couple-drive-connect`) still lists `features/storage` in its Touches. Storage screen is already on `main`. Decision: `Web-storage-library` starts after that task merges or after its owner confirms in the inbox; a note was left in its inbox.
- Email/notification to admin on a new request: not in sources. Decision: admin inbox badge only (backlog: email).

## Open questions (recommendation first)
1. Assist length: 7 days fixed? Recommend yes, fixed; admin can ask the couple to request again.
2. Should the couple get an email when an admin opens the editor? Recommend backlog; the in-app activity list covers it.
3. Can an admin accept their own test couple? Recommend yes, no special case.

## Task breakdown
| # | Task | Repo | Depends on | Tier | Size |
|---|---|---|---|---|---|
| 1 | Web-storage-library | apps/couple | Web-couple-drive-connect merged | T2 | S-M |
| 2 | Web-profile-enhance | apps/couple | none | T2 | M |
| 3 | API-assist-requests | apps/api | none | T3 | M |
| 4 | API-assist-session | apps/api | 3 | T3 | M |
| 5 | Admin-assist-requests | apps/admin | 3 (list, accept, decline); 4 (open editor) | T3 | M |
| 6 | Web-couple-assist-request | apps/couple | 2, 3 | T2 | S |
| 7 | Web-couple-assist-session | apps/couple | 4, 5 | T3 | M |

Parallel now: 1, 2, 3 (different files). Then 4 (same module as 3, so after). Then 5 and 6 in parallel. Then 7.
One feature split across tasks: use integration branch `feat/assist-integration` for tasks 3 to 7 (AGENTS.md "Big feature"); tasks 1 and 2 go straight to `main`.
Security (G6): tasks 3, 4, 5, 7 (OWASP A01 broken access control, A07 auth, A09 logging; run `/security-review` on the combined diff in the integration branch).

## Out of scope
Partner photo field, email notifications, admin editing other apps (vendor), per-section permissions, admin chat, extending an approval without a new request, impersonation of vendors.
