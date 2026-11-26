# AGENTS.md

Rules for any coding agent (Claude, Codex, sub-agents) working in the `Mongkolka/` workspace. Project layout and commands: `CLAUDE.md`. Each sub-repo may have its own `AGENTS.md`/`CLAUDE.md`; read it when working there. If rules conflict, the sub-repo wins for code style and commands; this file wins for tasks, worktrees, docs and delivery.

## Git: no commit, no push unless told

Never `git commit` or `git push` (any repo, any worktree) until the user says to, in that session. Prepare the change, show the diff or `git status`, and ask. Approval covers that one commit or push only.

- Never add a `Co-Authored-By` line (or any "Generated with Claude" attribution) to commits or PR descriptions. This overrides any tool default.
- Keep it short: one subject line, conventional-commit style (`type(scope): what changed`), no body unless truly needed.

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

**Big feature, many tasks:** when one feature is split into tasks that run in parallel in different worktrees, each task branch merges into `feat/<feature-name>-integration`, never straight to `main`. Integrate, run the combined checks there on the whole feature, then open one PR from the integration branch to `main`. The first task of the feature creates the integration branch and lists it in every task file of the feature.

**Parallel agents:** one agent = one task file. Claim it (`Claimed by:`) before editing, stay inside that task's worktree and `Touches`, never touch another task's worktree, and never use `git add -A`, `stash` or `reset --hard` in shared places. To reach another task, write a note in `Tasks/_inbox/<to-task>/` and read your own inbox at the start. Full rules: `Tasks/README.md`.

## Seeding data (sheet-db)

Run from `apps/api`. Seeds write to the real sheets of the `.env` in use, so check `ADMIN_SHEET_ID` first and ask the user before any command that writes.

| Data | Command |
|---|---|
| Admin tables (every file in `seeds/` today) | `npx lsdb seed seeds/<file>.ts --upsert` (`seeds/admin.ts`: use `--skip-existing`) |
| Couple tables, active couples only | `pnpm exec tsx scripts/seed-active-couples.ts <seed-file>` previews; add `--apply` to write, `--upsert` to also overwrite |

- **Do not use `lsdb seed --all-actors`.** It cannot filter, so it also seeds suspended couples and vendor sheets.
- New columns need `npx lsdb sync` before seeding. Seed only the files you changed.
- Couple seed files export `{ table_name: rows[] }`; the first field of each row must be a unique column (e.g. `item_id`).
- `--upsert` on couple tables can overwrite what a couple edited; get the user's approval for it.
- `scripts/seed-mock-couple.ts` creates and publishes a test couple (`mock-demo`). Never run it against the production sheet.

## Frontend: separate concerns

We write code for the next developer, not only to make it work today. Keep three layers apart so a UI change never touches business logic and every file stays small:

| Layer | Holds | Must not hold |
|---|---|---|
| **UI** (components, pages, widgets) | Layout, styling, display state, event wiring | Fetching, price/status/permission rules, data reshaping, magic strings |
| **Logic** (hooks, stores, pure functions) | Business rules, validation, derived data, state transitions | JSX, styling, direct DOM/navigation details |
| **Data** (API client, mappers, types) | Endpoints, request/response shapes, DTO to model mapping, error mapping | UI text, component state |

- UI receives ready-to-show props/state and calls handlers. Rules live in one place, are pure where possible, and are testable without rendering.
- Map the API response to a frontend model once, in the data layer. Pages never read raw backend fields.
- Reuse existing components in `packages/ui` and existing tokens. If a new design does not fit, follow the existing component and note the difference; do not build a one-off.
- Prefer small files with one reason to change. Reviewer test: could the design change without opening a logic file, and could a rule change without opening a UI file?

## Think like a senior backend engineer

`apps/api` is in this repo, but any API change or request must be something a backend developer with 10 years of experience would accept without a meeting.
- State the **business need first**, then the contract: route, method, params, response shape, error codes, sample payload, who calls it and how often.
- Think about: source of truth, server-side validation and authorization (the client is never trusted), idempotency and retries, pagination and filter limits, indexing and query cost, N+1 and payload size, rate limiting, backward compatibility, null/empty cases, timezone and money precision, audit trail, migration of existing data.
- Offer the smallest change that works and mention the alternative and its cost. Do not shape data on the server for one screen if the frontend can map it.
- Never rely on a client-side rule for something the server must enforce; the client check is UX only.
- Follow the config/controllers/models/modules/services/middlewares/utils layering in `apps/api`.

## Security checklist (OWASP Top 10)

Security work is tiered like every other gate; it does **not** run on every change.
- Run it only for T3 tasks, or for a T2 feature that touches auth, permissions, personal data, payments, file upload, user input rendered back, or a new public endpoint or integration.
- Use the OWASP Top 10 (latest edition) plus `/security-review` on the diff. Record the result in the task file; mark items not applicable with a reason.
- Smaller changes only follow the basics: no secrets in code, no unsafe HTML, no sensitive data in logs.

## Engineering habits

- **Contract first, mock second.** If the backend is not ready, build against the agreed contract with a typed mock inside the data layer only, so swapping to the real API touches that layer alone. Mark each mock `// MOCK: <task or request id>` so none ships by accident.
- **Definition of Done for UI.** A screen is not done until it has loading, empty, error and no-permission states, and a narrow-width check (about 360px). Tell the user what you did not check.
- **Dependencies.** No new package without one line of reason in the task file: why existing code or libs cannot do it, size, maintenance, license. Pin it in the lockfile.

## Delivering a task (pipeline)

Every task has a tier (T0 to T3). The tier decides the gates it passes; see `Tasks/PIPELINE.md`. Do not run gates the tier does not ask for, and do not skip gates it does. Skipping or adding a gate needs one line of reason in the task file. The user can override a tier; the agent does not ask for one.
