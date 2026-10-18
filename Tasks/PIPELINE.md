# Delivery pipeline

Not every task needs every check. A task gets a **tier** by risk; the tier lists its gates. The tier is picked automatically (below), and the user can override.

## Tiers

| Tier | For | Examples |
|---|---|---|
| **T0 Trivial** | No behaviour change, easy to undo | Docs, copy, comment, typo, translation text, config text |
| **T1 Standard** | Small change, one repo, low blast radius | UI tweak, small bug, one screen, adding a field |
| **T2 Significant** | New feature or touches shared code, API or tracking | New page, API integration, refactor across files |
| **T3 Critical** | Money, identity, data, release | Payment/refund logic, auth, data migration, contract with another team, store/hosting release, security |

## Auto tier picker (the agent decides; it does not ask the developer)

Run when a task is created and again before it moves to `4-testing/`. Take the **highest** tier any signal reaches, then write `Tier: Tn · <signals>` in the task file. The user may override later; the agent never waits for an answer.

| Tier | Signals (any one is enough) |
|---|---|
| **T3** | Touches payment, refund, credit, coupon or price math; login, token, permissions; personal data or export of it; DB/data migration; release/deploy files; fields or events another team depends on; secrets or security settings |
| **T2** | New screen, route or feature; new API call or endpoint; edits a shared component, store, API client or base class; refactor over 5 files or about 300 changed lines; spans 2 or more repos; needs a backend change |
| **T1** | Any other code change |
| **T0** | Only `.md`, comments, copy/translation text or static assets, with no logic |

**Project signals (edit for your project):** add paths or keywords that always mean T3 here, e.g. `apps/api` auth and middlewares, gift/payment tracking, guest photo uploads and storage drivers, sheet-db schema/models, `.env*`, `pnpm-lock.yaml`/`package.json` dependency changes.

Before planning is finished the signals come from the plan's scope; before testing they come from the real `git diff --stat` and file paths. If the diff shows a higher tier than planned, re-tier up, add the gates, and note it. Never re-tier down just to skip gates.

## Gates

| # | Gate | Who validates | T0 | T1 | T2 | T3 |
|---|---|---|---|---|---|---|
| G1 | **Scope check**: diff only touches the task's `Touches`; no unrelated edits | Agent | ✔ | ✔ | ✔ | ✔ |
| G2 | **Static checks**: format, lint, typecheck as the repo defines | Agent (run the command) | – | ✔ | ✔ | ✔ |
| G3 | **Tests**: existing pass; new logic has tests | Agent (run) | – | existing | ✔ new | ✔ new + edge cases |
| G4 | **Run it**: see the change work, compare with the design | Agent (run / browser) | – | quick | ✔ | ✔ |
| G5 | **Code review**: correctness, quality, best practice, reuse | Separate review agent | – | – | ✔ | ✔ strict |
| G6 | **Security review** | Security-review skill | – | – | if auth/data/input | ✔ |
| G7 | **Docs sync**: contract / architecture / requests updated | Agent | if docs changed | if contract touched | ✔ | ✔ |
| G8 | **PR message / commit** passes the format below | Agent | ✔ | ✔ | ✔ | ✔ |
| G9 | **Human review** of the PR | User | – | – | optional | ✔ |
| G10 | **Release plan**: rollback, flags, dependencies, who monitors | Agent drafts, user approves | – | – | – | ✔ |
| G11 | **Changelog** entry at root | Agent | – | ✔ | ✔ | ✔ |

The validator for G5 and G6 is never the same agent run that wrote the code: use a fresh agent or the review skill so it reads the diff cold.

## Gates by stage

| Stage folder | Gates run |
|---|---|
| `3-in-progress/` | G1 while building |
| `4-testing/` | G2 to G7 (as the tier requires) |
| `5-done/` | G8, G9, G11 passed, merged, worktree removed |
| `6-deploy/` | G10 executed, live and checked |

## Commit and PR message (G8)

- Commit: conventional commits, `type(scope): subject` (`feat`, `fix`, `chore`, `docs`, `refactor`, `test`). Imperative subject, no full stop.
- PR description: `Why` (one or two lines) · `What changed` (bullets) · `How tested` (the gates you ran, with results) · `Risk / rollback` (T2 and T3) · `Task:` link to the task file. State what you did not test.
- Never claim a check passed that you did not run.

## Skipping gates

Gates exist to catch real problems, not to add ceremony. Skip a gate only when it is plainly pointless for this change. Write `Skipped Gn: <reason>` in the task file. A skipped gate is visible and reversible; a silent one is not allowed.
