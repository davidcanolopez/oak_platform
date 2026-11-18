# Quality Gates de OAK

## 1. Propósito

Este documento es el contrato de control de calidad para cualquier agente de Codex,
Antigravity o humano que participe en la construcción de OAK. Su objetivo es que
ninguna tarea, integración o release avance solo por una afirmación de éxito: cada
avance debe estar respaldado por evidencia reproducible y ligada a un commit exacto.

“Completamente probado” significa aquí que:

- todos los criterios de aceptación y riesgos definidos tienen pruebas trazables;
- todos los gates aplicables han pasado sobre el mismo commit candidato;
- no quedan defectos P0 o P1 abiertos;
- cualquier riesgo aceptado tiene una excepción explícita del usuario.

No significa que pueda demostrarse la ausencia absoluta de defectos.

## 2. Autoridad: Release Guardian

Release Guardian es un agente independiente, permanente y con derecho de veto. No
implementa la funcionalidad que certifica ni aprueba su propio trabajo.

### 2.1 Responsabilidades

1. Comprobar que cada paquete de trabajo está completo antes de declararlo Ready.
2. Verificar dependencias, alcance permitido y criterios de aceptación.
3. Ejecutar los gates en un checkout limpio y en el commit SHA candidato.
4. Conservar comandos, salidas, informes y hashes de artefactos.
5. Emitir un resultado inequívoco: PASS, FAIL, BLOCKED o INVALIDATED.
6. Impedir que una tarea con FAIL, BLOCKED o INVALIDATED avance.
7. Reabrir tareas cuando un cambio invalide evidencia anterior.
8. Mantener trazabilidad requisito → cambio → prueba → evidencia → release.
9. Escalar al usuario exclusivamente decisiones de producto o aceptación de riesgo.

### 2.2 Prohibiciones

Release Guardian no puede:

- aceptar como prueba una frase del agente que desarrolló el cambio;
- omitir un gate por presión de calendario;
- rebajar una severidad para habilitar un release;
- conceder excepciones;
- certificar un commit diferente del desplegado;
- ocultar fallos mediante reintentos automáticos;
- marcar PASS si quedan placeholders, comandos sin ejecutar o evidencia caducada.

## 3. Principios operativos

- **Fail closed:** ante duda, evidencia ausente o herramienta no disponible, el gate
  no pasa.
- **Commit inmutable:** toda evidencia debe identificar el SHA completo probado.
- **Reproducción independiente:** el Guardian repite los comandos; no reutiliza el
  entorno mutable del agente implementador.
- **Misma configuración:** local, CI, staging y producción usan versiones fijadas y
  el mismo proceso de build.
- **Sin skips silenciosos:** una prueba omitida, marcada only o desactivada produce
  FAIL salvo excepción aprobada por el usuario.
- **Flaky es fallo:** un test inestable no se considera verde por pasar al reintento.
- **Datos seguros:** no se usan datos personales reales en desarrollo, pruebas,
  fixtures, capturas, logs o trazas.
- **Cambio pequeño:** cada paquete debe ser revisable, reversible y tener una sola
  finalidad principal.

## 4. Máquina de estados

La única secuencia válida es:

    PROPUESTA
      → READY
      → DESARROLLO
      → PEER_REVIEW
      → QA
      → NO_FUNCIONAL
      → ACEPTADA
      → DESPLEGADA

Estados terminales auxiliares:

- BLOCKED: falta una decisión, dependencia o capacidad externa.
- FAIL: hay un incumplimiento verificable.
- INVALIDATED: una evidencia anteriormente válida dejó de serlo por cambios.
- CANCELADA: el usuario retiró explícitamente la tarea.

### 4.1 Reglas de transición

| Transición | Condición mínima |
|---|---|
| PROPUESTA → READY | Paquete completo, dependencias satisfechas, criterios medibles y G0 aplicable en PASS |
| READY → DESARROLLO | Agente asignado, base SHA fijado y rutas permitidas declaradas |
| DESARROLLO → PEER_REVIEW | Entrega del agente completa y G1–G3 aplicables ejecutados por el agente |
| PEER_REVIEW → QA | Revisión independiente aprobada y sin observaciones bloqueantes |
| QA → NO_FUNCIONAL | G1–G4 en PASS por el Guardian sobre el SHA candidato |
| NO_FUNCIONAL → ACEPTADA | G5 y G6 en PASS, cero defectos P0/P1, D2 aprobada y recomendación pre-release del Guardian |
| ACEPTADA → DESPLEGADA | D3 aprobada, despliegue del artefacto certificado y G7 final en PASS tras smoke/observación |

No se permiten saltos. Una tarea puede volver a cualquier estado anterior si aparece
un defecto o se invalida evidencia.

## 5. Catálogo de comandos canónicos

Hasta completar G0, los siguientes tokens son placeholders de planificación:

    <INSTALL_LOCKED>
    <FORMAT_CHECK>
    <LINT>
    <TYPECHECK>
    <UNIT_TEST>
    <COVERAGE>
    <INTEGRATION_TEST>
    <CONTRACT_TEST>
    <DB_MIGRATE_FRESH>
    <DB_MIGRATE_FROM_PREVIOUS>
    <SEED_IDEMPOTENCY_CHECK>
    <BUILD>
    <E2E_CRITICAL>
    <E2E_FULL>
    <E2E_FLAKE_CHECK>
    <A11Y_AUTOMATED>
    <A11Y_MANUAL>
    <SAST>
    <SCA>
    <SECRET_SCAN>
    <DAST>
    <SBOM>
    <PERFORMANCE>
    <LOAD_TEST>
    <DEPLOY_PREVIEW>
    <DEPLOY_STAGING>
    <SMOKE_TEST>
    <OBSERVABILITY_CHECK>
    <BACKUP_RESTORE_DRILL>
    <ROLLBACK_DRILL>

G0 debe reemplazarlos por comandos reales, no interactivos y documentados en el
repositorio y en CI. Antes de G0 pueden aparecer en un paquete propuesto. Después de
G0, un placeholder sin resolver produce FAIL. Un comando válido debe:

- devolver código 0 solo si cumple todos sus umbrales;
- poder ejecutarse desde un clon limpio;
- fijar versiones y dependencias;
- producir salida legible por máquina cuando exista esa opción;
- guardar su informe como artefacto de CI.

## 6. Gates

### G0 · Baseline y preparación

**Objetivo:** crear una base reproducible antes de desarrollar features.

Requisitos:

- repositorio con historial, remoto, rama principal protegida y CODEOWNERS;
- arquitectura y stack documentados con versiones soportadas;
- manifiesto de dependencias y lockfile;
- instalación y build correctos desde clon limpio;
- comandos canónicos resueltos;
- matriz de entornos: local, preview, staging y producción;
- Definition of Ready y Definition of Done;
- requisitos funcionales y no funcionales priorizados;
- clasificación de datos, retención, mapa de flujos y modelo de amenazas;
- estrategia de autenticación, autorización por rol y aislamiento multi-tenant;
- estrategia de migraciones, seed, backup, restauración y rollback;
- estrategia de tests y trazabilidad;
- inventario de integraciones externas y contratos;
- referencias de identidad de marca y criterios UX accesibles.

**PASS:** todos los puntos existen, se pueden ejecutar y el build limpio termina con
código 0. No se inicia una feature antes de G0.

### G1 · Calidad estática, revisión y build

Checks:

- <INSTALL_LOCKED>
- <FORMAT_CHECK>
- <LINT>
- <TYPECHECK>
- <BUILD>
- <SECRET_SCAN>
- revisión independiente del diff;
- comprobación de que solo se modificaron rutas autorizadas;
- ausencia de credenciales, PII real, artefactos temporales y código muerto.

Umbrales:

- 0 errores de formato, lint y tipos;
- 0 warnings nuevos; el baseline inicial debe reducirse, nunca crecer;
- 0 secretos confirmados;
- build reproducible y sin pasos manuales;
- todas las observaciones bloqueantes de review resueltas.

### G2 · Pruebas unitarias

Checks:

- <UNIT_TEST>
- <COVERAGE>

Umbrales mínimos:

- 100% de tests unitarios aplicables en PASS;
- cobertura global: líneas ≥ 85% y ramas ≥ 80%;
- cobertura del diff: ≥ 90%;
- reglas críticas de permisos, precios, capacidad, inscripción, pagos, reembolsos y
  transiciones de estado: 100% de ramas relevantes;
- 0 tests omitidos, enfocados de forma exclusiva o en cuarentena sin excepción.

La cobertura no sustituye casos bien diseñados. Deben probarse límites, errores,
estados inválidos, concurrencia e invariantes, no solo el camino feliz.

### G3 · Integración, contratos y datos

Checks:

- <INTEGRATION_TEST>
- <CONTRACT_TEST>
- <DB_MIGRATE_FRESH>
- <DB_MIGRATE_FROM_PREVIOUS>
- <SEED_IDEMPOTENCY_CHECK>

Requisitos:

- base de datos y servicios efímeros, aislados por ejecución;
- contratos de API versionados y validados para todos los endpoints afectados;
- migración correcta desde base vacía y desde la versión soportada anterior;
- migraciones backward-compatible o procedimiento de forward-fix documentado;
- seed sintético, determinista, repetible e idempotente;
- integridad referencial, restricciones únicas y borrado comprobados;
- importes almacenados sin punto flotante y con moneda explícita;
- tiempos almacenados en UTC y convertidos en los bordes;
- idempotencia para pagos, webhooks e inscripciones;
- pruebas de webhooks duplicados y fuera de orden;
- concurrencia sobre la última plaza sin sobreventa ni doble cobro;
- aislamiento de datos entre organizadores;
- no PII real en fixtures, dumps o informes.

**PASS:** 100% de contratos y suites aplicables en verde y todos los invariantes de
datos conservados.

### G4 · QA funcional y E2E

Checks:

- <E2E_CRITICAL>
- <E2E_FULL>
- <E2E_FLAKE_CHECK>

Cobertura mínima:

- navegación anónima, búsqueda, filtros y ficha de evento;
- alta, login, recuperación y cierre de sesión;
- roles atleta, organizador y admin, incluidos intentos no autorizados;
- creación, edición, publicación y cancelación de eventos;
- inscripción, interrupción, reanudación, aforo completo y duplicados;
- pago aprobado, rechazado, cancelado, reintentado y reembolsado;
- dashboard de atleta y panel de organizador;
- exportación, rectificación y borrado de datos;
- estados vacíos, errores, pérdida de red y recuperación;
- Chromium, Firefox y WebKit;
- viewport de escritorio y móvil para los journeys críticos.

Umbrales:

- 100% de escenarios P0 y P1 en PASS;
- 3 ejecuciones completas consecutivas sin flakes;
- 0 defectos P0/P1 abiertos;
- cada criterio de aceptación enlazado al menos a una prueba y su evidencia.

### G5 · Seguridad, privacidad, accesibilidad y rendimiento

#### Seguridad y privacidad

Checks:

- <SAST>
- <SCA>
- <SECRET_SCAN>
- <DAST>
- <SBOM>

Umbrales:

- 0 vulnerabilidades Critical o High confirmadas;
- 0 secretos;
- vulnerabilidades Medium con responsable, mitigación y fecha límite;
- autorización negativa y aislamiento multi-tenant probados;
- protección frente a OWASP Top 10 aplicable;
- cookies, sesión, CSRF, CORS, CSP, rate limits y uploads revisados;
- PII cifrada en tránsito y reposo, minimizada y ausente de logs;
- pagos tokenizados mediante proveedor compatible; no almacenar datos de tarjeta;
- consentimientos, retención y derechos RGPD verificables.

#### Accesibilidad

Checks:

- <A11Y_AUTOMATED>
- <A11Y_MANUAL>

Umbrales:

- 0 hallazgos serious o critical en rutas clave;
- conformidad manual WCAG 2.2 AA;
- recorrido completo por teclado sin trampas;
- foco visible, orden lógico y anuncios correctos para lector de pantalla;
- contraste, zoom al 200%, reflow a 320 CSS px y objetivos táctiles;
- reduced motion respetado también por animaciones iniciadas desde JavaScript.

#### Rendimiento y resiliencia

Checks:

- <PERFORMANCE>
- <LOAD_TEST>

Umbrales web mínimos para rutas clave:

- LCP ≤ 2,5 s, INP ≤ 200 ms y CLS ≤ 0,1 en percentil 75;
- Lighthouse CI móvil ≥ 90 en rendimiento y ≥ 95 en accesibilidad;
- ningún presupuesto de bundle o transferencia definido en G0 excedido;
- ninguna regresión de latencia o peso superior al 10% sin aprobación del usuario.

G0 debe fijar el perfil de carga, concurrencia y SLO de API. El gate exige además:

- latencia y error rate dentro de ese SLO;
- 0 pérdida o corrupción de datos;
- degradación controlada ante caída de dependencias;
- invariantes de aforo, inscripción y pagos conservados bajo carga.

### G6 · Staging y ensayo operativo

Checks:

- <DEPLOY_PREVIEW>
- <DEPLOY_STAGING>
- <SMOKE_TEST>
- <OBSERVABILITY_CHECK>
- <BACKUP_RESTORE_DRILL>
- <ROLLBACK_DRILL>

Requisitos:

- staging equivalente a producción y aislado de ella;
- secretos gestionados fuera del repositorio;
- datos sintéticos o anonimizados;
- infraestructura reproducible;
- migración ejecutada con el mismo artefacto de release;
- logs estructurados con correlation ID, métricas y trazas;
- dashboards y alertas para disponibilidad, latencia, errores, inscripciones y pagos;
- runbook enlazado desde cada alerta;
- backup cifrado y restauración comprobada;
- rollback al artefacto anterior dentro del RTO acordado;
- smoke tests después del despliegue y después del rollback.

**PASS:** ensayo completo sobre el mismo artefacto y SHA propuestos para producción.

### G7 · Release y validación

Requisitos:

- G0–G6 aplicables en PASS y vigentes;
- cero defectos P0/P1;
- defectos P2 aceptados con responsable y fecha;
- matriz completa requisito → prueba → evidencia;
- changelog, guía operativa y rollback actualizados;
- artefacto inmutable, identificado por SHA y digest;
- UAT del usuario para journeys y marca;
- ventana, responsable y criterio de abortar definidos;
- despliegue canary o blue/green cuando la infraestructura lo permita;
- smoke y observación posterior al despliegue.

Solo el usuario valida el resultado de negocio. Antes de D3, Release Guardian emite
una recomendación `GO` o `NO-GO`; esta recomendación no es todavía un PASS de G7.
Después del despliegue autorizado, el Guardian valida el smoke, la observación y que
el entorno recibió exactamente el artefacto certificado; entonces cierra G7 en PASS.

## 7. Evidencia obligatoria

Cada gate genera un manifiesto con estos campos:

| Campo | Contenido |
|---|---|
| task_id | Identificador del paquete |
| gate_id | G0–G7 |
| commit_sha | SHA completo probado |
| base_sha | SHA de comparación |
| environment | Imagen, sistema, runtime y versiones |
| started_at / finished_at | Timestamps UTC |
| commands | Comando exacto, código de salida y duración |
| thresholds | Umbrales aplicados |
| results | Valores obtenidos |
| artifacts | Ruta, nombre, formato y hash de cada informe |
| defects | IDs y severidad de fallos encontrados |
| reviewer | Agente Guardian que verificó |
| status | PASS, FAIL, BLOCKED o INVALIDATED |
| reason | Explicación breve y verificable |

Artefactos esperados según el gate:

- logs de instalación y build;
- resultados JUnit o equivalente;
- cobertura en formato legible por máquina;
- informe de contratos y migraciones;
- trazas, screenshots o vídeo E2E solo cuando aporten evidencia;
- informes SAST, SCA, secretos, DAST y SBOM;
- informe de accesibilidad y checklist manual;
- resultados de rendimiento y carga;
- actas de backup/restore y rollback;
- manifiesto de release con digest.

No deben incluir secretos ni PII.

## 8. Invalidación automática

Un PASS deja de ser válido cuando cambia algo que afecte a su conclusión.

| Cambio | Gates que deben repetirse como mínimo |
|---|---|
| Código de aplicación | G1, G2, G4 y gates afectados |
| Regla de dominio | G1–G4 |
| Contrato API | G1, G3, G4, G5 y G6 |
| Esquema o migración | G1, G3, G4, G6 y G7 |
| Lockfile o runtime | G1–G6 |
| Autenticación/autorización | G1–G6 |
| Pago o webhook | G1–G6 |
| UI, tokens o navegación | G1, G2, G4 y accesibilidad/rendimiento de G5 |
| Infraestructura o configuración | G5–G7 |
| Observabilidad o alertas | G6 y G7 |
| Artefacto después de certificar | Todos los gates aplicables |

Release Guardian marca INVALIDATED, explica el disparador y devuelve la tarea al
primer estado que deba repetirse. La evidencia nunca se “arrastra” entre SHAs.

## 9. Defectos y severidad

- **P0:** pérdida/corrupción de datos, brecha, cobro incorrecto, caída total o
  imposibilidad de recuperar. Bloquea todo.
- **P1:** journey crítico roto, autorización incorrecta, incumplimiento AA grave,
  migración o rollback inseguro. Bloquea aceptación y release.
- **P2:** degradación relevante con alternativa temporal segura. Requiere responsable
  y fecha antes del release.
- **P3:** defecto menor sin impacto funcional o de riesgo apreciable. Puede entrar en
  backlog trazado.

## 10. Excepciones

Solo el usuario puede aprobar una excepción. Ningún agente, incluido Release
Guardian, puede concederla o inferirla.

La excepción debe indicar:

- exception_id;
- usuario que aprueba y timestamp UTC;
- gate, requisito y SHA afectados;
- riesgo concreto y peor consecuencia;
- motivo de negocio;
- controles compensatorios;
- responsable;
- fecha de expiración;
- condición de retirada;
- plan y fecha de corrección.

El resultado se registra como WAIVED_BY_USER, nunca como PASS. La excepción permite
avanzar únicamente en su alcance y hasta su caducidad. Al cambiar el SHA, vencer la
fecha o ampliarse el riesgo, vuelve a ser necesaria una aprobación explícita.

## 11. Bucle de supervisión

Para cada paquete, Release Guardian ejecuta:

1. Validar plantilla, alcance, dependencias y base SHA.
2. Confirmar READY o devolver preguntas bloqueantes.
3. Permitir implementación dentro de rutas autorizadas.
4. Exigir entrega y revisión independiente.
5. Ejecutar gates aplicables en checkout limpio.
6. Registrar evidencia y defectos.
7. Emitir PASS, FAIL, BLOCKED o INVALIDATED.
8. Permitir la siguiente transición solo con PASS vigente o WAIVED_BY_USER válido.
9. Repetir desde el punto afectado tras cualquier cambio.
10. Confirmar que el SHA desplegado coincide con el SHA certificado.

