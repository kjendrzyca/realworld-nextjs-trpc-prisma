# AGENTS.md

## Scope

These rules apply to `prisma/`.

## Database Rules

- `schema.prisma` is the source of truth for models and relationships.
- Keep SQLite as the default local database unless the task explicitly changes persistence.
- Treat `db.sqlite` mutations from local testing as test side effects.
- Do not commit `.env` or private database URLs.
- If you change schema, update router assumptions and run Prisma generation through the normal install/postinstall flow.
- If seed/demo data changes are intentional, document why and verify UI/API behavior that depends on that data.

## Required Checks

For schema changes, run:

```bash
pnpm install
pnpm build
```

If behavior changes through API routes, also run the API tests against a running local server.
