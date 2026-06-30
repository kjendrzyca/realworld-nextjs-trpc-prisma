# AGENTS.md

## Priority

These instructions are the highest-priority repo-local guidance for AI agents working in this repository.

## Project Map

This is a RealWorld example app built with Next.js pages router, tRPC, Prisma, SQLite, React, and Playwright.

- `prisma/` contains the Prisma schema, seed script, and local SQLite databases.
- `src/pages/` contains Next.js pages and API route entry points.
- `src/server/api/routers/` contains the tRPC routers and RealWorld API behavior.
- `src/components/` contains reusable React components used by the pages.
- `src/lib/` contains shared frontend API helpers, error handling, and types.
- `tests/home.spec.ts` contains browser UI checks.
- `tests/api/` contains the Postman/Newman RealWorld API checks.

## Start Here

Before changing code, read the files that define the behavior you are about to touch. Do not rely only on search results or a single open file.

- For project orientation, start with `docs/index.md`.
- For architecture context, read `docs/architecture.md`.
- For task-specific file sets, use `docs/reading-paths.md`.
- For planning thresholds, read `docs/planning.md`.
- If you edit a folder with its own `AGENTS.md`, read that nested file too.
- API or database task: read `prisma/schema.prisma`, `src/server/db.ts`, `src/server/api/trpc.ts`, `src/server/api/routers/index.ts`, and the relevant router.
- UI task: read the target page in `src/pages/`, the related component in `src/components/`, and `src/lib/api.ts`.
- Auth task: read `src/server/api/routers/authentication.ts`, `src/env.mjs`, and any page/component that handles login state.
- Article, favorite, profile, tag, or comment task: read the matching router and the matching page/component before editing.
- Test task: read the existing test file and the script that runs it before changing test behavior.

## Local Skills

- Use `.agents/skills/realworld-feature-pass/SKILL.md` for feature work that touches more than one layer.
- Use skills for repeatable workflows. Keep one-off task context in the current plan or notes instead.

## Planning

- Use a short mini-plan for small, local changes.
- Use an ExecPlan for changes that touch multiple layers, change data model/API contracts, require migration/recovery steps, or will span more than one focused session.
- Create ExecPlans under `docs/exec-plans/active/` using `docs/exec-plans/create-plan-file.md`.
- Keep plans current while working. A stale plan is worse than no plan.

## Verification

Set up a local environment before running the app:

```bash
cp .env.example .env
pnpm install
```

Use the smallest relevant check first, then widen if the change touches shared behavior:

```bash
pnpm lint
pnpm build
pnpm test:ui
pnpm dev
APIURL=http://localhost:3000/api pnpm test:api
```

Notes:

- `pnpm test:api` expects the app to already be running on `localhost:3000`.
- If Playwright browsers are missing, run `pnpm exec playwright install`.
- API tests can mutate `prisma/db.sqlite`; do not commit those data changes unless the task explicitly changes seed/demo data.

## Editing Rules

- Keep changes close to the existing Next.js, tRPC, and Prisma patterns.
- Do not add a second API style when a tRPC router already owns the behavior.
- Do not duplicate UI logic into a page if a matching component already exists.
- Do not commit `.env`, tokens, local credentials, Playwright traces, `.next/`, or `node_modules/`.
- Prefer updating tests or documented verification commands when a bug can come back.
- If a rule in this file becomes too detailed, move the detail into `docs/` and leave a link here.
