# Baseline Priorizado de Requisitos Funcionales y No Funcionales — OAK

**Task origen:** `P0-002` | **Base SHA:** `87f92a1fd786fe2494bba4c7c8ec89c220b14ee7` | **Estado:** Baseline G0 (sujeto a confirmación de alcance `D0` y expansión Given/When/Then en `P1-003`)

## 1. Requisitos Funcionales Priorizados (`AC-J01` a `AC-J08`)

| ID | Prioridad | Descripción mínima (`MASTER_EXECUTION_PLAN.md` §13) | Fase objetivo | Gates aplicables |
| --- | --- | --- | --- | --- |
| `AC-J01-01` | `P0` | una persona puede buscar por disciplina y ubicación sin iniciar sesión. | Fase 3 | G3, G4 |
| `AC-J01-02` | `P0` | puede combinar fecha, distancia y nivel; el resultado refleja todos los filtros activos. | Fase 3 | G3, G4 |
| `AC-J01-03` | `P1` | la URL representa los filtros y permite volver atrás/adelante sin perder contexto. | Fase 3 | G4 |
| `AC-J01-04` | `P0` | solo aparecen eventos PUBLISHED y futuros/abiertos según la regla definida. | Fase 3 | G2, G3 |
| `AC-J01-05` | `P1` | loading, cero resultados y error ofrecen acciones comprensibles. | Fase 3 | G4, G5 |
| `AC-J01-06` | `P0` | la experiencia es operable por teclado y a 320 px sin scroll horizontal. | Fase 3 | G4, G5 |
| `AC-J02-01` | `P0` | antes del CTA se muestran fecha, lugar, disciplina, distancia, desnivel cuando aplique, nivel, precio total desde, cupo/estado y reglamento. | Fase 3 | G4 |
| `AC-J02-02` | `P0` | las modalidades comparan nombre, distancia, cupo, precio y requisitos. | Fase 3 | G3, G4 |
| `AC-J02-03` | `P0` | un evento cerrado o sin cupo no ofrece un CTA engañoso. | Fase 3 | G2, G4 |
| `AC-J02-04` | `P1` | favoritos requiere sesión, conserva return-to y es idempotente. | Fase 3 (sujeto a D0) | G2, G3, G4 |
| `AC-J02-05` | `P1` | contenido y fotografía siguen la voz y dirección OAK aprobadas. | Fase 3 | G4 |
| `AC-J03-01` | `P0` | alta, verificación, login, logout y recuperación funcionan sin enumerar cuentas. | Fase 2 | G2, G3, G5 |
| `AC-J03-02` | `P0` | el perfil valida nombre, fecha de nacimiento, documento si es imprescindible, contacto y preferencias. | Fase 4 | G2, G3 |
| `AC-J03-03` | `P0` | los datos del perfil se reutilizan en la inscripción y pueden corregirse antes de confirmar. | Fase 4 | G4 |
| `AC-J03-04` | `P0` | consentimientos guardan versión, fecha, actor y propósito. | Fase 4 | G3, G5 |
| `AC-J03-05` | `P1` | exportación y solicitud de borrado requieren sesión reciente. | Fase 7 | G5 |
| `AC-J04-01` | `P0` | el flujo es modalidad → datos → revisión/consentimiento → pago. | Fase 4 | G4 |
| `AC-J04-02` | `P0` | el desglose y total se muestran desde la selección y antes del pago. | Fase 4 | G4 |
| `AC-J04-03` | `P1` | un borrador se recupera tras cerrar o cambiar de dispositivo autenticado. | Fase 4 | G3, G4 |
| `AC-J04-04` | `P0` | el servidor recalcula precio y cupo dentro de una operación segura. | Fase 4 | G2, G3 |
| `AC-J04-05` | `P0` | solicitudes o webhooks repetidos no duplican pagos, inscripciones ni correos. | Fase 4 | G2, G3 |
| `AC-J04-06` | `P0` | concurrencia en la última plaza confirma una sola inscripción. | Fase 4 | G2, G3 |
| `AC-J04-07` | `P0` | éxito, fallo, cancelación y reintento muestran el estado real. | Fase 4 | G4 |
| `AC-J04-08` | `P0` | una confirmación aparece en dashboard y correo una sola vez. | Fase 4 | G3, G4 |
| `AC-J05-01` | `P0` | el dashboard separa próximo reto, inscripciones activas e historial. | Fase 6 | G4 |
| `AC-J05-02` | `P0` | una inscripción CONFIRMED aparece sin necesidad de recargar datos manualmente. | Fase 6 | G3, G4 |
| `AC-J05-03` | `P0` | las métricas usan únicamente eventos confirmados/completados y explican su significado. | Fase 6 | G2, G3 |
| `AC-J05-04` | `P1` | una cuenta sin eventos ve un empty state útil con acceso al catálogo. | Fase 6 | G4 |
| `AC-J05-05` | `P1` | no se presentan niveles o métricas como presión competitiva ni como datos clínicos. | Fase 6 | G4, D1 |
| `AC-J06-01` | `P0` | solo un miembro ACTIVE con permiso crea o edita eventos de su organización. | Fase 5 | G2, G3, G5 |
| `AC-J06-02` | `P0` | un draft admite contenido, imágenes, modalidades, cupos, precios, reglamento y contacto. | Fase 5 | G3, G4 |
| `AC-J06-03` | `P0` | publicar ejecuta un checklist server-side y devuelve campos faltantes concretos. | Fase 5 | G2, G3 |
| `AC-J06-04` | `P1` | la preview coincide con la ficha pública en contenido esencial. | Fase 5 | G4 |
| `AC-J06-05` | `P0` | cambios que afectarían registros existentes están bloqueados o requieren un flujo explícito y auditado. | Fase 5 | G2, G3 |
| `AC-J06-06` | `P0` | cada transición registra actor, fecha y cambio. | Fase 5 | G3, G5 |
| `AC-J07-01` | `P0` | el organizador filtra por evento, modalidad y estado sin ver otras organizaciones. | Fase 5 | G2, G3, G5 |
| `AC-J07-02` | `P0` | los totales concilian con inscripciones y pagos confirmados. | Fase 5 | G2, G3 |
| `AC-J07-03` | `P0` | export CSV neutraliza formula injection y registra quién exportó. | Fase 5 | G2, G3, G5 |
| `AC-J07-04` | `P1` | el briefing requiere preview, confirmación y selección explícita. | Fase 5 | G3, G4 |
| `AC-J07-05` | `P0` | reintentos no envían comunicaciones duplicadas. | Fase 5 | G2, G3 |
| `AC-J08-01` | `P1` | un administrador puede localizar una inscripción por identificador sin búsquedas amplias de PII. | Fase 5/7 | G3, G5 |
| `AC-J08-02` | `P0` | operaciones sensibles generan audit log y requieren motivo. | Fase 5/7 | G3, G5 |
| `AC-J08-03` | `P0` | no existe impersonación silenciosa. | Fase 2/7 | G5 |
| `AC-J08-04` | `P0` | soporte no puede alterar pagos o cupos mediante edición directa de base de datos. | Fase 2/4 | G3, G5 |

Total de criterios funcionales mínimos priorizados: **44**.

## 2. Requisitos No Funcionales Priorizados (`MASTER_EXECUTION_PLAN.md` §11 y `QUALITY_GATES.md` §6)

| ID | Prioridad | Categoría | Umbral / Criterio medible | Gate de verificación |
| --- | --- | --- | --- | --- |
| `NFR-01` | `P0` | Integridad transaccional (cupo) | Cero sobreventa bajo prueba concurrente sobre última plaza | `G2`, `G3`, `G4` |
| `NFR-02` | `P0` | Idempotencia financiera | Webhook de pago efectivamente exactly-once e importe calculado en servidor en minor units enteros | `G2`, `G3`, `G5` |
| `NFR-03` | `P0` | Seguridad y aislamiento | Autorización deny-by-default, aislamiento multi-tenant/RLS, 0 vulnerabilidades Critical/High, 0 secretos, 0 PII en logs/fixtures | `G1`, `G3`, `G5` |
| `NFR-04` | `P0` | Accesibilidad (WCAG 2.2 AA) | 0 violaciones Critical/Serious en axe, revisión manual teclado/foco >=3px/objetivos >=48x48px/zoom 200%/reflow 320px/reduced-motion/NVDA+lector móvil, contraste AA | `G4`, `G5` |
| `NFR-05` | `P0` | Fiabilidad de suite E2E | Tasa de flake `0 %` en 3 ejecuciones consecutivas de release; 0 skips/only silenciosos | `G4`, `G7` |
| `NFR-06` | `P1` | Rendimiento web (CWV y Lighthouse) | LCP <= 2,5 s, INP <= 200 ms, CLS <= 0,1 (p75 móvil); Lighthouse móvil >= 90 perf / >= 95 a11y; presupuestos de bundle fijados en `ADR-004` | `G5` |
| `NFR-07` | `P1` | Latencia y carga API | Respuesta p95 <= 500 ms para catálogo, detalle y consultas normales bajo perfil de carga fijado en `ADR-004` | `G5` |
| `NFR-08` | `P1` | Continuidad operativa | RPO <= 24 h y RTO <= 4 h demostrados mediante simulacro de backup/restore y rollback en staging | `G6`, `G7` |
| `NFR-09` | `P2` | Compatibilidad multi-navegador | 2 últimas versiones estables de Chrome, Edge, Firefox y Safari; Safari iOS y Chrome Android en los 5 viewports (`320x568`, `390x844`, `768x1024`, `1200x800`, `1440x900`) | `G4`, `G5` |
