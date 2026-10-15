# Design

## Current visual language · 春空 Spring Sky (adopted 2026-10-16)

**Observed implementation.** The site now follows the second-edition social posts the
user supplied on 2026-10-16 (三則 Instagram 貼文：活動說明會、工人招募、特約商店).
Their visual DNA was extracted, not their pixels: no artwork from the posts is used.
Tokens live only in [`src/styles/tokens.css`](../src/styles/tokens.css); the 3D map
mirrors them as hex in [`src/map/map-data.ts`](../src/map/map-data.ts) because
Three.js cannot parse OKLCH.

| Area | Decision | Source |
| --- | --- | --- |
| Direction | Poster-like spring sky: lavender-blue to blush gradient, soft clouds, watercolour grain; heavy rose display type stacked in 2-3 character lines; grey-violet identity line under each title | `tokens.css`, `base.css` (`.sky`, `.display`, `.byline`) |
| Typography | Display: self-hosted Noto Sans TC Black subset (`--font-display`, weight 900, always roman). Body: system CJK sans (`--font-body`). Latin UI: system sans (`--font-latin`) | `tokens.css`, `scripts/fonts/` |
| Colour | One accent: rose (`--color-rose-strong`). Neutrals tinted plum/violet. Display rose on the lightest sky tone measures about 3.3:1 (large-text AA); ink on sky above 7:1 | `tokens.css` |
| Themes | Light 春空 by default, 夜櫻 night sky under `prefers-color-scheme: dark`; same hierarchy, lifted rose | `tokens.css` |
| Spacing | 4 pt scale `--space-3xs` to `--space-4xl`; fluid `--gutter`; `--content` 72rem; reading `--measure` 34em | `tokens.css` |
| Shape | Rule: interactive controls are full pills, surfaces 28 px, small notices 14 px, announcement tiles square | `tokens.css`, `components.css` |
| Motifs | Hand-built SVG sakura, pine cone, four-point sparkle, loose petal and brand blossom; all `aria-hidden`, coloured by `--motif-*` tokens | `src/components/motifs.tsx` |
| Icons | One family: Phosphor (`@phosphor-icons/react`), re-exported from `src/components/icons.ts` | `icons.ts` |

**Signature components.**

- *Poster page header* (`PageHeader`): stacked display lines, the 國立中央大學 第二屆 松櫻祭
  identity line, one lede paragraph, motifs cropped at the edge.
- *Announcement triptych* (`AnnouncementTriptych`): three square-ish tiles share one
  continuous sky with motifs crossing the seams, the way the official posts read as one
  strip on the social grid. Used on Home and News.
- *Ticket card* (`EventCard`): admission-stub notches and a dashed tear line.

**Layout families per page** (no family repeats on Home): poster hero; triptych grid;
asymmetric glyph pair (松 / 櫻); ledger panel; horizontal scroll-snap event rail; campus
band. Inner pages: alternating name rows and an asymmetric place bento (About), time
thread schedule (Program), 2+1 / 1+2 bento (Events), role trio (Team), card pair plus
definition rows and accordion (Visit).

**Unknowns.** Official logo, final palette approval, photography and illustration
rights remain open. The posts' hand-drawn hands were not reproduced; supply original
artwork if they should appear on the site.

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
