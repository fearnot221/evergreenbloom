# Interactions

## Existing behavior

The 2026-09-29 greenfield inspection predates the implemented E2 Festival Web App.
For current behavior and verification, read [ARCHITECTURE.md](ARCHITECTURE.md),
[PROTOTYPE-NOTES.md](PROTOTYPE-NOTES.md) and [MAP-DATA.md](MAP-DATA.md).
This document defines permanent interaction policy. On 2026-10-16 the user replaced
the Bloom visuals with 春空 Spring Sky; the inventory below is the current behaviour.

### Current interaction inventory (2026-10-16)

| Interaction | Source | Behaviour | Reduced motion |
| --- | --- | --- | --- |
| Hero entrance | `src/styles/home.css` | Title rises once (720 ms ease-out), supporting copy fades up after 380 ms; content is visible if animation never runs | No movement |
| Ambient sparkles and petals | `components.css`, `home.css` | Sparkles breathe three times; six petals fall for two passes, then stop. Transform/opacity only | Removed |
| Scroll reveal | `.reveal` in `base.css` | CSS `animation-timeline: view()`, 28 px rise; no JS listener | Content static |
| Header frost | `shell.css` | Scroll-driven fade-in of the frosted header bar over 120 px | Same (no motion) |
| 更多 sheet | `App.tsx`, `shell.css` | Native `<dialog>`; slides up 320 ms (drawer curve), exits 200 ms; Escape, backdrop and close button; focus returns to 更多. Transitions.dev "Panel reveal" pattern | 150 ms opacity |
| Disclosures (program, FAQ, map help) | `components.css` | Native `<details>`; chevron rotates; height animates via `::details-content` where supported. Transitions.dev "Accordion" pattern | Instant |
| Filter chips | `ProgramPage.tsx` | Native radio inputs; URL holds state; press scale 0.96 | Colour change only |
| Buttons, tabs, tiles, cards | `base.css`, `components.css` | Press scale 0.94-0.97; hover lift only under `(hover: hover)` | Unchanged colour states |
| Route change | `use-route-focus.ts` | Focus moves to the new `main`; Back/Forward restores scroll. Loading shows a pulsing skeleton (Transitions.dev "Skeleton loader") | No pulse |
| Language notice | `App.tsx` | Expands under the header; Escape or button closes and returns focus | No movement |

Transitions.dev was checked on 2026-10-16; patterns were re-implemented in CSS, not copied.

As features are defined and implemented, inventory each interaction with its route/component,
trigger, state change, feedback, keyboard/touch behavior, focus handling,
interruption/cleanup, reduced-motion behavior, and source path.

## Meaningful opportunities

These are conditional review prompts, not an implementation backlog:

| If the product includes… | Useful behavior to evaluate | Reason |
| --- | --- | --- |
| Async actions or forms | Immediate pending state, inline error and retry, clear completion | Prevent duplicate actions and support recovery |
| Menus or dialogs | Visible state, appropriate focus management, Escape dismissal and focus return | Preserve orientation and operability |
| Copy or other invisible effects | Concise accessible confirmation | Confirm an otherwise invisible outcome |
| Expandable content | Explicit expanded state and optional short transition | Explain the relationship between trigger and content |
| Drag operations | Clear destination feedback and non-drag alternative | Support direct manipulation and alternate input |

Use local visible feedback when it already communicates success; do not add a
toast to every action. Never invent a feature just to create an animation opportunity.

## Reference roles and permanent workflow

| Resource | Responsibility |
| --- | --- |
| Taste | Visual quality, typography, composition and hierarchy |
| Hallmark | Identify generic / AI-generated website patterns |
| Emil | Interaction philosophy, purpose, timing and behavior |
| [Transitions.dev](https://transitions.dev/) | UI state-transition references and implementation patterns |
| GSAP | Complex choreography, timelines, scroll-driven animation and major 春空 sequences |
| Three.js / WebGL | Spatial / 3D experiences where DOM/CSS is insufficient |

Transitions.dev is a **motion reference and implementation resource**, not the
visual identity of 松櫻祭, a required runtime library, or a replacement for Emil's
purpose-first decisions. Its public catalogue includes menu, panel, accordion,
tab, icon, tooltip and loading-transition examples (checked 2026-09-30).
Consult relevant examples during future implementation/refinement; availability
of a recipe does not establish its suitability, accessibility or performance here.

For interactive UI:

1. **Purpose — Emil:** identify the state change, user task, frequency and what
   would be lost without motion. Keep an immediate state change when appropriate.
2. **Reference — Transitions.dev:** look for a relevant pattern; if none fits,
   proceed with the simplest suitable behavior rather than forcing a match.
3. **Adapt — Spring Sky:** translate the underlying behavior into the
   **SEED → UNFOLD → BLOSSOM → FESTIVAL** vocabulary and the 春空 visual system.
4. **Implement simply:** use CSS/native browser animation when sufficient.
5. **Escalate deliberately:** use GSAP only when choreography/timeline complexity
   justifies it; consult the implementation hierarchy below for intermediate needs.
6. **Reduced motion:** preserve states, information and actions without spatial motion.
7. **Performance:** check properties, layout, rendering cost, bundle impact and cleanup.
8. **Taste:** review visual consistency, hierarchy, scale, spacing and restraint.
9. **Hallmark:** reject generic effects, copied styling and repetitive animation.

### Applicable component contexts

Consult Transitions.dev for menu open/close, mobile navigation, dropdowns,
accordions, tabs, filters, expanding event details, announcement interactions,
state changes, icon transitions, buttons, tooltips, loading states, map information
panels, PWA UI states, small page-transition details and other component-level
transitions. This list defines where to consider the reference, not where motion
must be added. Component-level map panels do not require the 3D renderer to animate.

### Translation into the SEED → FESTIVAL vocabulary

Mapped onto 春空: SEED is the pine cone and closed states; UNFOLD is the sheet,
disclosure and language notice opening from their triggers; BLOSSOM is the hero
title and selected chip/location resolving; FESTIVAL is the triptych and the finite
falling petals.

Treat the vocabulary as a relationship between states: **SEED** is compact or
latent; **UNFOLD** reveals context from its trigger; **BLOSSOM** makes the active or
resolved state clear; **FESTIVAL** describes coordinated, broader storytelling.
Use the relevant relationship, not a mandatory four-stage animation on every
control. A menu might unfold from its trigger; a selected tab or completed PWA
save might resolve immediately into a clear active state. Do not invent literal
petals, a flower icon morph or celebration effects for every transition.

Adapt origin, direction, scale, duration, easing and interruption behavior to the
春空 Spring Sky language. Preserve semantic controls, immediate focus, keyboard and
touch operation, and honest async/error state. Never delay event information or
announce success before an operation actually completes. Small page transitions
must preserve history, focus and scroll behavior and never gate essential content.

For an adopted pattern, record its actual source URL, purpose, component/state,
adaptations, chosen implementation, reduced-motion equivalent and relevant test
results in the implementation notes. Do not assume example code's blur, bounce,
layout animation, dependencies or defaults are justified for this project.

## Motion principles

Apply Emil Kowalski's decision sequence: frequency, purpose, appropriate timing,
and interruption behavior. The default is no motion until a user benefit is clear.

- Animate to explain state, maintain spatial continuity, or acknowledge input.
- Frequent actions and keyboard-driven navigation should respond immediately.
- Keep focus indicators immediate. Never wait for animation before accepting input.
- Anchor popover motion to its trigger; keep movement small and directions coherent.
- Let repeated input interrupt or reverse a transition without queued effects or jumps.
- Prefer little or no bounce for functional UI. Physical gestures may justify a spring.

Starting ranges for future tuning, not observed values: press feedback 100–160 ms;
small popovers 125–200 ms; ordinary transitions 150–250 ms. Aim below 300 ms for
routine UI. Longer explanatory sequences require a documented user purpose.
Use a responsive ease-out for entry and a coherent ease-in-out for movement;
record shared easing tokens after a system is selected.

## Choosing the simplest suitable implementation

Preference hierarchy:

**CSS / browser-native transition → Transitions.dev pattern → Web Animations /
framework motion where appropriate → GSAP → Three.js / WebGL**.

Transitions.dev sits in this hierarchy as a reference/pattern step, not an engine
more complex than CSS. Use its principle with the simplest suitable technology;
there is no requirement to install a package, agent or skill from the site, reach
an external motion score, or pass through all tiers. This hierarchy guides cost
and purpose, not creative direction.

| Tool | Use when | Do not use merely for |
| --- | --- | --- |
| Native HTML / CSS | Simple states, hover/press/focus styling and short transitions | Replacing semantic controls with animation code |
| Transitions.dev reference | A relevant component-state pattern supports the task and can be adapted to 春空 | Importing a visual identity or adding motion everywhere |
| Web Animations API (WAAPI) | Programmatic playback/cancellation is needed beyond simple CSS | Adding an engine for a basic CSS state |
| Motion | An existing compatible app needs interruptible gestures, coordinated presence, or shared-layout transitions that justify a dependency | A fade, simple hover, or animating every component |
| GSAP | A real requirement calls for a complex timeline, precise multi-element choreography, major 春空 sequence or substantial scroll-driven explanation | Menus, button feedback, basic reveals or decorative scroll effects |
| Three.js / WebGL | A justified spatial / 3D experience cannot be adequately expressed with DOM/CSS | Component transitions, map information panels or decorative 3D novelty |

Use the project's existing capabilities first. A reference pattern does not
justify a new dependency; retain existing GSAP choreography where it serves its
purpose. Framework motion remains optional. Before introducing GSAP, record the user purpose, why simpler
tools are insufficient, affected components, bundle cost, cleanup strategy, mobile
fallback, and reduced-motion equivalent. Only then consult the relevant installed
GSAP core, timeline, ScrollTrigger, or framework skill. Do not load plugins by default.
Avoid multiple animation engines controlling the same element/property.

If GSAP is selected in a future implementation, apply the installed `gsap-core`
and `gsap-timeline` guidance: use a scoped timeline with labels and shared defaults
for sequencing instead of chains of arbitrary delays. Use `gsap.matchMedia()`
for responsive and reduced-motion branches, and revert its context on teardown.
Clean up non-GSAP listeners separately. Keep selectors within the owning component.
Do not use a zero-duration spatial timeline as a substitute for a considered static
layout. Consult framework-specific guidance when the stack is known. Libraries'
default durations or recommendations do not override this project's restraint rules.

## Animation constraints

Prefer transform and opacity; verify compositing in a performance trace rather
than assuming a library guarantees it. Specify transitioned properties explicitly;
avoid `transition: all`. Layout-affecting animation requires measured justification.
Do not hide essential or LCP content behind entrance animations or scroll triggers.
Clean up timelines, observers, listeners, timers, and animation frames on teardown.
Pause ongoing work offscreen and in hidden tabs. Follow [PERFORMANCE.md](PERFORMANCE.md).

## Reduced-motion behavior

Honor `prefers-reduced-motion` in both CSS and JavaScript, including preference
changes during a session. Remove parallax, spatial reveals, scrubbed/pinned
sequences, continuous decorative motion, and smooth scrolling. Render the complete
static end state without waiting for a timeline. Preserve every function and piece
of information. An immediate change is preferred; a short opacity transition up
to 150 ms is acceptable when it improves comprehension.

Loading state must remain understandable with a static text/status alternative.
Do not rely on animation-end events for focus management, unlocking controls, or
essential state updates. Test reduced motion before and after component mounting.

## Input and accessibility

Provide native semantics, accessible names, logical tab order, and visible focus.
For modal dialogs, contain focus appropriately, prevent interaction with background
content, and return focus to the invoking control. Keep status announcements
concise. All applicable interactions must work with keyboard and touch, not hover
alone. Gate decorative hover effects to hover-capable fine pointers. Preserve
native scrolling, browser history, selection, and zoom.

## Interactions that should not be added

Do not blindly copy every Transitions.dev recipe, add motion to every component,
or use a transition solely because it looks impressive. GSAP is not currently a
dependency; reintroduce it only under the documented choreography test below.

No scroll hijacking, mandatory animated intros, custom cursor replacements,
unbounded autoplaying decorative loops (finite ambience that stops, as above, is the
documented exception), magnetic controls, indiscriminate parallax,
letter-by-letter essential copy reveals, or routine page-wide stagger effects.
Do not add auto-rotating content, sounds, particles, or 3D backgrounds without a
specific product need. No delayed focus, gesture-only actions, or content that
remains invisible when JavaScript or an animation library fails.

## Verification

Exercise repeated clicks, rapid reversal, keyboard input, touch, escape/cancel,
slow requests, errors, reduced motion, route changes, and component teardown as
applicable. Inspect timing at normal speed and slower playback. Record actual
results and device limitations in the relevant implementation notes. Adding this
workflow resource does not itself constitute new application testing.
