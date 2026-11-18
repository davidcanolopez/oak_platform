# OAK Agent Execution Contract

## Objective

Build and validate a functional responsive beta of OAK, a two-sided sports-event platform for athletes and organizers. The existing brand and web-design decks are product references, not application code.

## Source of truth

Use this order when instructions conflict:

1. The user's explicit decision recorded in `docs/agentic/DECISION_LOG.md`.
2. `docs/agentic/MASTER_EXECUTION_PLAN.md` for scope, dependencies and milestones.
3. `docs/agentic/QUALITY_GATES.md` for test and release requirements.
4. `docs/brand/BRAND_UX_CONTRACT.md` for UI, content, responsive and accessibility rules.
5. The two decks under `sites/` as visual evidence.
6. The TFM memory and tracking workbook as background context.

Do not silently resolve a conflict by choosing the easiest source. Record the conflict and route it to the Release Guardian.

## Required operating model

- The Orchestrator coordinates; focused agents implement or verify bounded tasks.
- A Release Guardian must be active for every milestone. It is independent, has veto power and never fixes product code it is judging.
- No agent may approve its own implementation or its own tests.
- Do not begin a dependent task or the next milestone until the Guardian records the predecessor gate as `PASS`.
- A code, schema, dependency, contract or infrastructure change invalidates affected prior evidence and reopens its gate.
- Use an isolated branch or worktree per implementation task where supported. In a shared workspace, assign one writer per file set and integrate sequentially.
- Keep tasks small enough to review in one diff. Split work that crosses unrelated modules.
- Agents may prepare research or test designs for a future milestone, but may not change its production code before its entry gate passes.

## Task lifecycle

`PROPUESTA -> READY -> DESARROLLO -> PEER_REVIEW -> QA -> NO_FUNCIONAL -> ACEPTADA -> DESPLEGADA`

Auxiliary states are `BLOCKED`, `FAIL`, `INVALIDATED` and `CANCELADA`. Only the Release Guardian changes a task to `ACEPTADA`. Only the user can approve the business decisions D0-D3 or accept a documented risk.

## Definition of Ready

A task needs a completed packet based on `docs/agentic/TASK_PACKET_TEMPLATE.md`, including:

- one owner and a non-overlapping file/module boundary;
- dependencies already in `PASS`;
- functional and non-functional acceptance criteria;
- negative, authorization and accessibility cases where applicable;
- required tests and evidence;
- data, security, migration and rollback impact;
- explicit exclusions.

If any item is missing, return the task to the Functional Analyst. Do not code from an ambiguous brief.

## Definition of Done

Done means all acceptance criteria are traceable to reproducible evidence, all required checks pass from a clean checkout, documentation and migrations are current, and there are no open P0/P1 defects. A verbal claim, screenshot alone, cached result, skipped test or mocked success is not evidence.

Follow `docs/agentic/QUALITY_GATES.md`. “Completely tested” means all defined risk-based checks pass; it never means an unprovable absence of every possible defect.

## Product and brand constraints

- Initial recommended beachhead: trail and running events in the Community of Madrid. Treat it as an assumption until decision `D0` is approved.
- Ship athlete discovery, event detail, recoverable registration, athlete trajectory and organizer event/participant management before optional ecosystem integrations.
- Use OAK tokens and voice from `docs/brand/BRAND_UX_CONTRACT.md`; do not copy presentation CSS blindly.
- Do not use inaccessible orange/sand, sky/sand or muted/sand text pairings.
- Support keyboard use, visible focus, reduced motion, 200% zoom and 320 px layouts from the first component.
- Spanish is the default product language for the MVP. English brand phrases are allowed only where the contract explicitly preserves them.

## Data and safety constraints

- Never use real personal or payment data in development, tests, logs, screenshots or seeds.
- Store money as integer minor units, timestamps in UTC with an explicit event timezone, and enforce unique registration plus capacity constraints transactionally.
- Treat authentication, authorization, payments, webhooks, documents and organizer isolation as security-sensitive work requiring independent negative tests.
- Production deployment, real payments, destructive migrations and external communication require explicit user approval.
- Keep secrets outside the repository and fail closed when required configuration is absent.

## User involvement

The agents own technical choices and routine corrections. Ask the user only at the four business gates defined in the master plan: `D0` scope, `D1` brand/UX contract, `D2` staging UAT and `D3` production release. Present a recommendation and a working artifact at each gate.

