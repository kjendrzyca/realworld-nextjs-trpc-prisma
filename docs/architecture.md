# Architecture

This project is a RealWorld Conduit app built with Next.js pages router, tRPC, Prisma, SQLite, React Query, and Playwright.

## Request Flow

Browser UI flow:

1. A page under `src/pages/` renders the screen.
2. The page calls `api.*` hooks from `src/lib/api.ts`.
3. `src/lib/api.ts` sends browser requests to `/api/trpc`.
4. Next.js API routes under `src/pages/api/` hand the request to tRPC.
5. Routers in `src/server/api/routers/` run business behavior through Prisma.
6. Prisma reads or writes SQLite using the schema in `prisma/schema.prisma`.

RealWorld REST API flow:

1. The Postman collection in `tests/api/` calls `/api/...`.
2. `src/pages/api/[...trpc].ts` exposes the OpenAPI-compatible endpoint.
3. Router `.meta({ openapi: ... })` blocks define REST paths and auth requirements.
4. The same router procedures used by tRPC return RealWorld-shaped responses.

## Main Boundaries

- Pages compose UI and call API hooks. They should not own backend rules.
- Components contain reusable UI behavior and should not know Prisma.
- Routers own API validation, auth requirements, and persistence behavior.
- Prisma schema owns relationships and database naming.
- `src/lib/api.ts` owns client-side token handling and tRPC client setup.
- Tests should exercise behavior through UI or API boundaries, not internal implementation details.

## Domain Modules

- Articles: `src/server/api/routers/articles.ts`, article pages, article components, `Article` model.
- Favorites: `src/server/api/routers/favorites.ts`, `src/components/social/FavoriteButton.tsx`, `User.favoriteArticles`, `Article.favoritedBy`.
- Comments: `src/server/api/routers/comments.ts`, comment components, `Comment` model.
- Profiles/follows: `src/server/api/routers/profile.ts`, profile page, `User.followsUsers`, `User.followedByUsers`.
- Auth/users: `src/server/api/routers/authentication.ts`, login/register/settings pages, `User` model, `JWT_SECRET`.
- Tags: `src/server/api/routers/tags.ts`, home sidebar, `ArticelTags` model.

## Local Data

The default database is SQLite through `DATABASE_URL=file:./db.sqlite`.

`prisma/db.sqlite` is committed demo data. API tests may add users, articles, comments, favorites, and follows. Treat those changes as test side effects unless the task explicitly changes seed/demo data.

Use `.env.example` as the public template. Keep `.env` local and uncommitted.
