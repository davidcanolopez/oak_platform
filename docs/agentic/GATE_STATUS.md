# OAK Gate Status

| Gate | Status | Reason | Evidence owner | Last verified |
| --- | --- | --- | --- | --- |
| G0 Baseline | FAIL | No application repository baseline, lockfile, build, CI, schema, test harness or committed source exists yet | Release Guardian | 2026-11-18 |
| G1 Static quality | BLOCKED | Requires G0 | Release Guardian | 2026-11-18 |
| G2 Unit and component | BLOCKED | Requires G1 and implemented code | Release Guardian | 2026-11-18 |
| G3 Integration and data | BLOCKED | Requires G2 and implemented services | Release Guardian | 2026-11-18 |
| G4 Functional E2E | BLOCKED | Requires G3 and complete critical journeys | Release Guardian | 2026-11-18 |
| G5 Non-functional | BLOCKED | Requires G4 | Release Guardian | 2026-11-18 |
| G6 Staging | BLOCKED | Requires G5 | Release Guardian | 2026-11-18 |
| G7 Release | BLOCKED | Requires G6, D2 and D3 authorization before deployment; final PASS also requires post-deploy evidence | Release Guardian | 2026-11-18 |

The Release Guardian replaces this table with links to immutable evidence as gates are executed. A status cannot be upgraded from an agent summary alone.

