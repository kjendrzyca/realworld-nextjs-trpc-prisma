# RealWorld Feature Pass

Use this skill when adding or changing a feature that touches more than one layer of this RealWorld app.

## Workflow

1. Restate the user-visible behavior and the affected domain: articles, favorites, comments, profiles, auth, or tags.
2. Pick the matching path from `docs/reading-paths.md` and read those files before editing.
3. Identify the ownership boundary:
   - UI behavior belongs in `src/pages/` or `src/components/`.
   - API behavior belongs in `src/server/api/routers/`.
   - Persistence behavior belongs in `prisma/schema.prisma` and Prisma calls.
   - Client API wiring belongs in `src/lib/api.ts`.
4. Make the smallest coherent change across all affected layers.
5. Add or update verification where the behavior can regress.
6. Run the relevant checks from `AGENTS.md` and nested `AGENTS.md` files.
7. If the agent made a wrong assumption, promote the correction into `AGENTS.md`, `docs/`, or this skill.

## Review Checklist

- Did the change reuse an existing router/component instead of duplicating it?
- Did the response shape still match RealWorld API expectations?
- Did the UI and API agree on auth requirements?
- Did Prisma relationship direction stay correct?
- Did local tests mutate `prisma/db.sqlite`, and if so, were those changes left unstaged?
- Is the verification command listed in the final response or commit notes?
