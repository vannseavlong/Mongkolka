# Kbach ornament kit following the owner's references (badge, divider, corner, band)

- **Repo:** Mongkolka
- **Owner:** SNLRLONG
- **Tier:** T2 · shared package artwork (auto picker, see `PIPELINE.md`)
- **Claimed by:** none
- **Worktree:** `Mongkolka/mongkolka-kbach-kit/` · **Branch:** `feat/kbach-kit`
- **Started / updated:** 2026-11-28 / 2026-11-28
- **Docs:** owner's four reference images (this session): solid gold leaves with cut lines, rosettes, lobed diamonds, spiral curls
- **Depends on:** none
- **Touches:** `packages/templates/src/ornament/kbach/**`, later `sections/covenant/**`

## Goal
Covenant ornaments follow the reference style. No flame shapes on the monogram badge. Original drawings only; the references are not traced.

## Done when
- [x] Owner approves the preview before anything is wired into the site
- [x] Root `CHANGELOG.md` entry added
- [x] Worktree and branch removed after merge

## Progress 2026-11-28 (preview only, not committed, nothing wired into the site)
- `ornament/kbach/lai.tsx`: badge, corner, heading divider, side band. Templates typecheck clean.
- Simpler than the references; matching their density needs vector artwork from an artist or a licensed set.
- Waiting for the owner: approval, colour (rose or gold), where to use the side band.

## Applied 2026-11-28 (not committed, waiting for approval)
- Owner chose rose and asked for badge, corner and divider, to be shown first. Side band not applied.
- Covenant badge, card corners and heading divider now use the kit; the heading divider keeps the cross at its centre; letters use the plain divider. `kbach-crest.tsx` replaced by `lai-ornaments.tsx`.
- Templates 407/407, couple 91/91, web 14/14 (couple/web before the leftover-import cleanup), web and couple builds pass.
- Owner saw page captures (headless Chrome, 390px) before approving.
- Not changed: the fixed gold page corners (old flame-leaf style). Not checked: real phone, other colour themes, guest pages. G5 code review not run.

## Merged (2026-11-28)
Owner approved the page captures and asked to commit, merge, push and deploy. On merged `main`: templates 407/407, couple 91/91, web 14/14, builds pass. In `4-testing`: real phone not checked, G5 code review not run.
