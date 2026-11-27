# Web: share preview per couple (build-time)

- **Repo:** web
- **Owner:** SNLRLONG
- **Tier:** T3 · build/release step, publishes couple names and photo in static HTML (auto picker)
- **Claimed by:** none (deployed; X check and reviews open)
- **Worktree:** `Mongkolka/mongkolka-share-previews/` · **Branch:** `feat/share-previews`
- **Started / updated:** 2026-11-27 / 2026-11-27
- **Depends on:** none (reads existing `GET /public/api/site/:slug`)
- **Touches:** `apps/web/scripts/share-preview*`, `apps/web/package.json`, `apps/web/.gitignore`, `apps/web/README.md`

## Goal
A shared couple link shows the couple's hero photo, names and date instead of the Mongkolka image.

## Decision
Owner chose build-time pages (stay on free Spark) over a Firebase Function (needs Blaze). Previews update only on build + deploy.

## Gates
- [x] G1 scope
- [x] G2 static: eslint on `scripts`, `next build`
- [x] G3 tests: `pnpm test` 14 pass
- [ ] G4 run it: deployed 2026-11-27 for `vutha-nita`; live tags and photo checked with curl, page opens in a desktop browser. Owner confirmed Telegram works after its cache refreshed. Not checked on X or at 360px
- [ ] G5 code review: not run; owner asked to commit and deploy
- [ ] G6 security: not run; same
- [x] G7 docs sync: `apps/web/README.md`
- [x] G8 commit message  - [ ] G9 human review
- [ ] G10 release plan (draft): add slugs, build, deploy hosting, check one link in Telegram and X. Rollback: empty the list, rebuild, deploy
- [x] G11 changelog

## Open
- Every web deploy needs `apps/web/share-previews.txt` (only in the main checkout), or the previews are lost
- The browser tab title reads "Mongkolka" after the page loads; crawlers get the couple title
- One build in the worktree failed in Next's Google Fonts step; the retry passed
- English text only; Khmer wording not done
- Photo is not cropped to 1200x630
- `/<slug>/gallery`, `/wishes`, `/photos` and custom domains keep the default preview

## Done when
- [ ] A real couple link shows its photo in Telegram and X
- [x] Root `CHANGELOG.md` entry added
- [ ] Worktree and branch removed after merge
