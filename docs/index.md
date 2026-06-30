# Repo Harness Index

This directory contains the repo-local context that should be stable enough to reuse across AI-agent sessions.

Read this first:

- `architecture.md` explains the app shape, request flow, and module boundaries.
- `reading-paths.md` lists the files to read before common task types.

Keep `AGENTS.md` short. Put durable project knowledge in `docs/`, and leave pointers in `AGENTS.md`.

## Working Model

The app is small, but it is still a full-stack system:

- Browser UI is rendered by Next.js pages.
- Frontend data access goes through generated tRPC React Query hooks from `src/lib/api.ts`.
- Backend behavior lives in tRPC routers under `src/server/api/routers/`.
- The RealWorld REST API is generated from tRPC metadata through `trpc-openapi`.
- Prisma owns data modeling and SQLite access.
- Playwright covers browser behavior; Newman covers RealWorld API compatibility.

## When To Update Docs

Update docs when you learn something that would save the next agent from re-discovering context.

Good candidates:

- A route, model, or component owns behavior in a non-obvious way.
- A task needs the same file set repeatedly.
- A test command has a precondition.
- A recurring agent mistake can be prevented by a short rule.

Bad candidates:

- One-off debugging notes.
- Large pasted command output.
- Personal preference that is not enforced by the repo.
- Secrets, tokens, private URLs, or local machine paths.
