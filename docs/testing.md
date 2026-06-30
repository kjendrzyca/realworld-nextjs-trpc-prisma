# Testing And Verification

Use the smallest check that can catch the relevant failure, then widen when the change crosses boundaries.

## Verification Ladder

1. Static checks:

   ```bash
   pnpm lint
   ```

2. Production build:

   ```bash
   pnpm build
   ```

3. Browser UI checks:

   ```bash
   pnpm test:ui
   ```

4. Manual app smoke:

   ```bash
   pnpm dev
   ```

   Open `http://localhost:3000`.

5. API contract checks:

   With the app already running:

   ```bash
   APIURL=http://localhost:3000/api pnpm test:api
   ```

## What To Run

- Docs-only change: `git diff --check`.
- UI-only change: `pnpm lint`, `pnpm test:ui`, browser smoke when visual state changes.
- Router-only change: `pnpm lint`, `pnpm build`, API contract check when the endpoint is public.
- Prisma/schema change: `pnpm install`, `pnpm build`, relevant API/UI checks.
- Full-stack feature: `pnpm lint`, `pnpm build`, `pnpm test:ui`, browser smoke, and API check if RealWorld endpoints changed.

## Browser Tooling

Use agent-browser or Chrome DevTools MCP when static test output is not enough:

- Inspect console errors.
- Inspect failed network requests.
- Confirm the changed UI state through the browser.
- Capture a screenshot if visual regression is part of the task.

Mobile Safari is intentionally outside the demo scope. The Playwright project set covers Desktop Chrome and Mobile Chrome.

## Known Test Footguns

- `pnpm test:api` requires a running app on `localhost:3000`.
- API tests mutate `prisma/db.sqlite`; restore those changes before committing unless the data change is intentional.
- Remote image URLs used by seed/demo data can return transient failures in logs. Treat them as noise only if tests still pass and the changed behavior does not depend on those images.
- If Playwright browsers are missing, run `pnpm exec playwright install`.
