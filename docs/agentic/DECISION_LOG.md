# OAK Decision Log

This file records only decisions that change product scope, user experience, legal exposure, cost or production risk. Technical implementation choices belong in ADRs.

| ID | Decision | Recommended default | Status | Approved by | Date | Evidence or notes |
| --- | --- | --- | --- | --- | --- | --- |
| D0 | MVP beachhead and commercial scope | Trail and running events in the Community of Madrid; athlete plus organizer; Stripe test mode; no real-money production launch | APPROVED | User (David) | 2026-11-20 | Aprobado íntegramente en sesión: beachhead Trail y Running en Comunidad de Madrid; Deportista + Organizador por invitación + Admin/Soporte auditable (AC-J08); web responsive es-ES; Stripe Checkout solo modo test (sin cobros reales ni payouts); Favoritos (AC-J02-04) INCLUIDO en V1; exclusiones V1 confirmadas (apps nativas, wearables, IA/ML, cronometraje/GPX en directo, dorsal digital, multiidioma/multimoneda) |
| D1 | Brand and UX contract | Spanish-first UI; canonical OAK tokens; unified IA; registration includes an explicit payment step; map and digital bib deferred | PENDING USER VALIDATION | - | - | Validate with clickable prototype and accessibility matrix |
| D2 | Beta acceptance | Approve staging after scripted UAT with athlete and organizer demo accounts | PENDING | - | - | Requires G6 PASS |
| D3 | Production release | Authorize only the immutable candidate recommended by the Guardian after G0-G6 and D2; the Guardian closes G7 after deployment smoke and observation | PENDING | - | - | Real payments remain disabled until separately authorized; requires release manifest and rollback rehearsal |

## Decision rules

- The Orchestrator proposes a recommendation, alternatives and consequences.
- The Release Guardian confirms that the artifact is testable before requesting validation.
- A user decision must be written here before dependent work starts.
- Silence is not approval. Technical defaults that do not affect the four categories above may be recorded in an ADR and executed autonomously.

