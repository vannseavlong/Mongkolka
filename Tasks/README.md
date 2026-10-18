# Tasks

One file per task, moved between folders as it progresses. The folder is the status.

| Folder | Meaning | Move here when |
|---|---|---|
| `1-backlog/` | Idea or later; not scheduled | Captured, no decision yet |
| `2-todo/` | Decided, ready to start | Scope and owner agreed |
| `3-in-progress/` | Being built in a worktree | Worktree + branch created |
| `4-testing/` | Built; checks and QA running | PR open or merged to the integration branch |
| `5-done/` | Merged to `main`, changelog written, worktree deleted | Tested and merged |
| `6-deploy/` | Released | Live in production |

## Planning
`Tasks/_plans/<Prefix>-<feature>.md` holds the plan for a feature (flow, scope, task breakdown, open questions). Written by the `task-planner` skill before tasks go to `2-todo/`.

## File name
`<Prefix>-<short-name>.md`, prefixes: `Web`, `API`, `Admin`. Copy `_TEMPLATE.md`.

## Worktree rules
- The repo's main folder is the **final** checkout. Never delete it.
- One task = one worktree = one branch, as a sibling folder: `Mongkolka/<repo>-<short-name>/`, branch `feat/<short-name>`.
- When merged: delete the worktree (`git worktree remove <path>`), delete the branch, move the task file to `5-done/`. Uncommitted work is never removed without asking.
- The root repo (local only, no remote) tracks `Tasks/`, `Docs/`, `CLAUDE.md`, `AGENTS.md`, `CHANGELOG.md`. Add each new worktree folder to the root `.gitignore`, and commit at the end of a session or when a task changes stage.
- Before starting, list live worktrees: `git -C <repo> worktree list`. Two tasks must not touch the same files; note overlaps in the task file.

## Changelog (one file at the root: `CHANGELOG.md`)
Tasks live at the root, so the changelog does too. **Do not add a `CHANGELOG.md` inside any sub-repo.** On each merge to `main`, add one entry at the top, tagged with the project:

```
## 2026-01-20 · [Web] feat(export): acquisition Excel report
- Owner: <name>
- Task: Tasks/5-done/Web-acquisition-export.md
- Branch/PR: feat/acquisition-export · #123
- What changed: <1-3 bullets, user-visible>
- Needs: <backend / config / migration, or "none">
```

Tags: `[Web]`/`[API]`/`[Admin]`, plus `[Cross]` for work across repos.

## Working in parallel (one agent, one task)

**Claim.** An agent works on exactly one task file. It writes `Claimed by: <session/agent name>, <date>` in that file before editing code, and clears it when it stops. If a task is already claimed, do not work on it; ask the user.

**Stay in your lane.**
- Edit code only inside your task's worktree and the paths in its `Touches`. Never edit another task's worktree, and never switch branches in a checkout that another task uses.
- Never run `git add -A`, `git commit -a`, `git stash`, `git reset --hard` or `git checkout .` in a shared place. In the root repo, `git add <specific paths>` only.
- Need a change outside your lane (another task's files, a shared component, shared docs)? Do not make it. Leave a note (below) and carry on with your own scope.

**Shared files** (`AGENTS.md`, `CLAUDE.md`, `Docs/**`): re-read right before editing, change only your own lines with a small edit, never rewrite the whole file.

**Talking to each other: `Tasks/_inbox/`.** One small file per message, so nothing conflicts:

`Tasks/_inbox/<to-task>/<YYYY-MM-DD>-from-<task>-<topic>.md`

```
From: Web-checkout   To: Web-export   Date: 2026-01-16
Type: heads-up | question | blocker | done
Message: <2-5 lines: what you need or changed, and which files>
Needs reply: yes/no
```

- At the start of work, read `Tasks/_inbox/<your-task>/`. When handled, move the note to `Tasks/_inbox/_read/` (do not delete).
- Use `blocker` when your task cannot continue without the other. The user decides who goes first.
- Decisions that outlive the session belong in the task file or the docs, not only in the inbox.

**Sub-agents.** When an agent spawns sub-agents, each gets: its task file path, its worktree path, and the "Stay in your lane" rules above. Sub-agents report in their final message, and write an inbox note when a finding concerns another task. One owner per worktree: sub-agents do not share a checkout for writing.
