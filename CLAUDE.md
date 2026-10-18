# CLAUDE.md

pnpm + Turborepo monorepo (Node >= 20). Single repo, so root repo and product repo are the same.

## Layout
- `apps/web`, `apps/admin`, `apps/couple`, `apps/vendor`: frontends
- `apps/api`: backend; follow config/controllers/models/modules/services/middlewares/utils layering
- `packages/ui`, `packages/templates`, `packages/eslint-config`, `packages/typescript-config`: shared packages

## Commands
`pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm format`

Task prefixes: `Web`, `API`, `Admin`. Reference clones in `Clone-UI/` and `Clone-Admin/` are not product code.

## Agent rules

Shared rules for every agent live in `AGENTS.md` and apply here too:

@AGENTS.md
