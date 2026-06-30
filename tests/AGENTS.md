# AGENTS.md

## Scope

These rules apply to `tests/`.

## Test Rules

- Keep browser tests in Playwright unless the task is only API contract behavior.
- Keep RealWorld API contract tests in the Postman/Newman collection unless there is a clear reason to add another API test layer.
- Do not weaken assertions only to make a local failure pass.
- If a test needs seeded data, document the assumption near the test or in `docs/reading-paths.md`.
- Remember that API tests can mutate `prisma/db.sqlite`; do not commit those mutations accidentally.

## Required Checks

For UI test changes:

```bash
pnpm test:ui
```

For API test changes, run the app first and then:

```bash
APIURL=http://localhost:3000/api pnpm test:api
```
