# Public site scale + guest photo uploads

Planned (not built). Tracked as Phase 8 in [TODO.md](../../TODO.md).

## Storage layout today
- Admin sheet: `users`, `couples` (slug, `actor_sheet_id`, `website_status`),
  `couple_members`, `site_templates`, `section_components`, `themes`, ...
- Per-couple sheet: `couple_profile`, `website_sections`, `guests`, budget/checklist/
  milestones. Created at approval via `createUserSheet`.
- A public view of `/{slug}` reads 4 tabs (couples, site_templates in admin; profile,
  sections in the couple sheet). RSVP writes to the couple's `guests`.

## Problem
Sheets quota (~60 reads and ~60 writes/min per OAuth user) is shared by every request
via the single admin grant. Visitors must not cost a sheet read each, and guest photo
uploads must not cost one sheet write each.

## Design
1. **Split the page by change rate.** Shell (profile, sections, template, theme) changes
   only on couple edit/publish -> cache hard, invalidate in the save/publish paths.
   Photos change constantly -> separate endpoint, short TTL, never invalidates the shell.
2. **Shell cache**: in-memory per slug, ~5 min TTL + explicit delete on edit/publish.
   Breaks with multiple API instances (use Redis or short TTL) and with direct human
   edits to a sheet (consider `shareWithActor: false` / `shareRole: 'reader'`).
3. **Photos**: files do NOT go in Sheets. Browser uploads via presigned URL to object
   storage; API then registers metadata (one `guest_photos` row). Drive is possible via
   `adapter.upload()` but is expected to throttle on heavy gallery hotlinking (untested).
4. **Couple-configurable settings** (stored on `couple_profile`, read per request from the
   cached shell): `photo_uploads` off|auto|pending, per-guest max, max size, per-IP rate.
   Platform ceilings cap what couples can set. `auto` -> status approved; `pending` ->
   hidden until approved in the portal; `off` -> 403. Gallery returns `approved` only.
5. **Unpredictable burst writes**: queue metadata rows in memory, flush every 2–5s per
   couple with one `createMany` (single API call, per longcelot-sheet-db README), retry
   with backoff on 429, flush on shutdown. Risk: crash loses queued rows while files
   exist in storage -> periodic reconcile or write storage key first.
6. **Couple can delete photos** (any status, single or bulk) from the portal. Delete
   removes the `guest_photos` row and the stored file, and evicts the photo from the
   cached gallery immediately. Order: mark/remove the row first, then delete the file;
   if the file delete fails, log it for a reconcile sweep rather than resurrecting the
   photo. A photo still in the write queue is cancelled, and its file deleted. Only
   the owning couple (via `coupleActorSheetId`) may delete; guests cannot.
7. **Abuse limits** in memory keyed `slug+IP` (venue Wi-Fi shares IPs, so also count by
   guest cookie/name), size cap, MIME allowlist. Move counters to Redis if scaling out.

## Escape hatches (not now)
- `actorClientForCrud` (0.1.48) for per-couple quota — no upstream tests yet, test first.
- SQL adapter for hot tables only (photo metadata, RSVPs).

## Not worth doing
- `prefetch` on the public route (reads already parallel; response cache removes them).

## Build order
8.1 shell cache -> 8.2 settings -> 8.3 schema + presign + batched writer ->
8.4 moderation UI + gallery -> 8.5 limits -> 8.6 RSVP hardening.
Steps 8.1 and 8.2 do not depend on the storage decision.

## Open
Storage backend choice (R2/S3 recommended vs Drive).
