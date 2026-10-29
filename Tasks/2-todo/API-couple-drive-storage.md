# API-couple-drive-storage

- **ID:** T-0018
- **Repo:** apps/api
- **Owner:** SNLRLONG
- **Tier:** T3 · OAuth tokens (secrets), identity/permissions, personal data, storage driver (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/couple-drive-storage/` · **Branch:** `feat/couple-drive-storage` (created when it moves to 3-in-progress)
- **Started / updated:** not started / 2026-10-28
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

## Gates
- [ ] G1 scope  - [ ] G2 static  - [ ] G3 tests (new + edge cases)  - [ ] G4 run it
- [ ] G5 code review (strict)  - [ ] G6 security  - [ ] G7 docs sync
- [ ] G8 PR message  - [ ] G9 human review  - [ ] G10 release plan  - [ ] G11 changelog

## Done when
- [ ] Connect, status, disconnect endpoints; disconnect optionally copies files to the default driver first
- [ ] Tokens encrypted; a test proves they never appear in responses or logs
- [ ] Upload to Drive, serve through media route, delete — all verified against a real Drive account
- [ ] Revoked-token path tested: new uploads fall back, status flips to `needs_reconnect`
- [ ] Media route: couple A cannot read couple B's files; 404 for unknown ids; cache headers set
- [ ] Load check: 50 concurrent image requests for one site stay under Drive rate limits thanks to caching
- [ ] Release plan covers OAuth consent screen in production mode, key rotation, rollback to the default driver
- [ ] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
