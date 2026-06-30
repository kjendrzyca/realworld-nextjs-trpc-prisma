# Full-Cycle Demo

This is the guided training exercise for moving from a task brief to implementation, verification, review, and durable repo learning.

## Demo Task

Add a "saved articles" feature.

User-visible behavior:

- Logged-in users can save and unsave an article.
- Saved status appears on article list entries and article detail pages.
- A logged-in user can view their saved articles from their profile page.
- Logged-out users can see saved counts but cannot save an article.

This task is intentionally full-stack. It should force the agent to read UI, API, Prisma, tests, and existing favorite behavior before editing.

## Why This Task Works For Training

- It is similar to favorites, so a careless agent may duplicate code or copy the wrong relationship.
- It touches Prisma relationships, tRPC routers, React components, auth, and tests.
- It creates a real planning threshold: a mini-plan is too small; an ExecPlan is justified.
- It gives a natural review target: did the agent reuse existing patterns or invent a parallel architecture?

## Live Flow

Start from `demo/04-plan-first-and-exec-plans` if you want participants to create the full-cycle artifacts themselves.

Use `demo/05-full-cycle-task-review-and-testing` if you need the ready-made task pack and review/testing docs.

1. Ask the agent to inspect repo context before planning.
2. Require the agent to use `docs/reading-paths.md` and `.agents/skills/realworld-feature-pass/SKILL.md`.
3. Ask for an ExecPlan, not implementation yet.
4. Review the plan with `docs/planning.md`.
5. Let the agent implement one milestone at a time.
6. Run the verification ladder from `docs/testing.md`.
7. Use a browser tool for one smoke check.
8. Ask a second agent/model to review with `docs/review.md`.
9. Promote one lesson from the review into `AGENTS.md`, nested `AGENTS.md`, docs, or a skill.

## Acceptance Criteria

- Existing favorites behavior still works.
- Saved articles use a distinct domain relationship from favorites.
- Auth rules are explicit.
- The implementation does not duplicate article list rendering unnecessarily.
- Tests or documented verification cover list, detail, and API behavior.
- `prisma/db.sqlite` test mutations are not accidentally committed.

## Suggested Prompt For Participants

```text
We need to add saved articles. First inspect the repo using AGENTS.md, docs/reading-paths.md, and the RealWorld feature skill. Do not implement yet. Create an ExecPlan under docs/exec-plans/active/ with milestones, assumptions, risks, verification commands, and acceptance criteria. Then stop for review.
```

## Debrief Questions

- Which files did the agent read before planning?
- Did the plan identify favorites as the nearest existing pattern?
- Did the plan separate "saved" from "favorite" cleanly?
- Did the review catch anything tests did not?
- What should become durable repo guidance after this task?
