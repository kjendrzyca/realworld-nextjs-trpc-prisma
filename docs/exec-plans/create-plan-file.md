# Create An ExecPlan

Use this guide when a task needs a durable plan under `docs/exec-plans/active/`.

## File Name

Create a new file:

```text
docs/exec-plans/active/YYYYMMDD-HHMM-short-slug.md
```

Use local time. Keep the slug short and concrete.

## Required Contract

The plan must be self-contained. A new agent should be able to read the plan and continue without the original chat.

Start every plan with this line:

```text
IMPLEMENTER INSTRUCTION: Keep this plan up to date as you work.
```

Update the plan when facts change. Do not leave completed work described as future work.

## Template

```markdown
# <Task Title>

IMPLEMENTER INSTRUCTION: Keep this plan up to date as you work.

## Purpose / Big Picture

Explain the user-visible result and why this change matters.

## Assumptions

- List facts you are relying on.
- Mark uncertain facts clearly.

## Open Questions

- List only questions that can change implementation.
- If there are none, write "None."

## Progress

- [ ] Read required context.
- [ ] Implement the change.
- [ ] Verify the change.

## Surprises & Discoveries

- Observation:
  Evidence:

## Decision Log

- Decision:
  Rationale:
  Date/Author:

## Plan Of Work

Write the implementation sequence in normal prose. Include files, modules, and expected edits.

## Validation And Acceptance

List exact commands and observable behavior that prove completion.

## Idempotence And Recovery

Explain how to rerun commands and recover from partial work.

## Artifacts And Notes

List created files, changed docs, test output, screenshots, or branch names.
```

## Scope Rules

- Do not create an ExecPlan just to avoid thinking.
- Do not use an ExecPlan for one-line fixes.
- Do not hide uncertainty. Put it in `Open Questions` or `Assumptions`.
- Keep command output summarized. Do not paste pages of logs.
- If the plan becomes stale, update it before continuing implementation.
