# RealWorld Review Pass

Use this skill when reviewing agent-generated changes in this repo.

## Review Order

1. Read `AGENTS.md`, nested `AGENTS.md` files for touched folders, `docs/review.md`, and `docs/testing.md`.
2. Inspect the diff before reading implementation details.
3. Check scope: unrelated files, generated artifacts, test side effects, and local env leakage.
4. Check architecture fit: page/component/router/Prisma ownership.
5. Check contracts: zod schemas, auth requirements, RealWorld response shape, env vars.
6. Check verification: commands run, missing tests, browser smoke result for UI changes.
7. Recommend the smallest correction that fixes the issue.

## Output Format

Findings first, ordered by severity. Include file references. If there are no findings, say so and list residual risk or missing checks.

Do not turn review into a rewrite. Suggest patches only when they make the finding unambiguous.
