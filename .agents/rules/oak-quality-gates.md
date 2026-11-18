---
trigger: always_on
description: "Enforce OAK task state transitions, independent verification and release gates."
---

# OAK quality gate rule

Read `AGENTS.md` and `docs/agentic/QUALITY_GATES.md` before changing task state.

- Keep a Release Guardian independent from every implementation owner.
- Never start dependent production work without a recorded predecessor `PASS`.
- Never accept self-review, cached output, skipped tests or narrative claims as evidence.
- Reopen affected gates after code, schema, contract, dependency or infrastructure changes.
- Only the user may accept a risk or approve production-impacting actions.

