# AGENTS.md

## Scope

These rules apply to `src/components/`.

## Component Rules

- Keep components reusable. Do not move domain API rules into UI components.
- Prefer existing components before creating another one with similar behavior.
- Components may call tRPC hooks only when they already own that screen-level behavior; otherwise pass data and callbacks from the page.
- Preserve existing Bootstrap/RealWorld class naming unless the task explicitly changes visual design.
- Keep stable `data-testid` attributes when tests depend on them.
- If a component changes auth-sensitive UI, read `src/lib/api.ts` and the related router.

## Required Checks

For component changes, run:

```bash
pnpm lint
pnpm test:ui
```

Use a browser smoke check when visual state, navigation, or network behavior changes.
