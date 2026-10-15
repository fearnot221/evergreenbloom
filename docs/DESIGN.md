# Design

## Current visual language

**Not observable as of 2026-09-29.** The workspace contains only documentation.
There is no rendered page, stylesheet, asset collection, or component library.
The user confirmed this is a greenfield project. These are future design rules
and templates. No aesthetic, theme, framework, or design system is selected.
See [PRODUCT.md](PRODUCT.md) for the inspection boundary.

| Area | Verified state | Decisions to define and later verify |
| --- | --- | --- |
| Typography | Unknown | Families, sources/licenses, weights, sizes, leading, tracking, language coverage |
| Colors | Unknown | Semantic tokens, actual values, themes, contrast pairs |
| Spacing | Unknown | Existing scale, container gutters, component gaps, section rhythm |
| Layout | Unknown | Containers, columns, breakpoints, reading measures, overflow behavior |
| Components | None present | Ownership, variants, radii, borders, elevation, icons, interaction states |
| Hierarchy | Unknown | Page titles, content priorities, primary and secondary actions |
| Assets | None present | Logos, photographs, illustrations, font files, rights and purpose |

For extracted values, cite the defining file and selector/token. Separate intended
system rules from isolated implementation accidents. A screenshot alone does not
verify font identity, CSS values, responsive behavior, or animation.

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

Before the first authorized visual implementation, record:

- Product/audience rationale and a one-sentence design direction.
- Reference material and which principles apply to this product.
- Typography roles and selected font sources.
- Semantic color pairs, spacing scale, containers, and breakpoint rationale.
- Component shapes, border/elevation rules, and icon conventions.
- Content hierarchy and relevant component state coverage.
- Alternatives considered, accessibility checks, and performance implications.

Values remain unselected until the product brief supports them. After implementation,
add source paths to the token and component definitions. Do not create token files,
mockups, or a framework as part of this documentation baseline.

## Validation and maintenance

Inspect affected pages at 320, 375, 414, 768, 1280, and 1920 CSS pixels, with
intermediate widths where layout changes. Check long content, keyboard focus,
zoom, supported themes, and real mobile behavior when available. Record checks
actually performed. After an authorized design change, update only affected
system rules and cite the implementation; never turn an accidental value into a
permanent design requirement.
