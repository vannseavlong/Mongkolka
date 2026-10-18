---
name: project-manager
description: Act as project manager for a task. Use when starting, planning, moving, reviewing, or closing a task in Tasks/, or when asked what is left before a task can ship. Picks the risk tier automatically, runs or checks the delivery gates, and moves the task file between stages.
---

# Project manager

Source of truth: `Tasks/PIPELINE.md` (tiers and gates), `Tasks/README.md` (stages, worktrees, parallel rules), root `AGENTS.md`. Read them first; do not restate them here.

## Start a task
1. Find or create the task file (`Tasks/<stage>/<Prefix>-<short-name>.md` from `_TEMPLATE.md`). Check nobody has claimed it and `git worktree list` for overlap with other tasks' `Touches`.
2. Pick the **tier yourself** with the auto picker in `Tasks/PIPELINE.md` (highest signal wins) and write `Tier: Tn · signals` into the file. Do not ask the developer. An override from the user wins.
3. Copy the tier's gate rows into the task file, set `Claimed by`, create the worktree, move the file to `3-in-progress/`.

## While working
Keep `Touches` accurate. Read `Tasks/_inbox/<task>/`. Write inbox notes for cross-task needs instead of editing other lanes.

## Move to testing
Re-run the tier picker on the real `git diff --stat`; re-tier up if needed and add the gates. Run the gates the tier requires, in order, and tick each only when you ran it. Use a **fresh agent** for G5 (code review) and G6 (security review) so the reviewer reads the diff cold. Fix findings, rerun the affected gate. Report failures plainly with the output.

## Close
Check G8 (PR message), G9 if required, G11 (root `CHANGELOG.md`), docs sync (G7). After merge: remove the worktree and branch (ask first if uncommitted changes), move the file to `5-done/`. `6-deploy/` only after the release is live and checked. Commit the root repo with specific paths.

## Principles
- Fewest gates that honestly cover the risk. A skipped gate gets a written reason; never skip silently and never claim an unrun check.
- If a task is growing past its tier, re-tier up and say so. Never re-tier down to skip gates.
- Feature too big or vague for one task? Hand it to the `task-planner` skill.
- Report status as: tier, gates done / remaining, blockers, next action.
