# OAK Gate Status

| Gate | Status | Reason | Evidence owner | Last verified |
| --- | --- | --- | --- | --- |
| G0 Baseline | PASS | Requisitos `#1..#14` de `QUALITY_GATES.md` §6 verificados en `PASS` sobre `master` (`5f80ec76942f5073597d43b3e22ec0d8dd384c0f`): `D0 = APPROVED`, `10/10` tareas tecnicas previas `ACEPTADA`, Branch Protection real en `master` (`enforce_admins=true`, `strict=true` en `3` checks), `gitleaks v8.30.1 PASS` (`findingsCount=0`) en `PR #2`/`push 44809813044`/`PR #3`, `19/19` `sites/**`, `9/9` checks activos `exit 0` (`100 %` `src/` y `schema.ts`), `21/21` scripts futuros `exit 2`; modo cuenta GitHub individual (`required_approving_review_count=0`, `require_code_owner_reviews=false`) documentado en `docs/ops/CI_CD.md` §5 hasta segundo colaborador humano. Ver [summary.md](../evidence/W01/P0-010/summary.md), [gate-manifest.json](../evidence/W01/P0-010/gate-manifest.json) y [g0-manifest.json](../evidence/W01/P0-010/g0-manifest.json). | Release Guardian | 2026-11-20 |
| G1 Static quality | BLOCKED | G0 PASS alcanzado; pendiente ejecucion y cierre formal de G1 sobre codigo de producto en Fase 2 | Release Guardian | 2026-11-20 |
| G2 Unit and component | BLOCKED | Requires G1 and implemented code | Release Guardian | 2026-11-20 |
| G3 Integration and data | BLOCKED | Requires G2 and implemented services | Release Guardian | 2026-11-20 |
| G4 Functional E2E | BLOCKED | Requires G3 and complete critical journeys | Release Guardian | 2026-11-20 |
| G5 Non-functional | BLOCKED | Requires G4 | Release Guardian | 2026-11-20 |
| G6 Staging | BLOCKED | Requires G5 | Release Guardian | 2026-11-20 |
| G7 Release | BLOCKED | Requires G6, D2 and D3 authorization before deployment; final PASS also requires post-deploy evidence | Release Guardian | 2026-11-20 |

The Release Guardian replaces this table with links to immutable evidence as gates are executed. A status cannot be upgraded from an agent summary alone. G0 Baseline reaches PASS on `5f80ec76942f5073597d43b3e22ec0d8dd384c0f`; Fase 1 tasks require `P0-010` (`PR` + `PEER_REVIEW PASS`) integrated in `master` as `ACEPTADA` before transitioning to `READY`.

