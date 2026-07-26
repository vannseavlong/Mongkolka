# Mongkolka

Wedding planning platform monorepo, managed with [Turborepo](https://turbo.build/) + pnpm workspaces.

## Structure

```
apps/
  web/      Next.js — mongkolka.com landing/marketing + public couple wedding sites
            (wildcard subdomains and custom domains, host-based routing via middleware)
  admin/    Next.js — admin.mongkolka.com (login required)
  couple/   Next.js — couple.mongkolka.com (login required)
  vendor/   Next.js — vendor.mongkolka.com (login required)
  api/      Express + longcelot-sheet-db backend

packages/
  typescript-config/  Shared tsconfig base(s)
  eslint-config/       Shared ESLint flat config base
```

## Requirements

- Node >= 20
- pnpm 11.8.0 (see `packageManager` in package.json)

## Getting started

```bash
pnpm install
pnpm dev     # runs `dev` in every app via turbo
pnpm build   # builds every app via turbo
pnpm lint    # lints every app via turbo
```

Each app under `apps/` runs independently (`pnpm --filter web dev`, etc.) when you only need one.

## Status

This is the initial monorepo scaffold only — no features, UI, or database schema have been built yet.
