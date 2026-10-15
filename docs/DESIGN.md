# Design

## Current visual language · v3 「松窗見春」 (adopted 2026-10-16)

**Why v3.** The user judged both the original Bloom version and the first 春空 redesign
short of an Awwwards-level result and asked for a new, fully re-composed version. v3
keeps the second-edition identity (sky, sakura, pine, the posts' lettering) but stages
it as an editorial, typographic experience instead of a pastel template.

**Concept.** 松 is the pine-ink frame (endurance, night); 櫻 is the spring sky you look
through to. The home page opens on pine ink with 松櫻祭 cut out of it; a living WebGL
sky with falling petals shows through the letters, and scrolling zooms through them
into spring. Solid chapters then slide over that sky.

| Area | Decision | Source |
| --- | --- | --- |
| Colour | Two fixed poles (`--pine-ink`, sky `--sky-*`) plus scheme roles (`--bg`, `--fg`, `--line`, `--accent`). One accent: rose. Night (夜櫻) inverts paper to ink | `src/styles/tokens.css` |
| Type | Editorial serif (Noto Serif TC Black subset, `--font-serif`) for titles and statements, set vertically (`writing-mode: vertical-rl`) where it carries meaning; poster sans (Noto Sans TC Black subset, `--font-poster`) only for the wordmark and official-post lettering; system body and Latin | `tokens.css`, `base.css`, `src/data/display-copy.ts`, `src/data/poster-copy.ts` |
| Shape | Panels and posters are sharp; buttons and chips are full pills; hairlines separate rows | `base.css`, `components.css` |
| Motion | Scroll-driven CSS (window zoom, glyph drift, scroll unroll, ticket pan, campus line draw), button fill wipe, underline growth, menu circle reveal, view transitions; all off for reduced motion | `home.css`, `components.css`, `shell.css`, `transitions.css` |
| WebGL | One fragment shader: gradient sky, fbm clouds, three petal layers; half resolution, paused off-screen, still frame for reduced motion, CSS gradient fallback | `src/components/SkyCanvas.tsx`, `sky-shader.ts` |
| Icons | Phosphor only | `src/components/icons.ts` |

**Home chapters** (each a different layout family): pine window (masked wordmark) ·
vertical statement on open sky · 松 / 櫻 split panels · three hanging scrolls (掛軸)
that unroll · 貳 filled with sky beside the edition ledger · horizontally panned
ticket strip · campus line sketch drawn from OpenStreetMap · pine-ink footer with a
full-width wordmark.

**Inner pages.** A vertical serif title spine (sticky, like a book spine) beside the
content on wide screens; horizontal on phones. Editorial rows with hairlines, tickets
for events, posters for official news. Dynamic titles (events, announcements) use the
body face so the serif subset stays small.

**Fonts.** `npm run fonts -- <NotoSerifTC-Black.ttf> <NotoSansTC-Black.ttf>` rebuilds
both subsets from the copy modules; a test fails when copy introduces a missing
character. Measured: serif 68.8 KiB, poster 10.6 KiB.

**Unknowns.** Official logo, palette approval, photography and illustration rights.
The hands from the posts are still not reproduced.

## Design direction

Establish direction from the product's users, tasks, content, and existing brand.
Until those are known, preserve options; do not select an aesthetic on the basis
of a skill's default theme, font, stack, or numerical taste settings.

Use the installed `design-taste-frontend` (Taste) principles for hierarchy,
typography, spacing, and coherent composition. Use Hallmark as a contextual
anti-pattern review, not a mandate to rotate themes or rebuild the site. Existing
product identity takes precedence over stylistic novelty.

## Typography principles

- Define semantic roles for page title, section heading, body, label, and supporting text.
- Prefer a small, coherent family and weight set; a single family is valid when it fits.
- Size headings to actual content and viewport width. Verify long titles and descenders.
- Use comfortable body leading and reading measures; 45–75 characters is a starting
  range for Latin prose, not a rule for every language or dense data interface.
- Preserve readability at 200% zoom and text enlargement. Avoid tiny muted labels.
- Choose fonts for brand fit, language coverage, readability, licensing, and load cost.
  Do not replace an established font just because a skill discourages its popularity.

## Color principles

Use semantic roles for background, surface, text, secondary text, border, accent,
focus, and status. Pair foreground and background tokens explicitly. Maintain a
coherent neutral palette and restrained emphasis; status colors may have distinct
semantic roles. Do not convey meaning with color alone. Target text contrast of
4.5:1 for normal text and 3:1 for large text; check controls and focus indicators
against adjacent surfaces. Verify every supported theme independently.

## Spacing and layout principles

Extract an existing spacing scale before adding values. If none exists, establish
one small named scale from content needs, documenting its purpose rather than
scattering arbitrary numbers. Use consistent alignment and proximity to show
relationships. Whitespace should clarify grouping rather than fill a template.

Let content determine layout and breakpoints. Use constrained reading widths,
fluid gutters, and explicit alignment. Preserve logical DOM order when composing
grids. Avoid forced viewport-height heroes, clipped text, and overflow hidden
merely to conceal layout defects. Long words, localization, and narrow viewports
must not break navigation or actions.

## Component language and visual hierarchy

Reuse existing component ownership and variants once known. Document tokens for
shape, borders, elevation, density, and icon treatment; avoid mixed visual systems.
Cards should group a meaningful object or action, not wrap every paragraph.

Make the primary task apparent without competing buttons, oversized decorative
labels, or multiple accents. Differentiate primary, secondary, and supporting
content through scale, weight, placement, and spacing. Design relevant hover,
focus, active, disabled, loading, error, empty, and success states together.

## Patterns to avoid

- Automatic hero → three feature cards → testimonial → CTA structure regardless of content.
- Unjustified gradient meshes, glowing accents, glass panels, pills, and bento grids.
- Generic claims, fabricated metrics, stock testimonials, fake customers, or fake UI chrome.
- Excessive eyebrow labels, decorative section numbers, or typography chosen for novelty.
- Repeated identical cards and spacing that flatten the content hierarchy.
- Arbitrary font, icon, corner radius, shadow, or accent changes between sections.
- Hidden navigation, low contrast, hover-only information, or motion used as decoration.
- Changing established patterns solely to make a site look less conventional.

These are review prompts, not evidence that any such pattern exists here.
A familiar pattern is acceptable when it serves the product and is executed well.

## Design decision template

The 春空 decision above follows this template. For the next consequential change, record:

- Product/audience rationale and a one-sentence design direction.
- Reference material and which principles apply to this product.
- Typography roles and selected font sources.
- Semantic color pairs, spacing scale, containers, and breakpoint rationale.
- Component shapes, border/elevation rules, and icon conventions.
- Content hierarchy and relevant component state coverage.
- Alternatives considered, accessibility checks, and performance implications.

## Validation and maintenance

Inspect affected pages at 320, 375, 414, 768, 1280, and 1920 CSS pixels, with
intermediate widths where layout changes. Check long content, keyboard focus,
zoom, supported themes, and real mobile behavior when available. Record checks
actually performed. After an authorized design change, update only affected
system rules and cite the implementation; never turn an accidental value into a
permanent design requirement.
