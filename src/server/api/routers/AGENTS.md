# AGENTS.md

## Scope

These rules apply to `src/server/api/routers/`.

## Router Rules

- Match the existing tRPC router style before adding a new procedure.
- Keep RealWorld REST compatibility in the `.meta({ openapi: ... })` block when the procedure maps to a public API endpoint.
- Keep request validation and response shape explicit with `zod`.
- Do not bypass `protectedProcedure` for behavior that requires a logged-in user.
- Prefer changing an existing domain router over adding a new router unless the schema introduces a new domain concept.
- When a router returns article data, preserve `favorited` and `favoritesCount` semantics.
- When a router changes persistence behavior, read `prisma/schema.prisma` and update tests or documented verification.

## Required Checks

For router changes, run at least:

```bash
pnpm lint
pnpm build
```

If the endpoint maps to the RealWorld REST API, also run the app and then:

```bash
APIURL=http://localhost:3000/api pnpm test:api
```
