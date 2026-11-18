# Evidencia P0-008 — Protocolo DoR/DoD, Plantilla de Evidencia, Excepciones y Simulacro

- **Task ID:** `P0-008`
- **Owner:** `orquestador-oak` (`SUP`)
- **Peer Reviewer:** `qa-e2e`
- **Release Guardian:** `release-guardian`
- **Base SHA:** `5ef220194d5e2295cdb8c2ab595e3cccf1975438`

## 1. Resultado observable y criterios cubiertos

- `AC-01` (**PASS**): `docs/agentic/DOR_DOD_PROTOCOL.md` y `docs/evidence/TEMPLATE_SUMMARY.md` recogen los 8 criterios DoR, 10 criterios DoD, 10 campos de handoff, los 11 disparadores de invalidación por SHA (`QUALITY_GATES.md` §8), los 10 campos de excepción `WAIVED_BY_USER` (`QUALITY_GATES.md` §10) y los 14+ campos del manifiesto de gate (`QUALITY_GATES.md` §7).
- `AC-02` (**PASS**): `docs/evidence/W01/P0-008/dry-run-handoff.md` documenta de principio a fin un ciclo `[SIMULACRO_FICTICIO]` completo (`PROPUESTA -> READY -> DESARROLLO -> PEER_REVIEW FAIL + INVALIDATED -> reentrega -> PASS`) con SHAs y datos sintéticos reservados.
- `AC-03` (**PASS**): Verificación Python positiva (`exit 0`) y prueba negativa ante omisión de campo del manifiesto (`exit 1`) ejecutadas y registradas en `docs/evidence/W01/P0-008/commands.txt`; escaneo `0` PII/emails personales/secretos.

## 2. Riesgos residuales y limitaciones

- Los comandos reales de aplicación (`<UNIT_TEST>`, `<COVERAGE>`, etc.) siguen activándose en `P0-004` y fases posteriores; este paquete gobierna los procedimientos y plantillas.
