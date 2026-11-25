# API-couple-drive-storage

- **ID:** T-0018
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · OAuth tokens (secrets), identity/permissions, personal data, storage driver (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude (session), 2026-11-25
- **Worktree:** `Mongkolka/couple-drive-storage/` · **Branch:** `feat/couple-drive-storage` (created 2026-11-25)
- **Started / updated:** 2026-11-25 / 2026-11-25
- **Docs:** Tasks/_plans/Web-builder-redesign.md, Docs/tasks/guest-photos.md, Docs/backend-schema.md
- **Depends on:** API-website-assets (introduces `storageFor(coupleId)`); Google OAuth app in production mode with `drive.file` scope
- **Touches:** apps/api/src/services/storage (drive driver, storageFor), modules/couple-drive (new: connect, status, disconnect), modules/media (new: proxy route), modules/guest-photos (move to storageFor), config/env.ts, Docs/backend-schema.md

## Goal
Let a couple store everything uploaded to their site (their own assets and guests' photos) in **their own Google Drive**, using their account token. Other couples (and couples who haven't connected) use the default driver. Risk of Drive quota, rate limits and revoked tokens accepted by the owner (2026-10-28).

Design from the plan:
- Separate **Connect Google Drive** consent (scope `drive.file`, offline access). Never added to portal login.
- Refresh token encrypted at rest with its own key (`DRIVE_TOKEN_KEY`), never logged or returned by any API.
- `storageFor(coupleId)` returns the Drive driver when the couple has an active connection, else the default driver. The driver keeps files in an app-created folder in the couple's Drive.
- Images are served through our own media route (`/media/:coupleId/:assetId`) that streams from Drive with cache headers (and ETag), not by raw Drive URLs.
- Guests are anonymous: their uploads are written to the couple's Drive by the API on the couple's behalf, still obeying the per-guest and platform limits.
- Revoked or expired token: mark connection `needs_reconnect`, serve from cache where possible, fall back to default driver for new uploads (never lose a guest's photo), surface status to the portal.

## Decisions (2026-11-25, owner)
- Use lsdb's `DriveStorageAdapter` (`storage:` option on `createSheetAdapter`, `adapter.withContext(...).upload()/deleteFile()`) as the Drive transport instead of a hand-written Drive client. Placement per couple comes from a `TokenStore` that returns the couple's own tokens; no tokens means shared admin Drive, which we do not want for connected-less couples, so `storageFor()` keeps routing those to the default driver.
- lsdb gives upload and delete only. We still build: Connect/disconnect consent flow (`drive.file`), encrypted `TokenStore` backed by the API (key `DRIVE_TOKEN_KEY`), `needs_reconnect` handling, and the `/media` proxy.
- Serve through our own `/media/:coupleId/:assetId` route (cache headers + ETag), never raw `drive.google.com/thumbnail` URLs. Store the Drive file id, not the lsdb URL, so the route can stream by id.
- Check done 2026-11-25: lsdb upload/delete work against a couple-keyed `TokenStore`, but (a) a `null` from the store silently means the shared admin Drive, so ours throws and only answers for `drive:<coupleId>` ids; (b) lsdb caches each actor's Drive client forever with no public evict, so `lsdb-drive.gateway.ts` clears its private `_actorClientCache` (TODO upstream: `DriveStorageAdapter.evictActor`); (c) lsdb has no download, so reads use `googleapis`; (d) revoked grants arrive as raw Google `invalid_grant` errors, matched in `drive-errors.ts`.
- New dependency: `googleapis@^172` added to apps/api. Why: media reads and token revoke need the Drive API, lsdb has no download. Size: already in the tree (lsdb depends on the same version). Maintained by Google, Apache-2.0.
- Open check (done, see above): confirm `DriveStorageAdapter.delete()` and actor-owned placement work with a `TokenStore` keyed by coupleId, and how a revoked refresh token surfaces (error type) so we can flip the status.

## Progress (2026-11-25)
Built in the worktree, nothing committed: token crypto, `couple_drive_connections` admin table (run `lsdb sync` to create the tab), token store, Drive gateway, `storageFor()` wrapper with fallback, couple-drive module, media route, guest photos moved to `storageFor()` (new key `couples/<id>/guest-photos/<id>.<ext>`; old rows keep their keys). 197 API tests pass, tsc and eslint clean.
Not done: G4 run against a real Google account (needs `DRIVE_TOKEN_KEY`, redirect URI added in the Google OAuth client, `drive.file` consent screen), 50-concurrent load check, disconnect-with-copy, G5 to G11. Web screen is T-0020.

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [x] Connect, status, disconnect endpoints (`/couple/api/drive`, `/drive/connect`, `/drive/callback`); portal redirect contract `/settings/storage?drive=<connected|error code>`
- [ ] Disconnect optionally copies files to the default driver first (not built: today files stay in the couple's Drive and their /media URLs stop working)
- [x] Tokens encrypted (AES-256-GCM, `DRIVE_TOKEN_KEY`, rotation via `_PREV`); core test proves status output has no token material. Logs not yet audited (G6)
- [ ] Upload to Drive, serve through media route, delete — all verified against a real Drive account
- [x] Revoked-token path tested (unit): new uploads fall back, connection flagged `needs_reconnect`
- [x] Media route (`/media/:coupleId/:fileId`): couple B cannot read A's file, 404 for unknown/malformed ids and non-images, ETag + immutable cache headers, per-IP rate limit (unit-tested core)
- [ ] Load check: 50 concurrent image requests for one site stay under Drive rate limits thanks to caching
- [ ] Release plan covers OAuth consent screen in production mode, key rotation, rollback to the default driver
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
