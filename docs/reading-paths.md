# Reading Paths

Use these paths before editing. Add a new path when a repeated task needs a stable context recipe.

## Article List Or Feed

Read:

- `src/pages/index.tsx`
- `src/components/article/ArticleListTabs.tsx`
- `src/components/article/ArticleListEntry.tsx`
- `src/server/api/routers/articles.ts`
- `prisma/schema.prisma`
- `tests/home.spec.ts`

Check:

- Logged-out global feed behavior.
- Logged-in personal feed behavior.
- Pagination and tag filtering.

## Article Create, Edit, Or Detail

Read:

- `src/pages/editor/index.tsx`
- `src/pages/editor/[article]/index.tsx`
- `src/pages/article/[article]/index.tsx`
- `src/components/article/CreateOrUpdateArticleForm.tsx`
- `src/server/api/routers/articles.ts`
- `src/server/api/routers/comments.ts` if the detail page changes comments.
- `prisma/schema.prisma`

Check:

- Slug generation.
- Author ownership checks.
- RealWorld response shape.

## Favorite Or Unfavorite

Read:

- `src/components/social/FavoriteButton.tsx`
- `src/components/article/ArticleListEntry.tsx`
- `src/components/article/ArticleMeta.tsx`
- `src/server/api/routers/favorites.ts`
- `src/server/api/routers/articles.ts`
- `prisma/schema.prisma`

Check:

- `favorited` boolean.
- `favoritesCount`.
- Logged-in auth requirement.
- List and detail page behavior.

## Auth Or Session Behavior

Read:

- `src/lib/api.ts`
- `src/server/api/trpc.ts`
- `src/server/api/routers/authentication.ts`
- `src/pages/login/index.tsx`
- `src/pages/register/index.tsx`
- `src/pages/settings/index.tsx`
- `src/env.mjs`

Check:

- JWT generation and validation.
- Token storage in `sessionStorage`.
- Header format: `Authorization: Token <token>`.

## Profile Or Follow Behavior

Read:

- `src/pages/profile/[username]/index.tsx`
- `src/components/social/FollowButton.tsx`
- `src/server/api/routers/profile.ts`
- `src/server/api/routers/articles.ts`
- `prisma/schema.prisma`

Check:

- Public profile fetch.
- Auth-optional behavior.
- Follow/unfollow relationship direction.

## API Contract

Read:

- `tests/api/Conduit.postman_collection.json`
- `tests/api/run-api-tests.sh`
- `src/server/api/openapi.ts`
- `src/pages/api/openapi.json.ts`
- The router whose `.meta({ openapi: ... })` block maps the endpoint.

Check:

- The app is running before `pnpm test:api`.
- `APIURL=http://localhost:3000/api pnpm test:api`.
- Router input/output schemas match RealWorld response shape.

## UI Test Or Browser Smoke Check

Read:

- `playwright.config.ts`
- `tests/home.spec.ts`
- The page and components touched by the behavior.

Check:

- `pnpm test:ui`.
- Manual `pnpm dev` smoke check when visual behavior changes.
- Browser console and network errors when the UI appears to work but data is missing.
