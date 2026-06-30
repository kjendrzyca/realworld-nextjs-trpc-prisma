# Environment And Browser Tooling

## Environment Files

Use `.env.example` as the public template:

```bash
cp .env.example .env
```

Rules:

- Keep `.env` local and uncommitted.
- Keep real secrets, production URLs, tokens, and personal credentials out of docs and prompts.
- Add new required env vars to `.env.example` with safe placeholder values.
- Explain non-obvious env vars in this file.

Current local defaults:

- `DATABASE_URL=file:./db.sqlite`
- `JWT_SECRET` can be a local-only development value.

## MCP And Browser Tools

This repo does not need committed MCP server config for the base demo.

Use MCP or browser automation when the task needs live context that static files cannot provide:

- Browser smoke check after UI changes.
- Console and network inspection when the page renders but data is wrong.
- External docs lookup when a framework/API behavior may have changed.
- Read-only integration checks against external systems in a real project.

Use repo docs and code first when the task is local and deterministic. MCP is useful when it gives a better source of truth; it is noise when it only repeats what is already in the repo.

## Suggested Browser Smoke Flow

With the dev server running:

1. Open `http://localhost:3000`.
2. Confirm the home page renders the `conduit` banner.
3. Check browser console errors.
4. Check failed network requests.
5. Log in with seeded test credentials if the task touches auth-gated UI.
6. Exercise the changed behavior once through the UI.

Do not paste secrets into browser automation prompts. If a real project needs credentials, use the least-privileged local account available.
