# Saved Articles Feature

IMPLEMENTER INSTRUCTION: This is an example plan for training. Do not treat it as completed implementation state.

## Purpose / Big Picture

Add a logged-in "saved articles" feature to the RealWorld app without duplicating the existing favorites feature. The exercise demonstrates full-stack agent work: context gathering, planning, implementation, verification, review, and durable learning.

## Assumptions

- Favorites remain unchanged and keep their RealWorld semantics.
- Saved articles are a separate user preference, not a replacement for favorites.
- The task may need Prisma schema changes and local SQLite regeneration.
- UI should reuse article list/detail patterns where possible.

## Open Questions

- Should saved articles be exposed through the RealWorld REST API or only through the app UI?
- Should saved count be public, or should saved status be private to the logged-in user?
- Where should the profile page expose saved articles: new tab or existing feed controls?

## Progress

- [ ] Read `AGENTS.md`, nested instructions, `docs/architecture.md`, `docs/reading-paths.md`, `docs/testing.md`, and `docs/review.md`.
- [ ] Read favorites implementation as the nearest existing pattern.
- [ ] Decide API contract and UI placement.
- [ ] Implement schema/API/UI changes.
- [ ] Add or update tests.
- [ ] Run verification.
- [ ] Review with a second agent/model.
- [ ] Promote one durable lesson into repo guidance.

## Surprises & Discoveries

- Observation:
  Evidence:

## Decision Log

- Decision:
  Rationale:
  Date/Author:

## Plan Of Work

First inspect the existing favorite flow end to end: `prisma/schema.prisma`, `src/server/api/routers/favorites.ts`, article router response shaping, `FavoriteButton`, article list entries, article meta, profile page tabs, and tests.

Then decide the contract. If saved articles are app-only, keep the API internal to tRPC and avoid changing the RealWorld REST contract. If they are public API behavior, add OpenAPI metadata and API tests.

Next update the data model with a separate relation between `User` and `Article`. Regenerate Prisma artifacts through the existing install/postinstall path. Do not hand-edit generated files.

Then implement router procedures for save, unsave, and saved list. Reuse the article response shape where reasonable, but keep saved semantics distinct from favorites.

Then wire UI behavior into list/detail/profile surfaces. Reuse existing components or extract shared behavior if favorites and saved buttons would otherwise duplicate loading/auth handling.

Finally update tests and run the verification ladder.

## Validation And Acceptance

Required:

```bash
pnpm lint
pnpm build
pnpm test:ui
```

If the REST API contract changes, run the app and then:

```bash
APIURL=http://localhost:3000/api pnpm test:api
```

Manual browser smoke:

- Logged-out user sees saved affordance but cannot save.
- Logged-in user saves and unsaves from list/detail.
- Profile saved articles view shows the saved article.
- Favorites still work.

## Idempotence And Recovery

Schema changes should be rerunnable through Prisma commands used by the project. If local tests mutate `prisma/db.sqlite`, restore accidental data changes before committing. If generated artifacts drift, rerun `pnpm install`.

## Artifacts And Notes

- Plan lives under `docs/exec-plans/active/` during real work.
- Training exercise lives in `docs/training/full-cycle-demo.md`.
- Review checklist lives in `docs/review.md`.
- Verification ladder lives in `docs/testing.md`.
