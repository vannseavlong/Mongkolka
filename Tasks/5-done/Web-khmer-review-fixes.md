# Web-khmer-review-fixes

- **ID:** T-0050
- **Repo:** apps/api, packages/templates (chrome), docs
- **Owner:** SNLRLONG
- **Tier:** T3 · hardens server-side validation of payment/account data and public URLs (auto picker, see `PIPELINE.md`)
- **Claimed by:** Claude fork, 2026-11-22
- **Worktree:** `Mongkolka/mongkolka-khmer-review-fixes/` · **Branch:** `feat/khmer-review-fixes` (from `feat/khmer-einvite-integration`)
- **Started / updated:** 2026-11-22 / 2026-11-22
- **Docs:** cold review (G5) of `main...feat/khmer-einvite-integration`, `docs/backend-schema.md`
- **Depends on:** Web-khmer-section-keys, Web-khmer-chrome, Web-khmer-skeleton, Web-khqr-gift (all merged locally)
- **Touches:** `apps/api/src/utils/section-content.ts`, `apps/api/src/modules/couple-website/couple-website.service.ts`, `apps/api/tests/khmer-section-content.test.ts`, `packages/templates/src/chrome/{config,audio,use-background-music,use-site-chrome,chrome-styles,chrome.test}`, `docs/backend-schema.md`, G10 notes in sibling task files. NOT `sections/khmer/` (core-sections task).

## Findings, verified against the code
| # | Finding | Real? | Fix |
|---|---|---|---|
| 1 | `updateSection` validated content against the stored `section_key` but wrote the whole body, so `section_key:"registry"` re-typed a section and skipped validation | **Yes** | Patchable fields whitelisted (`component_id, color_override, display_order, enabled, content`); `section_key`/`section_id`/etc. ignored. Regression tests. |
| 2 | Registry `links` carried over unvalidated (`javascript:` reached `href`) | **Yes** | `cleanLinks`: object shape, label <= 80, https-only url, max 20; empty rows dropped. Tests. |
| 3 | `registry_khqr` selected by no template | Yes, **deferred by design** | Each skin task sets `registry: "registry_khqr"` in its own seed block; seeds untouched here. |
| 4 | New columns dropped silently until `lsdb sync` | Yes (process risk) | Release-order checklist added to `docs/backend-schema.md` and the G10 sections of the section-keys, skeleton and gift task files. No runtime change. |
| 5 | `startsAt` not calendar-validated (`2026-02-31`, `T24:00`) | **Yes** | `isRealDateTime` checks day, hour, minute, second, offset parts. Tests. |
| 6 | `resolveChrome` trusted stored JSON | **Yes** | Every field type-checked, kinds/density/icon/corner whitelisted; malformed data turns a feature off, never throws. Test. |
| 7 | 360px dock labels could overlap | Plausible, fixed defensively | Ellipsis on labels, `min-width:0`, 9px labels under 400px. Not verified visually. |
| 8a | Music status stayed `playing` after `src` change | **Yes** | New `reset` event in the reducer, dispatched in the cleanup. Test. |
| 8b | Any gate button/link primed music, even a language toggle | Theoretical today (no gate has one) | `shouldPrimeMusic`: `data-mk-open` primary action wins, `data-mk-no-music` opts out, fallback unchanged. Test. |
| 9a | `validateHttpsUrl` stored the raw string, allowed `user:pass@` | **Yes** | Stores `url.href`, rejects credentials. Tests. |
| 9b | Duplicate agenda dates give duplicate React keys | Yes | Rejected server-side ("listed twice"). The component (`sections/khmer/Agenda.tsx`) should still key by `date + index`; not touched here. |

## Gates
- [x] G1 scope  - [x] G2 static (tsc clean in templates + api; eslint clean on changed files)  - [x] G3 tests (api 142/142, templates 36/36)
- [ ] G4 run it (dock at 360px not checked in a browser)  - [ ] G5 review (author = same agent family; needs a fresh reviewer)
- [x] G6 security (see below)  - [x] G7 docs sync  - [x] G8 commit (local)  - [ ] G9 human review (required, T3)  - [x] G10 checklist added  - [ ] G11 changelog

## G6 security review of this diff (done inline; the skill run targeted the merged integration diff and wants sub-agents, which a fork cannot spawn)
No finding at confidence >= 8.
- Auth/authz: update stays scoped by `actorSheetId`; the whitelist removes a way to change a section's identity. Improved.
- Injection/XSS: registry links, `map_url`, `venue_image_url`, `khqrImageUrl` are now https-only, normalised, no credentials; rendering is React (no `dangerouslySetInnerHTML`).
- Remaining, unchanged by this task: `component_id`, `color_override`, `enabled`, `display_order` are still written without type validation (pre-existing); `khqrImageUrl` accepts any https host (IP leak to a third-party host, low).
- Chrome config: DB-stored JSON can no longer throw during render; `music.src` still has to pass `isDirectAudioUrl`.
- Logging: nothing new logs account numbers or bodies.

## Not verified
Browser check of the dock at 360px, the couple editor showing the new 400 messages, real sheet write/read-back.

## Done when
- [x] Findings verified and fixed or explained
- [ ] G5 fresh review, G9 human review, root `CHANGELOG.md` entry, worktree and branch removed after merge
