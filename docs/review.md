# Review

Review agent-generated code at the behavior and architecture level first. Line-by-line cleanup comes after the design is sound.

## Review Passes

1. Scope pass:
   - Does the diff solve the requested behavior?
   - Did the agent change unrelated files?
   - Is the change smaller than the task justifies?

2. Ownership pass:
   - Is UI behavior in pages/components?
   - Is API behavior in routers?
   - Is persistence behavior in Prisma and router calls?
   - Did the agent duplicate an existing component, helper, or router procedure?

3. Contract pass:
   - Do tRPC input/output schemas still match behavior?
   - Do RealWorld REST responses still match the expected shape?
   - Are auth requirements correct?
   - Are env vars documented in `.env.example` when required?

4. Verification pass:
   - Were the right checks run?
   - Are test side effects left unstaged?
   - Is there a browser smoke result when UI behavior changed?

5. Learning pass:
   - Did the agent make an assumption that should become a repo rule?
   - Should the correction live in `AGENTS.md`, `docs/`, a nested `AGENTS.md`, or a skill?

## Second-Agent Review Prompt

Use this when asking another agent/model to review a change:

```text
Review this change as a senior engineer. Focus on bugs, architecture fit, duplicated logic, missing tests, incorrect auth/data assumptions, and drift from AGENTS.md/docs. Findings first, ordered by severity, with file references. Do not rewrite the code unless a finding needs a concrete patch suggestion.
```

## Stop Conditions

Stop and ask for clarification when:

- The requested behavior conflicts with the RealWorld API contract.
- The task requires real credentials or production data.
- The agent would need to change schema, public API, and UI but no acceptance criteria are available.
- The verification command fails for a reason unrelated to the current diff and the cause is not obvious.
