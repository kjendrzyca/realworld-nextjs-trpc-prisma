# Planning

Planning should reduce review cost. It should not become a second project.

## Mini-Plan

Use a mini-plan in the chat for small work.

Good fit:

- One file or one narrow behavior.
- No schema change.
- No public API contract change.
- Clear verification command.
- The work can finish in one focused session.

Format:

```text
Plan:
1. Read the relevant files.
2. Make the small change.
3. Run <specific check>.
Risk: <one real risk or "low">.
```

## Milestone Plan

Use a milestone plan when the task is bigger but still does not need a repo artifact.

Good fit:

- Several files in one layer.
- Existing architecture is clear.
- The user needs to approve direction before implementation.
- The plan can be summarized in 3-6 steps.

Include:

- Goal.
- Files or modules to inspect.
- Proposed edits.
- Verification commands.
- Open questions.

## ExecPlan

Use an ExecPlan when the work needs durable coordination.

Good fit:

- Changes cross UI, API, database, and tests.
- A schema or contract change needs recovery instructions.
- The work may pause and resume later.
- Another agent should be able to continue from the artifact.
- The plan itself needs review before implementation.

ExecPlans live in `docs/exec-plans/active/`. Use `docs/exec-plans/create-plan-file.md`.

## Plan Review Questions

Ask these before approving a plan:

- What files did the agent read?
- What assumption could make this implementation wrong?
- Which existing module owns the behavior?
- What is the smallest verification command that proves the change?
- What test or doc should be updated if the same bug can return?
