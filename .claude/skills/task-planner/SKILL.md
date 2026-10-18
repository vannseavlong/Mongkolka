---
name: task-planner
description: Turn a feature idea, design or requirement into a finalized plan and scoped task files. Use before building anything new or unclear: reviews the UI, reads the requirements and docs, maps the flow, finds gaps, then breaks the work into tasks with scope, dependencies and an automatic tier. Writes to Tasks/_plans and Tasks/2-todo.
---

# Task planner

You plan; you do not build. Output is a plan file plus task files that another agent can pick up without asking questions. Rules for tasks, tiers and parallel work: root `AGENTS.md`, `Tasks/README.md`, `Tasks/PIPELINE.md`.

## 1. Gather (read, do not guess)
- **UI:** the design frames (Figma tools or screenshots). Note every screen, state (empty, loading, error, success) and interaction.
- **Requirements:** `Docs/requirements/`, `Docs/api/`, `Docs/backend-response/`, `Docs/backend-request/`, `Docs/architecture/`, and the repo's own agent docs.
- **Code:** find what already exists (screens, components, stores, API hooks) so the plan reuses it. If a backend repo is available read-only, check routes and fields there. Check `git worktree list` and other tasks' `Touches` for overlap.

## 2. Understand the flow
Write the end-to-end flow in plain steps: who does what, which screen, which API call, what the backend returns, what can fail. Mark each step: **exists / change / new**.

## 3. Finalize
- List **gaps and conflicts** between design, requirements, backend status and code.
- Decide what you can by following the docs and project rules; state the decision and why. Put only true product decisions (that change scope or behaviour and cannot be settled from the docs) under **Open questions**, each with your recommended answer. Do not stop planning for them.
- Dependencies on another team go to `Docs/backend-request/` (small edit, follow the sync rules), not just into the plan.

## 4. Write the plan: `Tasks/_plans/<Prefix>-<feature>.md`
Sections: Goal · Flow (exists/change/new) · Screens and states · Data and API · Gaps and decisions · Open questions (with recommendation) · Task breakdown (task, repo, depends on, tier, size) · Out of scope.

## 5. Break into tasks
- One task = one worktree/branch = one reviewable PR, roughly 1 to 2 days. Split by repo, then by vertical slice (a screen with its data), not by technical layer.
- Order by dependency; mark what can run in parallel. Tasks that would touch the same files are sequenced or merged, not parallel.
- Create each from `Tasks/_TEMPLATE.md` in `Tasks/2-todo/` with: goal, `Touches` (specific paths), `Depends on`, acceptance checks, design/doc links, and the **auto tier** with its gate rows. Put later waves into one file in `Tasks/1-backlog/`.
- Do not claim, create worktrees or start building. That is the `project-manager` skill's job.

## 6. Report
Give the plan path, the task list in order, parallel groups, the tier of each, and the open questions with recommendations. Commit the new files in the root repo with specific paths.

## Principles
- Reuse before new. Respect project rules. Smallest scope that delivers the flow; extras go to the backlog.
- Never invent design or API details; if it is not in the sources, it is a gap.
