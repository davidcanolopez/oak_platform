# OAK Gate Status

| Gate | Status | Reason | Evidence owner | Last verified |
| --- | --- | --- | --- | --- |
| G0 Baseline | BLOCKED | **BL-01 (remoto GitHub ausente y CI PR de P0-005 sin ejecucion remota):** requisitos `#2..#14` y la parte local de `#1` (`22` commits, `.github/CODEOWNERS`, `19/19` `sites/**`, `9/9` checks activos `exit 0`, `21/21` comandos futuros `exit 2`) verificados en `PASS` sobre `750f24859742261f86efcdc607f2dea7145d6874`; pendiente `PEER_REVIEW` de `P0-010` por `auditor-no-funcional`. Ver [summary.md](../evidence/W01/P0-010/summary.md), [gate-manifest.json](../evidence/W01/P0-010/gate-manifest.json) y [g0-manifest.json](../evidence/W01/P0-010/g0-manifest.json). | Release Guardian | 2026-11-19 |
| G1 Static quality | BLOCKED | Requires G0 PASS (actualmente BLOCKED en BL-01 / remoto GitHub y P0-005) | Release Guardian | 2026-11-19 |
| G2 Unit and component | BLOCKED | Requires G1 and implemented code | Release Guardian | 2026-11-19 |
| G3 Integration and data | BLOCKED | Requires G2 and implemented services | Release Guardian | 2026-11-19 |
| G4 Functional E2E | BLOCKED | Requires G3 and complete critical journeys | Release Guardian | 2026-11-19 |
| G5 Non-functional | BLOCKED | Requires G4 | Release Guardian | 2026-11-19 |
| G6 Staging | BLOCKED | Requires G5 | Release Guardian | 2026-11-19 |
| G7 Release | BLOCKED | Requires G6, D2 and D3 authorization before deployment; final PASS also requires post-deploy evidence | Release Guardian | 2026-11-19 |

The Release Guardian replaces this table with links to immutable evidence as gates are executed. A status cannot be upgraded from an agent summary alone. Status remains fail-closed `BLOCKED` until `BL-01` is resolved or explicitly waived by user decision in `DECISION_LOG.md`.

