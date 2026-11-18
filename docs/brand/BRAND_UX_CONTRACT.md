# OAK Brand and UX Contract

## Document control

| Field | Value |
| --- | --- |
| Version | 0.1 |
| Status | Draft - requires Gate D1 approval |
| Date | 2026-11-11 |
| Scope | OAK responsive web platform for athletes and event organizers |
| Purpose | Convert the brand and web-experience decks into an implementable, testable contract |
| Approval owner | Product owner, brand owner and supervising agent at Gate D1 |

This contract defines the minimum brand and UX rules that design, development, content and QA agents MUST follow. It does not certify that the current decks are a functional product. The decks are static presentation references containing illustrative mockups, sample data and presentation-only code.

The terms **MUST**, **MUST NOT**, **SHOULD**, **SHOULD NOT** and **MAY** express requirement strength. Any exception to a MUST or MUST NOT requires a recorded decision approved by the supervising agent.

## 1. Sources and authority

### 1.1 Normative hierarchy

When two sources disagree, agents MUST apply this order:

1. This contract after Gate D1 approval.
2. Approved architecture decisions, product requirements and accessibility decisions created after this contract.
3. The OAK brand identity deck for brand purpose, personality, voice and visual intent.
4. The OAK web experience deck for UX intent, information architecture and illustrative screen direction.
5. The TFM memory for business context, hypotheses and validation strategy.
6. Existing HTML, CSS and JavaScript implementation details in either deck.

The presentation CSS and JavaScript MUST NOT be copied into production merely because they exist. They implement slide navigation and scaled mockups, not the platform.

### 1.2 Source inventory

| Source | Role | Normative content | Non-normative content |
| --- | --- | --- | --- |
| `sites/oak-brand-deck/dist/index.html` | Brand reference | Essence, purpose, vision, audience, positioning, personality, voice, palette, typography, photography and motion intent | Slide numbering, sample application layouts and presentation controls |
| `sites/oak-brand-deck/dist/styles.css` | Supporting evidence | Exact source color values and typeface names | Breakpoints, animation durations and CSS filters used only to display the deck |
| `sites/oak-web-design-deck/dist/index.html` | Product UX reference | Athlete and organizer domains, principal journeys, intended responsive behavior, component categories and accessibility promises | Sample names, dates, prices, event counts, metrics and mock screen data |
| `sites/oak-web-design-deck/dist/styles.css` | Supporting evidence | Visual relationships and illustrative component treatments | Tiny scaled font sizes, deck breakpoints and hardcoded colors |
| `Memoria_TFM_David_Cano_v.1.docx` | Business context | Platform hypothesis, multi-sided model and validation-first approach | Incomplete MVP, user-test and roadmap sections marked with placeholders |
| `figuras/*` | Academic figures | Methodological and positioning concepts only | Their navy, teal, blue and purple visual language; it is not OAK product branding |

### 1.3 Reference-only assets

The two decks contain identical copies of these assets:

- `oak-logo.png`
- `oak-mark.svg`
- `topography.svg`
- `oak-runner.png`
- `oak-cyclist.png`
- `oak-community.png`

They are references, not a complete production asset library. The full logo exists only as a large PNG, the reverse and monochrome examples are CSS-filtered derivatives, and provenance or licensing evidence is not included. Production use remains blocked until the asset deliverables in section 15 are approved.

### 1.4 Illustrative data rule

The following MUST be treated as mock data unless another approved specification says otherwise:

- David Cano and profile details.
- Trail del Robledal, Pedales de Guadarrama, 10K Madrid Rio and Sierra Norte Trail.
- Dates, distances, elevation, times, prices, capacity, registrations and revenue.
- Athlete levels such as Explorer and Pathfinder.
- Organizer names and dashboard metrics.
- Domain and URL examples such as `oak.run`.

These values MUST NOT become production constants, contractual pricing, analytics definitions or personal test data.

## 2. Brand foundation

### 2.1 Name and meaning

OAK represents:

- **Overcome**: face a challenge that once appeared difficult.
- **Achieve**: convert effort into progress.
- **Keep going**: treat each finish as the start of the next stage.

The oak-ring metaphor represents accumulated growth, resilience and adaptation. Topographic contours represent exploration. The orange route segment represents the next objective.

### 2.2 Purpose, vision and promise

- **Purpose**: help each person take on their next sporting challenge by reducing friction between intention and participation.
- **Vision**: connect the events that build each athlete's sporting history.
- **Master promise**: `Your next challenge starts here.`
- **Signature**: `Overcome. Achieve. Keep going.`

The promise and signature MAY remain in English as brand properties. Product interface copy defaults to Spanish as defined in section 3.4.

### 2.3 Positioning

OAK occupies the space between:

- activity and performance platforms, which record training, metrics and community activity; and
- event-entry platforms, which focus on registration, payment and event operations.

OAK's product territory is the continuous experience spanning discovery, participation and sporting history. Product decisions SHOULD strengthen this continuity rather than reproduce a generic event marketplace or a generic fitness tracker.

### 2.4 Audiences

The platform has two primary audiences:

1. **Athletes**, who need relevant events, clear decisions, low-friction registration and a connected history.
2. **Organizers**, who need participant acquisition, event operations and lasting relationships with their communities.

Partners, brands, sponsors and professional services are future ecosystem actors. They MUST NOT expand the MVP scope without a separate approved product decision.

### 2.5 Personality

Every user-facing experience MUST be:

- resilient without glorifying suffering;
- adventurous without implying recklessness;
- grounded rather than hyperbolic;
- human rather than mechanically performance-obsessed;
- ambitious without elitism;
- energetic without aggression.

## 3. Voice and content

### 3.1 Voice principles

OAK's voice is clear, active and encouraging. Copy MUST:

- connect the current action with a meaningful next step;
- use concrete verbs and plain language;
- recognize progress instead of demanding perfection;
- reduce uncertainty around dates, requirements, prices and consequences;
- respect different levels of ability and experience;
- avoid making participation sound like a moral obligation.

### 3.2 Preferred vocabulary

Preferred concepts include:

- reto;
- camino;
- constancia;
- descubrir;
- avanzar;
- historia;
- siguiente paso;
- trayectoria;
- preparación;
- comunidad.

These words MUST NOT be repeated mechanically. Clarity takes priority over brand vocabulary in transactional and safety-critical copy.

### 3.3 Prohibited tone

Agents MUST NOT write messages equivalent to:

- "sin limites";
- "solo para los mejores";
- "vence a todos";
- "no hay excusas";
- shame-based inactivity or abandonment messages;
- unsupported urgency or scarcity;
- promises of guaranteed sporting performance;
- copy that equates a person's worth with ranking, speed or completion.

### 3.4 Language policy

The MVP interface language is Spanish for Spain (`es-ES`). Agents MUST use Spanish for navigation, forms, system messages, help, errors and organizer tooling.

English is permitted only for:

- the approved master promise;
- the approved signature;
- established sport names when the Spanish audience commonly uses them;
- a future localized experience governed by an internationalization specification.

Mixed-language headings such as `Decision page`, `Conversion flow` or `Athlete home` are deck annotations and MUST NOT appear in production. Gate D1 MUST confirm whether the master promise and signature remain in English or receive approved Spanish alternatives.

### 3.5 Transactional copy

Transactional copy MUST state:

- what the action does;
- the amount or commitment before confirmation;
- whether progress is saved;
- what happens next;
- how to correct a problem or leave safely.

A button MUST use a specific action label such as `Continuar al pago`, `Guardar reto` or `Publicar evento`. Generic labels such as `Aceptar`, `Enviar` or arrow-only controls are prohibited when the action is not obvious from context.

## 4. Canonical design tokens

### 4.1 Token authority

The names below replace the inconsistent `mist`/`sand` and `forest-deep`/`deep` names found in the decks. Production code MUST consume semantic tokens rather than scattering hexadecimal values. A generated token package is a Gate D1 deliverable.

### 4.2 Primitive color tokens

| Token | Value | Intended role |
| --- | --- | --- |
| `oak.color.forest.950` | `#08291F` | Deep inverse surfaces and immersive sections |
| `oak.color.forest.700` | `#12372A` | Core brand color, navigation and strong text |
| `oak.color.ground.900` | `#17211B` | Primary text on light and bright surfaces |
| `oak.color.lime.400` | `#B7F34A` | Progress, discovery and positive forward action |
| `oak.color.orange.500` | `#FF6B35` | Primary action and next-challenge accent |
| `oak.color.sky.400` | `#28B7E9` | Discovery or informational accent |
| `oak.color.sand.300` | `#E3D4BB` | Default canvas |
| `oak.color.cream.100` | `#EADCC5` | Raised light surface and inverse text |
| `oak.color.muted.700` | `#4D6258` | Secondary text on approved light surfaces |
| `oak.color.line` | `rgba(18, 55, 42, 0.18)` | Light-surface dividers and borders |

Pure white and pure black MUST NOT be introduced as OAK brand surfaces or text colors. They MAY appear inside third-party content, payment widgets, maps or user-supplied media when OAK does not control the source.

The percentages in the brand deck describe an approximate marketing composition, not a pixel quota for every screen. Functional contrast and hierarchy take precedence.

### 4.3 Semantic color tokens

| Semantic token | Primitive mapping | Required use |
| --- | --- | --- |
| `surface.canvas` | `sand.300` | Default page background |
| `surface.raised` | `cream.100` | Cards, sheets and form surfaces |
| `surface.brand` | `forest.700` | Brand navigation or strong sections |
| `surface.inverse` | `forest.950` | Immersive sections and inverse content |
| `text.primary` | `ground.900` | Main content on light/bright surfaces |
| `text.secondary` | `muted.700` | Supporting content where the approved contrast is retained |
| `text.brand` | `forest.700` | Brand headings on light surfaces |
| `text.inverse` | `cream.100` | Content on forest surfaces |
| `action.primary.background` | `orange.500` | Primary calls to action |
| `action.primary.foreground` | `ground.900` | Text and icons on primary actions |
| `action.secondary.foreground` | `forest.700` | Secondary action on a light surface |
| `progress.background` | `lime.400` | Progress, completion and forward movement |
| `progress.foreground` | `forest.700` | Text or icon on progress surfaces |
| `info.background` | `sky.400` | Informational emphasis only |
| `info.foreground` | `ground.900` | Text or icon on informational emphasis |
| `focus.on-light` | `forest.700` | Focus ring on sand, cream, lime, orange or sky |
| `focus.on-dark` | `lime.400` | Focus ring on forest surfaces |

Success, warning, danger and disabled semantic palettes are unresolved Gate D1 items. Until approved, agents MUST NOT invent green, yellow or red tokens or misuse lime and orange as universal status colors. Error and success states still require text and icons as defined in section 11.

### 4.4 Approved contrast pairs

The ratios below were calculated from the deck colors. All functional UI copy SHOULD meet at least 4.5:1 even when WCAG permits a lower ratio for large text.

| Foreground | Background | Ratio | Rule |
| --- | --- | ---: | --- |
| Ground `#17211B` | Sand `#E3D4BB` | 11.34:1 | Allowed |
| Forest `#12372A` | Sand `#E3D4BB` | 8.97:1 | Allowed |
| Muted `#4D6258` | Sand `#E3D4BB` | 4.50:1 | Allowed with caution; use Ground for dense or small copy |
| Cream `#EADCC5` | Forest `#12372A` | 9.68:1 | Allowed |
| Cream `#EADCC5` | Deep Forest `#08291F` | 11.54:1 | Allowed |
| Forest `#12372A` | Lime `#B7F34A` | 9.92:1 | Allowed |
| Ground `#17211B` | Lime `#B7F34A` | 12.55:1 | Allowed |
| Forest `#12372A` | Orange `#FF6B35` | 4.61:1 | Allowed for normal text; Ground is preferred |
| Ground `#17211B` | Orange `#FF6B35` | 5.83:1 | Allowed and preferred |
| Ground `#17211B` | Sky `#28B7E9` | 7.12:1 | Allowed |
| Forest `#12372A` | Sky `#28B7E9` | 5.63:1 | Allowed |
| Lime `#B7F34A` | Deep Forest `#08291F` | 11.83:1 | Allowed |
| Orange `#FF6B35` | Deep Forest `#08291F` | 5.50:1 | Allowed |
| Sky `#28B7E9` | Deep Forest `#08291F` | 6.71:1 | Allowed |

### 4.5 Prohibited contrast pairs

| Foreground | Background | Ratio | Rule |
| --- | --- | ---: | --- |
| Orange `#FF6B35` | Sand `#E3D4BB` | 1.94:1 | Prohibited for text and meaningful icons |
| Sky `#28B7E9` | Sand `#E3D4BB` | 1.59:1 | Prohibited for text and meaningful icons |
| Cream `#EADCC5` | Orange `#FF6B35` | 2.10:1 | Prohibited for text and meaningful icons |
| Lime on Sand or Cream | Light surface | Insufficient | Prohibited for text and meaningful icons |

Orange, sky and lime MAY appear as non-text decorative accents on light surfaces only when the information remains available without color. Every new foreground/background pair MUST be verified automatically and reviewed at Gate D1 or a subsequent design-system gate.

## 5. Typography

### 5.1 Families and roles

- **Sora** is the display family for page titles, section headings, campaign messages and significant metrics.
- **Inter** is the interface family for navigation, body copy, forms, tables, labels and operational data.

Production MUST use approved local WOFF2 files or an approved privacy/performance strategy. The decks' Google Fonts request is not a production dependency. Font licensing evidence and files are Gate D1 deliverables.

### 5.2 Production type scale

| Token | Family | Size | Line height | Weight | Use |
| --- | --- | ---: | ---: | ---: | --- |
| `type.display` | Sora | `clamp(48px, 5vw, 72px)` | 0.98 | 700 | Marketing and primary product hero only |
| `type.heading.xl` | Sora | `clamp(40px, 4vw, 48px)` | 1.05 | 700 | Page title |
| `type.heading.lg` | Sora | 32px | 1.10 | 600 | Major section |
| `type.heading.md` | Sora | 24px | 1.20 | 600 | Card or subsection heading |
| `type.heading.sm` | Sora | 20px | 1.25 | 600 | Compact heading |
| `type.body` | Inter | 16px | 1.50 | 400 | Default copy and form values |
| `type.body.small` | Inter | 14px | 1.45 | 400 or 500 | Supporting copy |
| `type.label` | Inter | 12px | 1.25 | 600 or 700 | Labels and overlines |

Production text MUST NOT use the 4-10 px sizes present in the scaled deck mockups. Labels MUST NOT be smaller than 12 px. Agents MUST use available weights 400, 500, 600, 700 or 800 and MUST NOT request synthesized weight 650.

Uppercase labels require short copy and increased tracking. Long-form body text, form values and error messages MUST use sentence case.

## 6. Logo and graphic language

### 6.1 Logo intent

The O symbol combines topographic contours and oak growth rings. The orange segment indicates the next stage of the route.

Agents MUST preserve the logo's aspect ratio and MUST NOT redraw, stretch, rotate, outline, recolor individual paths or recreate variants with CSS filters in production.

### 6.2 Permitted graphic motifs

The following motifs MAY support hierarchy or storytelling:

- contour lines;
- growth rings;
- a route line;
- a destination point;
- progress revealed along a path.

They MUST remain secondary to content and MUST NOT reduce legibility, imply inaccurate route data or make a functional map look decorative.

### 6.3 Pending logo rules

Gate D1 MUST approve:

- vector wordmark master;
- vector symbol master;
- primary, inverse and monochrome exports;
- clear space;
- minimum digital and print size;
- permitted backgrounds;
- favicon and app-icon constructions;
- misuse examples;
- ownership and license record.

Until approval, the existing logo files MAY be used only for prototypes and internal review.

## 7. Photography and media

Photography SHOULD show real effort, natural light, imperfect movement, terrain and human connection. People SHOULD appear within a credible environment rather than as isolated studio athletes.

The system SHOULD represent a wider range of age, body type, ability, discipline, location and level than the three current outdoor-endurance images. The statement "each person" MUST be supported by the media library.

Agents MUST:

- preserve a natural color treatment;
- avoid artificial brand-color filters;
- use overlays only to achieve text contrast;
- select crops that preserve the activity and leave intentional copy space;
- provide meaningful alt text when the image conveys content;
- use empty alt text for truly decorative images;
- avoid repeating the same hero image across several production pages;
- deliver responsive WebP or AVIF variants with dimensions and fallback behavior;
- record origin, author, generation method, model release where relevant and usage rights.

The existing 1672 x 941 PNG photographs are too heavy for direct production use and have no included rights record. They remain prototype assets until Gate D1.

## 8. Motion

Motion MUST orient the user or communicate progress. It MUST NOT exist only as visual noise.

Permitted patterns include:

- a route revealing toward a destination;
- rings building to represent accumulated progress;
- a short entrance that clarifies hierarchy;
- a state transition that preserves spatial context.

Provisional motion tokens are:

| Token | Duration | Use |
| --- | ---: | --- |
| `motion.fast` | 160 ms | Hover, press and small state feedback |
| `motion.standard` | 240 ms | Component transitions |
| `motion.reveal` | 480 ms | Section or content reveal |
| `motion.route.max` | 1200 ms | Branded route/ring sequence |
| `motion.ease.out` | `cubic-bezier(.16, 1, .3, 1)` | Default entrance and state easing |

Agents MUST NOT block interaction while decorative motion completes. Under `prefers-reduced-motion: reduce`, route drawing, pulsing, parallax, smooth scrolling and nonessential transforms MUST be removed. Essential state changes MUST remain immediate and understandable.

Gate D1 MUST confirm the motion tokens through a production prototype.

## 9. Information architecture and routes

### 9.1 Shared platform domains

The platform has a shared identity and data layer with two product domains:

- athlete experience;
- organizer workspace.

Authentication, event, participant and registration data SHOULD be shared through defined services rather than duplicated between experiences.

### 9.2 Athlete navigation

The canonical primary navigation is:

1. `Inicio`
2. `Explorar`
3. `Mis retos`
4. `Trayectoria`

Profile and settings are accessed from the account/avatar control rather than replacing `Trayectoria` in mobile navigation. This resolves the deck's inconsistent `Mi trayectoria`, `Trayectoria`, `Mis retos` and `Perfil` labels.

### 9.3 Athlete route contract

| Route | Purpose | Authentication |
| --- | --- | --- |
| `/` | Discovery-oriented home | Optional |
| `/explorar` | Search, filters, results and map/list choice | Optional |
| `/retos/:eventSlug` | Public event decision page | Optional |
| `/entrar` | Sign in | No |
| `/registro` | Account creation | No |
| `/recuperar-acceso` | Access recovery | No |
| `/inscripciones/:eventId/modalidad` | Registration stage 1 | Required before commitment |
| `/inscripciones/:eventId/datos` | Registration stage 2 | Required |
| `/inscripciones/:eventId/revision` | Registration stage 3, review and explicit consents | Required |
| `/inscripciones/:eventId/pago` | Registration stage 4, payment | Required |
| `/inscripciones/:eventId/resultado` | Durable success, pending, cancelled or failed result | Required |
| `/mis-retos` | Upcoming and past registrations | Required |
| `/trayectoria` | History, progress and passport | Required |
| `/perfil` | Personal, privacy and account settings | Required |

The registration route names are provisional until Gate D1 confirms the payment architecture and whether checkout is hosted internally or externally.

### 9.4 Organizer navigation and routes

The canonical organizer navigation is:

1. `Resumen`
2. `Eventos`
3. `Participantes`
4. `Comunicaciones`
5. `Analitica`

| Route | Purpose |
| --- | --- |
| `/pro` | Organizer summary |
| `/pro/eventos` | Event list and lifecycle |
| `/pro/eventos/nuevo` | Event creation |
| `/pro/eventos/:eventId` | Event overview and public-preview access |
| `/pro/eventos/:eventId/participantes` | Participant and document operations |
| `/pro/eventos/:eventId/comunicaciones` | Event communications |
| `/pro/eventos/:eventId/analitica` | Registration and commercial analytics |

Publishing workflows, organizer roles and permissions, audit history, exports and event lifecycle states remain Gate D1 product decisions.

## 10. Journeys

### 10.1 Brand-to-product journey mapping

The brand journey and UX journey are complementary:

| Brand stage | Product stages | Required outcome |
| --- | --- | --- |
| Discover | Inspiration and exploration | A relevant challenge can be found and compared |
| Commit | Decision and registration | The athlete understands the commitment and completes it safely |
| Grow | Continuity | Participation becomes part of a useful sporting history |

Agents MUST use the five product stages for detailed flows and the three brand stages for high-level narrative.

### 10.2 Athlete discovery journey

1. The home experience presents relevant events or an explicit path to search.
2. Search supports sport and location at minimum.
3. Exploration supports date, distance, elevation and level when those fields apply to the sport.
4. Active filters remain visible and individually removable.
5. Results show the minimum comparison set: discipline, date, location, distance or format, and price.
6. Empty, loading, partial-data and error states provide a next action.
7. Map view MUST be a real alternate representation or MUST be removed from the MVP. A decorative map button is prohibited.

Recommendation logic and the meaning of `Para ti` are Gate D1 items. Until defined, personalized language MUST NOT imply algorithmic personalization.

### 10.3 Event decision journey

The event page MUST expose before the primary registration action:

- event name and discipline;
- date and location;
- distance or event format;
- elevation when applicable;
- level or eligibility;
- time limit when applicable;
- total starting price and mandatory fees;
- what the price includes;
- organizer identity;
- capacity or availability state;
- cancellation/refund summary;
- route or course information when available;
- accessibility and safety information required by the event.

The deck's registered-athlete count MAY be shown only when its definition, freshness and privacy implications are documented.

### 10.4 Registration journey

The canonical registration model has four explicit stages:

1. **Modalidad**: category, distance, wave or participation option.
2. **Datos**: participant details and event-specific required fields.
3. **Revision**: summary, corrections and explicit consents.
4. **Pago**: payment authorization followed by a durable result state.

This deliberately supersedes the desktop deck's three-step promise and adopts the Gate D1 recommended default that payment is an explicit step. It also aligns with the mobile `Continuar al pago` action. The four-step model remains pending user validation at Gate D1.

The flow MUST:

- display the total and mandatory fees before payment;
- preserve entered data when a recoverable interruption occurs;
- explain the save duration and privacy implications;
- reuse profile data only after user review;
- identify required and optional fields;
- link regulations and required policies before consent;
- prevent duplicate submission;
- handle payment pending, declined, timed out, cancelled and successful states;
- issue a durable confirmation and registration reference;
- allow the user to return to `Mis retos`.

Refunds, transfers, waitlists, invoicing, payment provider, age rules, health data and identity-document handling are Gate D1 blockers for implementation of checkout.

### 10.5 Continuity journey

After a confirmed event, the platform SHOULD provide:

- the upcoming challenge and countdown;
- registration documents and status;
- event instructions and updates;
- preparation information when supplied by the organizer;
- completion and result history;
- a path to the next relevant challenge.

Levels, badges, passport stamps, sharing and progress titles are optional gamification concepts. They MUST NOT enter the MVP until Gate D1 defines their value, rules, accessibility and anti-pressure safeguards.

### 10.6 Organizer journey

The organizer experience MUST support a traceable flow from event draft to publication and participant operations. At minimum, the intended domain includes:

- event creation and public preview;
- publication readiness;
- capacity and registration monitoring;
- participant and document review;
- event communications;
- analytics for registrations, occupancy and revenue.

The deck dashboard is a directional example. KPI definitions, accounting treatment, permissions and data freshness MUST come from approved product and data specifications.

## 11. Component and state contract

### 11.1 Required component families

The production design system MUST cover:

- primary, secondary, tertiary and icon buttons;
- links;
- text, select, checkbox, radio and date inputs;
- search input;
- filter chips and removable selected filters;
- event cards;
- navigation and account controls;
- price and registration summary;
- stepper/progress indicator;
- dialog and mobile bottom sheet;
- table or participant list;
- status indicator;
- inline alert and global notification;
- skeleton or progress indicator;
- empty and error-state patterns.

Unicode glyphs such as `⌂`, `⌕`, `◉`, `⚙`, `♡` and arrow characters MUST NOT serve as the production icon system. Gate D1 MUST approve a consistent SVG icon library.

### 11.2 Universal interactive states

Every interactive component MUST define and test:

| State | Requirement |
| --- | --- |
| Default | Clear affordance, accessible name and valid contrast |
| Hover | Reinforces interactivity without moving layout |
| Focus visible | 3 px ring using the approved light/dark focus token, with at least 2 px separation where needed |
| Active/pressed | Immediate visible feedback without relying only on motion |
| Selected/current | Exposed visually and programmatically |
| Disabled | Non-interactive, programmatically disabled and not communicated by opacity alone |
| Loading | Preserves dimensions, prevents duplicate activation and exposes status to assistive technology |
| Error | Explains the problem and recovery action; never color-only |
| Success | Confirms the completed result and next available action; never color-only |

All pointer targets MUST be at least 48 x 48 CSS px. Adjacent targets MUST have enough separation to avoid accidental activation.

### 11.3 Form states

Inputs MUST have persistent visible labels. Placeholder text MUST NOT replace a label. Each field MUST define:

- empty;
- filled;
- focus;
- optional or required;
- invalid before submission when validation is safe;
- invalid after submission;
- disabled;
- read-only;
- loading or verification pending where applicable.

Errors MUST be adjacent to the field, linked with `aria-describedby`, summarized at the start of a failed submission and announced without unexpectedly moving focus.

### 11.4 Content states

Every data-backed page or region MUST define:

- initial loading;
- delayed loading;
- empty result;
- filtered empty result;
- partial data;
- stale data when freshness matters;
- recoverable error;
- non-recoverable or permission error;
- offline/retry behavior where relevant.

Skeletons MUST resemble the final hierarchy, MUST stop under reduced motion and MUST NOT hide errors indefinitely.

### 11.5 Pending semantic states

Exact success, warning, danger, disabled and data-visualization tokens are Gate D1 blockers for the design-system package. Text, icon and programmatic semantics are required regardless of final color selection.

## 12. Responsive contract

### 12.1 Canonical breakpoints

The following ranges resolve the gap between the deck's `1440+` desktop example and its `768-1199` tablet range:

| Mode | Range | Grid | Intent |
| --- | --- | ---: | --- |
| Mobile | 320-767 px | 4 columns | One primary task, thumb-reachable actions and persistent essential navigation |
| Tablet | 768-1199 px | 8 columns | Stacked hierarchy with contextual secondary actions |
| Desktop | 1200 px and above | 12 columns | Wider narrative, comparison and operational panels |

1440 px remains the principal desktop design canvas, not the desktop breakpoint. Deck CSS breakpoints at 1000, 760 and 650 px are presentation implementation details and are not normative.

Gate D1 MUST approve maximum content width, gutters, spacing scale and container behavior.

### 12.2 Adaptation rules

- Hierarchy MUST adapt; desktop layouts MUST NOT simply be scaled down.
- Filters SHOULD remain visible on desktop and use a dialog or bottom sheet on mobile.
- Event registration CTA MAY be sticky on mobile if it does not cover content, errors or system UI.
- Tables MUST transform into an accessible narrow-screen representation rather than require two-dimensional scrolling for primary tasks.
- Text MUST reflow without horizontal page scrolling at 320 CSS px.
- Content MUST remain usable at 200% browser zoom.
- Navigation labels, actions and data MUST preserve meaning between modes.
- A user MUST be able to pause and resume multi-step work across viewport changes.

### 12.3 Reference viewport suite

Design and regression testing MUST include at least:

- 320 x 568;
- 390 x 844;
- 768 x 1024;
- 1200 x 800;
- 1440 x 900.

## 13. Accessibility contract

The production target is WCAG 2.2 AA. Passing an automated scanner is necessary but insufficient.

### 13.1 Structural requirements

Every production page MUST provide:

- a descriptive page title;
- one clear `h1` and a logical heading hierarchy;
- semantic header, navigation, main and footer landmarks;
- a skip link when repeated navigation precedes main content;
- lists, tables and forms expressed with appropriate native semantics;
- a language attribute matching the visible language.

### 13.2 Keyboard and focus

- All functionality MUST work without a pointer.
- Focus order MUST follow reading and task order.
- Focus MUST remain visible and MUST NOT be hidden by sticky content.
- Dialogs and bottom sheets MUST manage focus, expose their name and close predictably.
- No component may create an unescapable keyboard trap.
- Route changes and validation outcomes MUST move or announce focus intentionally.

### 13.3 Visual access

- Text and meaningful icons MUST use approved contrast pairs.
- Focus indicators MUST have at least 3:1 contrast against adjacent colors.
- Information MUST NOT rely on color, position, shape or motion alone.
- Text MUST support zoom and reflow without clipping or overlap.
- Images of text are prohibited except for approved logos.

### 13.4 Screen-reader and form access

- Every icon-only control requires an accessible name.
- Decorative images use empty alt text; informative images require purpose-specific alt text.
- Status updates use an appropriate live region without excessive announcement.
- Fields expose label, description, requirement, error and validity programmatically.
- Price, date, distance and elevation formats MUST read unambiguously.

### 13.5 Motion and cognitive access

- Reduced-motion preferences MUST disable nonessential animation.
- Time limits MUST be avoidable, extendable or clearly justified.
- Instructions MUST be placed before the interaction they govern.
- Destructive or financial actions MUST provide review and recovery where possible.
- Progress language MUST encourage without creating shame or pressure.

### 13.6 Required accessibility verification

Before a story can pass its quality gate, QA MUST complete:

- automated axe or equivalent checks;
- keyboard-only task completion;
- focus visibility and order review;
- contrast verification for every introduced pair;
- 200% zoom and 320 px reflow review;
- reduced-motion review;
- screen-reader review of changed critical flows with NVDA plus at least one mobile screen reader for mobile-critical work.

## 14. Visual regression contract

### 14.1 Baseline authority

The decks define visual direction, not pixel-perfect production baselines. Production baselines MUST be captured from a Gate D1-approved implementation using the canonical tokens and masters.

### 14.2 Deterministic capture

Visual regression fixtures MUST:

- use fixed seed data that contains no real personal information;
- freeze dates, time zones and random values;
- wait for approved fonts and images to load;
- disable nonessential animation and caret blinking;
- use the reference viewport suite;
- capture the same theme, locale and data state;
- mask only documented nondeterministic third-party regions.

### 14.3 Required baseline pages and states

At minimum, baselines MUST cover:

- public home;
- exploration with no filters, active filters and no results;
- event detail in available, almost full, sold-out and cancelled states once defined;
- every registration stage and validation failure;
- payment success, pending and failure once implemented;
- `Mis retos` with empty and populated data;
- `Trayectoria` with empty and populated history;
- organizer summary;
- organizer event list and participant/document state;
- mobile navigation and bottom sheet;
- visible keyboard focus on each critical page.

### 14.4 Review criteria

An unapproved visual diff blocks progression. Reviewers MUST check:

- token and typography fidelity;
- logo integrity;
- image crop and overlay contrast;
- spacing and alignment;
- text wrapping and truncation;
- overflow at every reference viewport;
- focus indicators;
- loading, empty, error, disabled and selected states;
- no accidental use of prohibited color pairs;
- no deck-only copy, mock values or Unicode icons entering production.

Automated pixel thresholds MAY filter rendering noise but MUST NOT auto-approve a change to layout, typography, brand color, logo or critical-action hierarchy. The supervising agent is the final visual-regression gatekeeper.

## 15. Gate D1 decisions and required deliverables

Gate D1 freezes the minimum brand and UX foundation. Development MAY perform spikes before D1, but production UI stories MUST NOT progress beyond a non-mergeable prototype until every blocker below is closed.

### 15.1 D1 blockers

| ID | Decision or deliverable | Acceptance evidence |
| --- | --- | --- |
| D1-01 | Approve this contract and named owners | Recorded approval and version tag |
| D1-02 | Freeze canonical color, type, spacing, radius, elevation, breakpoint and motion tokens | Machine-readable token package plus documentation |
| D1-03 | Approve vector logo masters and usage rules | SVG masters, exports, clear-space/minimum-size sheet and misuse examples |
| D1-04 | Confirm font licensing and delivery | License record, WOFF2 files, fallback and loading strategy |
| D1-05 | Approve semantic success, warning, danger, disabled and chart colors | Contrast-tested semantic matrix |
| D1-06 | Freeze MVP language policy and approved master copy | Content decision and glossary |
| D1-07 | Approve primary navigation, route vocabulary and account access | IA map and route list |
| D1-08 | Resolve registration, payment, refund, cancellation, invoice and failure states | End-to-end flow with acceptance criteria |
| D1-09 | Define authentication, profile, privacy, consent, age and sensitive-document requirements | Product, legal and security approval |
| D1-10 | Define MVP sport, geography, event fields and organizer scope | Signed MVP scope |
| D1-11 | Approve component inventory and all universal states | Component specification and accessible prototype |
| D1-12 | Approve photography provenance and responsive asset pipeline | Rights log and optimized asset set |
| D1-13 | Approve accessibility test plan | WCAG checklist, assistive-technology matrix and accountable owner |
| D1-14 | Establish production visual-regression baselines | Reviewed captures at required viewports |

### 15.2 Product decisions that may be deferred only by explicit scope

- Personalization and the definition of `Para ti`.
- Real map experience and map provider. Map is deferred from the recommended MVP.
- Digital bib display. It is mentioned in the mobile strategy but is deferred from the recommended MVP.
- Saved/favorite events.
- Athlete levels, passport, badges and sharing.
- Preparation plans.
- Waitlist and registration transfer.
- Organizer team roles and permissions.
- Communications channels and templates.
- Analytics definitions, attribution and freshness.
- External activity-platform integrations.
- Expansion beyond the initial sports and geography.

If deferred, the related control, promise and route MUST be removed from the MVP rather than left as a dead or simulated interface.

### 15.3 Asset and design-system deliverables

The following repository deliverables are still missing:

- machine-readable design tokens;
- source-controlled component library;
- vector logo kit;
- icon library;
- local font files and licenses;
- responsive image derivatives and provenance log;
- high-fidelity interactive prototype;
- screen and state inventory;
- content glossary and error-message library;
- accessibility annotations;
- visual-regression fixtures and baselines.

## 16. Supervisory quality gate

The supervising agent MUST block a story or phase when any applicable condition is true:

- a previous dependency has not passed its automated and manual tests;
- a D1 blocker is being bypassed with an invented design decision;
- production code copies presentation-only CSS or uses mock data as a constant;
- a component lacks a required state;
- a new color pair has not been contrast-tested;
- keyboard, focus, reflow or reduced-motion tests fail;
- a visual diff remains unexplained or unapproved;
- copy conflicts with the OAK voice or language policy;
- the logo or photography lacks approved production provenance;
- the implementation exposes a route or promise whose functional behavior is absent.

Progression requires evidence, not a verbal assertion that the screen "looks like the deck." Evidence includes passing automated checks, manual critical-flow results, approved visual diffs, accessibility review and traceability to this contract or an approved decision.

## 17. Definition of brand and UX done

A feature is brand- and UX-complete only when:

1. Its purpose and route match the approved IA.
2. Its copy follows the language and voice rules.
3. It uses canonical semantic tokens and approved assets.
4. Every applicable component state exists.
5. Mobile, tablet and desktop behavior has been verified.
6. Keyboard, focus, screen-reader, contrast, zoom, reflow and reduced-motion checks pass.
7. Loading, empty, partial, error and success states have been exercised.
8. Critical actions expose price, commitment and consequence before confirmation.
9. Visual-regression changes are approved.
10. No illustrative deck data, presentation code or unresolved placeholder has reached production.

The static decks remain valuable references for intent and storytelling. They are not evidence that any production feature has been implemented, integrated, secured, made accessible or tested.
