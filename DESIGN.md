---
name: Ethotechnics
description: An editorial reading system for research, draft requirements, and checks for decision records.
colors:
  paper: "#f5f3ee"
  sheet: "#ffffff"
  panel: "#ece8df"
  ink: "#1c1917"
  muted: "#5b554f"
  rule: "#dcd6cb"
  sapphire: "#1e3a5f"
  sapphire-strong: "#142842"
  link: "#2a5089"
  rust: "#b5481f"
  proof-bg: "#163e35"
  proof-text: "#f5f1e7"
  proof-muted: "#d0dcd4"
  dark-bg: "#171412"
  dark-sheet: "#1f1b18"
  dark-panel: "#282320"
  dark-ink: "#f1ece3"
  dark-muted: "#a69f95"
  dark-rule: "#3a332d"
  dark-sapphire: "#93b8dc"
  dark-sapphire-strong: "#bfd6ee"
  dark-rust: "#e6996e"
  dark-button: "#2e6093"
  dark-button-hover: "#3d72a7"
typography:
  display:
    fontFamily: 'Instrument Serif, "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Charter, Georgia, "Times New Roman", serif'
    fontSize: "clamp(3.25rem, 1.3rem + 6vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.99
    letterSpacing: "-0.025em"
  headline:
    fontFamily: 'Instrument Serif, "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Charter, Georgia, "Times New Roman", serif'
    fontSize: "clamp(2.2rem, 1.35rem + 2.5vw, 3.65rem)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  reading-title:
    fontFamily: 'Instrument Serif, "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Charter, Georgia, "Times New Roman", serif'
    fontSize: "clamp(1.85rem, 1.35rem + 1.4vw, 2.65rem)"
    fontWeight: 400
    lineHeight: 1.1
  body:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Charter, Georgia, "Times New Roman", serif'
    fontSize: "clamp(1rem, 0.3vw + 0.95rem, 1.1rem)"
    fontWeight: 400
    lineHeight: 1.65
  title:
    fontFamily: '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Charter, Georgia, "Times New Roman", serif'
    fontSize: "clamp(1.25rem, 1.1rem + 0.5vw, 1.5rem)"
    fontWeight: 500
    lineHeight: 1.3
  control:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 600
  label:
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 600
rounded:
  sharp: "0"
  xs: "3px"
  md: "8px"
  pill: "999px"
spacing:
  hair: "0.125rem"
  1: "0.25rem"
  2: "0.5rem"
  3: "0.75rem"
  4: "1rem"
  5: "1.5rem"
  6: "clamp(1.5rem, 1.1667rem + 1.1111vw, 2rem)"
  7: "clamp(2rem, 1.3333rem + 2.2222vw, 3rem)"
  8: "clamp(3rem, 2.3333rem + 2.2222vw, 4rem)"
  9: "clamp(4rem, 2.6667rem + 4.4444vw, 6rem)"
components:
  button-primary:
    backgroundColor: "{colors.sapphire}"
    textColor: "{colors.sheet}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  button-primary-hover:
    backgroundColor: "{colors.sapphire-strong}"
    textColor: "{colors.sheet}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.5rem"
  newsletter-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1rem"
  pill:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "0.5rem 1rem"
  home-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    padding: "0.75rem 0"
  home-concern:
    textColor: "{colors.ink}"
    padding: "{spacing.6} 0"
  home-reading:
    textColor: "{colors.ink}"
    padding: "{spacing.6} 0"
  home-evidence:
    backgroundColor: "{colors.proof-bg}"
    textColor: "{colors.proof-text}"
    rounded: "{rounded.sharp}"
    padding: "{spacing.8}"
  self-test-choice:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xs}"
    padding: "0.5rem 0.75rem"
---

# Design System: Ethotechnics

## Overview

**Creative North Star: "The Editorial Research Front Page."** Warm paper, readable serif text,
quiet sans controls, and ruled lists carry the shared system. The homepage adds a large Instrument
Serif thesis, a rust italic continuation, and a forest green evidence section. Its hierarchy comes
from type, asymmetric columns, and changes in material.

Shared tokens live in `src/styles/theme.css`; base reading styles live in `src/styles/base.css`.
The homepage's display font and evidence colors are scoped to `src/styles/components/home-revamp.css`
and its `home-revamp` main element. Other pages retain the incumbent editorial styles. The former
transit homepage is superseded; its Public Sans signs, station colors, and rail are not the current
homepage system. Existing shared navigation and project branding remain authoritative.
The route stylesheet intentionally stays unlayered so its local self-test rules outrank legacy
unlayered homepage CSS; moving it into a cascade layer would hide selected-choice styling.

**Key Characteristics:**

- Sentence-case serif headings and a distinct, lighter display face on the homepage.
- Warm paper and rust marks, with sapphire links and shared controls.
- Flat sections, fine rules, and reading rows rather than repeated boxed panels.
- Clear hierarchy between argument, evidence, source links, and limits.
- A code-led reading surface with no approved image composition or new raster artwork.

## Colors

Warm neutrals carry reading; sapphire identifies shared actions; rust adds a short editorial mark.
The frontmatter records light-theme values and their observed dark counterparts.

### Primary

- **Sapphire / Strong Sapphire / Link:** Shared action grounds, hover treatment, and inline links.
- **Rust:** The homepage's italic thesis continuation and action hover; shared navigation's active
  rule uses the same mark token.

### Secondary

- **Forest Proof / Proof Text / Proof Muted:** The homepage's evidence section, its main text, and
  secondary account. These local colors remain the same in light and dark themes.

### Neutral

- **Paper / Sheet / Panel:** Page ground, shared fields and sheets, and quiet tonal layers.
- **Ink / Muted / Rule:** Reading text, supporting text, and fine dividers.
- **Dark counterparts:** Shared dark mode uses warm obsidian, cream ink, blue sapphire, and pale rust.
  The system preference and stored-choice blocks in the theme stylesheet must stay equivalent.

**The Scoped Evidence Rule.** Forest green identifies the homepage's sustained evidence passage;
keep it local instead of replacing the shared page or navigation palette.

## Typography

**Display Font:** Instrument Serif, self-hosted regular and italic TTFs with `font-display: swap`.
**Body Font:** The shared platform serif stack, beginning with Iowan Old Style.
**Control Font:** The shared platform sans stack; no new sans webfont is required by this homepage.
**Data Font:** The platform mono stack remains available for identifiers and code elsewhere.

Instrument Serif is expressive and light at display sizes. The platform serif carries prose and
smaller argument headings; sans distinguishes controls and metadata.

### Hierarchy

- **Display:** The homepage h1 uses the frontmatter display role, with its second block in rust italic.
  Its measure is 15ch on desktop and 18ch at the stacked breakpoint.
- **Headline:** Homepage section h2 headings use the headline role and balanced wrapping.
- **Reading title:** The linked reading rows use this role; the closing heading reuses its size.
- **Title:** Argument headings and the self-test heading use the platform serif title role. The
  evidence mechanism heading uses the same size at weight 400 and line-height 1.4.
- **Body:** Shared reading uses the body role. The homepage lead uses the shared xl size at 1.55,
  falling to lg on narrow phones. Supporting prose is generally limited to 55–65ch.
- **Control / Label:** Actions and controls use the control role; small metadata and self-test
  variable names use the label role. Homepage labels remain sentence case.

**The Display Boundary Rule.** Use the homepage's three display sizes through the existing theme
variables; retain platform serif prose and the shared sans controls.

## Layout

The homepage uses the shared 1180px content container and fluid side gutter
(`clamp(1rem, 5vw, 4rem)`). The global 1420px wide-container token remains available to other surfaces.
Small spacing steps are fixed on a 4px grid; large steps remain fluid as recorded in the frontmatter.
Do not flatten them to their desktop endpoints.

The opening pairs a wide thesis with a narrow marginal comparison; its lower band pairs a lead with
a ruled action. Sections use asymmetric two-column introductions, full-width reading rows, and
horizontal divisions. Most major homepage sections use spacing step 8 for vertical padding. The
self-test invitation is sticky at 6rem on desktop; in-page destinations have a 6rem scroll margin.

At 900px and below, the major columns stack, the marginal comparison hides, and the self-test
invitation becomes static. Each concern row pairs heading/prose with a link in two columns until
540px, then stacks; it has no separate subject label. At 540px,
reading descriptions move below their titles with the SVG arrow beside the title; the evidence
section uses step 5 padding and an 8px outward margin. Shared navigation has its own 1024px desktop
breakpoint; do not substitute the homepage breakpoints for chrome behavior.

## Elevation & Depth

Homepage content is flat: rules, spacing, and the forest evidence ground provide structure without
content shadows. Shared floating chrome uses `shadow-float`; ordinary card and panel shadow aliases
resolve to none. The shared sticky header's translucent background and blur are functional chrome.
Focus rings are interaction feedback, not a content-elevation layer.

**The Flat Content Rule.** Preserve flat reading surfaces; reserve the float shadow for menus,
popovers, dialogs, and other floating chrome.

The opening title has one 650ms arrival using the shared editorial easing, translating 12px and
removing 2px blur. It runs only at widths of at least 1000px with no reduced-motion preference. It
never gates reading. Reading-link color changes use the shared 150ms duration.

## Shapes

Homepage passages and reading rows have square edges and fine rules; major divisions use ink while
internal divisions use the border token. The evidence section is a square rectangular field.
Self-test choices use the small radius. Shared buttons and fields use the medium radius; navigation
Start, menu/search controls, and pills keep their established pill geometry. Square homepage content
does not impose square corners on shared chrome.

## Components

### Buttons and actions

Shared primary buttons use sapphire, sheet text, medium corners, and 12px by 24px padding. Ghost
buttons are transparent, with an understated border; hover adds a panel tint. Shared buttons have a
44px minimum target, increased for coarse pointers. The navigation Start action retains its pill
shape and its own compact desktop sizing.

The homepage's primary reading action is a text row with a current-color bottom rule and a trailing
inline SVG arrow. It is at least 3rem high, uses the sans control role, and turns rust on hover.
Homepage links receive a visible current-color outline with a 5px offset on keyboard focus.

### Fields and pills

The shared newsletter field uses sheet ground, ink text, a fine interactive border, medium corners,
and 12px by 16px padding. Its focus treatment uses the shared outline and ring. Shared pills remain
label-width, rounded controls or tags; their presence does not change the homepage's ruled lists.

### Navigation

Preserve the shared masthead, current branding assets, search, Start action, and menu drawer.
At desktop widths the section triggers are quiet sans labels with a rust active underline; popover
surfaces use medium corners, a fine border, and the float shadow. The mobile shell keeps the shared
menu behavior. Homepage styles do not reskin the header or footer.

### Concern rows

A platform-serif heading and muted explanation share a ruled row with a research link. The two
columns become one at the phone breakpoint. A trailing Lucide SVG supplies the link arrow; no
redundant subject label precedes the heading. Homepage arrows use SVG icons rather than text glyphs.

### Reading rows

A whole-row anchor pairs a display-serif title and small type label with a muted description and
inline SVG arrow. A hairline separates rows. Hover shifts the link to sapphire and underlines the
title; keyboard focus outlines the row. It becomes title/arrow followed by description on phones.

### Evidence passage

A forest section contains cream headings and account, muted supporting text, and source links.
Internal rules mix the proof text at 35% with transparency. Links inherit the section's light color,
thicken their underline on hover, and retain the homepage focus outline.

### Self-test

Six semantic fieldsets form a ruled list. Route-local rules define the fieldsets, cleared legends,
wrapping flex choices, hidden native radios, and label focus. Choices use small rounded rectangles
with a minimum 44px height; checked choices take the shared primary button colors. A yes answer changes the
question's top rule to the accent; no and not-sure use the warning status color. A visible outline
tracks keyboard focus on the associated label. The result begins beneath a stronger ink rule.

## Do's and Don'ts

### Do:

- **Do** retain warm paper, serif reading, shared sans controls, and the existing navigation.
- **Do** use the shared fluid spacing and type tokens rather than raw one-off sizes.
- **Do** keep the homepage's forest palette and display face scoped to its reading surface.
- **Do** preserve visible keyboard focus, semantic headings, reduced-motion behavior, and source links.
- **Do** distinguish evidence, interpretation, draft requirements, and self-reported results.

### Don't:

- **Don't** carry the superseded transit colors, station signs, rail, or halt clock into this homepage.
- **Don't** add decorative kickers or eyebrows above homepage headings.
- **Don't** replace ruled reading sequences with nested cards or a repeated tile grid.
- **Don't** set prose in mono, add gradient text, or introduce hard offset shadows.
- **Don't** turn the homepage's square sections into a ban on shared rounded controls or chrome.

Not canonized: stale transit CSS and comments about an unhosted font system remain in the source;
they are outside this documentation refresh and do not define the active homepage.
