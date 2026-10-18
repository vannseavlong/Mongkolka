# AGENTS.md

Rules for any coding agent (Claude, Codex, sub-agents) working in the `Mongkolka/` workspace. Project layout and commands: `CLAUDE.md`. Each sub-repo may have its own `AGENTS.md`/`CLAUDE.md`; read it when working there. If rules conflict, the sub-repo wins for code style and commands; this file wins for tasks, worktrees, docs and delivery.

## Before you start
1. Read your task in `Tasks/` (its folder is its status) and `Tasks/_inbox/<your-task>/`.
2. Claim the task, work only in its worktree, follow "Working in parallel" in `Tasks/README.md`.
3. Pick the task's **tier yourself** with the auto picker in `Tasks/PIPELINE.md` and write it into the task file. Never ask the developer to choose. The tier decides which checks run before the task moves forward.
4. New feature, new screen or unclear scope? Plan first with the `task-planner` skill: it turns design and requirements into scoped task files in `Tasks/2-todo/`.

## Tasks and worktrees

`Tasks/` holds one file per task; its folder is the status: `1-backlog` → `2-todo` → `3-in-progress` → `4-testing` → `5-done` → `6-deploy`.

- One task = one worktree (`Mongkolka/<repo>-<short-name>/`) = one branch. The repo's main folder is the final checkout and is never deleted.
- Task files are named `<Prefix>-<short-name>.md`; prefixes: `Web`, `API`, `Admin`. Start a task: copy `Tasks/_TEMPLATE.md`, set owner, create the worktree, move the file to `3-in-progress/`. Check `git worktree list` for overlap first.
- Merged to `main`: add an entry to the root `CHANGELOG.md` tagged `[Web]`/`[API]`/`[Admin]` (owner, task, branch/PR, what changed; never a changelog inside a sub-repo), remove the worktree and branch, move the task to `5-done/`. Ask before removing a worktree with uncommitted changes.

**Parallel agents:** one agent = one task file. Claim it (`Claimed by:`) before editing, stay inside that task's worktree and `Touches`, never touch another task's worktree, and never use `git add -A`, `stash` or `reset --hard` in shared places. To reach another task, write a note in `Tasks/_inbox/<to-task>/` and read your own inbox at the start. Full rules: `Tasks/README.md`.

## Delivering a task (pipeline)

Every task has a tier (T0 to T3). The tier decides the gates it passes; see `Tasks/PIPELINE.md`. Do not run gates the tier does not ask for, and do not skip gates it does. Skipping or adding a gate needs one line of reason in the task file. The user can override a tier; the agent does not ask for one.
