---
name: Ethotechnics
description: Draft standards, record formats, and test instruments for answerable automated decisions.
colors:
  line-ground: "#f7f7f4"
  line-surface: "#ffffff"
  line-ink: "#111318"
  line-muted: "#555b66"
  line-rule: "#d5d8de"
  line-teal: "#0b6f63"
  line-cobalt: "#1f4fd8"
  line-violet: "#5b3fd0"
  line-vermilion: "#c9341b"
  line-amber: "#8a5a00"
  line-magenta: "#a32662"
  site-paper: "#f5f3ee"
  site-sapphire: "#1e3a5f"
  site-rust: "#b5481f"
typography:
  display:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "clamp(3rem, 7vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  heading:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4.4vw, 4.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "clamp(1rem, 0.3vw + 0.95rem, 1.1rem)"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Public Sans, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 800
    letterSpacing: "0.08em"
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, monospace"
    fontSize: "0.6875rem"
    fontWeight: 700
rounded:
  sharp: "0"
  md: "8px"
  full: "50%"
spacing:
  hair: "2px"
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "24px"
  6: "32px"
  7: "48px"
  8: "64px"
  9: "96px"
components:
  button-primary:
    backgroundColor: "{colors.line-ink}"
    textColor: "{colors.line-ground}"
    rounded: "{rounded.sharp}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.line-vermilion}"
    textColor: "{colors.line-ground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.line-ink}"
    rounded: "{rounded.sharp}"
    padding: "16px 24px"
  station-dot:
    backgroundColor: "{colors.line-ground}"
    textColor: "{colors.line-ink}"
    size: "14px"
  notice:
    backgroundColor: "{colors.line-surface}"
    textColor: "{colors.line-ink}"
    rounded: "{rounded.sharp}"
    padding: "16px"
---

# Design System: Ethotechnics

## Overview

**Creative North Star: "The Line."** The home page draws the seven-stage decision chain as a
metropolitan transit diagram: Evidence, Authority, Decision, Consequence, Challenge,
Reconsideration, Correction. Robodebt is a service disruption that stops at Consequence; the halt
clock reads three years and four months. The visitor marks their own system on the line.

The Line is a surface world, scoped to `.home-line` on the home page. The rest of the site keeps the
incumbent paper / sapphire / serif editorial system, whose tokens live in `src/styles/theme.css`. A
future page adopts the Line only by applying `.home-line` and the tokens in
`src/styles/components/home.css`; it does not inherit them by accident.

**Key Characteristics:**

- The chain is the page. The first viewport is the line, not a header over a row of cards.
- Colour is data. Each stage owns a route colour; colour never decorates a card or a heading.
- Flat and rule-bound. Hairlines, station dots, interchange rings, and one halt clock do the work.
- Citable codes. EVD, AUT, DEC, CON, CHA, REC, COR are stable labels, not ornament.
- One authored moment: the self-test lights each station as the reader answers, and the signal stops
  at the first gap.

## Colors

The Line palette is a bright transit ground with near-black structure and seven route colours. The
route colours encode stages, in order: teal (Evidence), cobalt (Authority), violet (Decision),
vermilion (Consequence), amber (Challenge), magenta (Reconsideration), ink (Correction). Amber is
darkened to `#8a5a00` so the 11px CHA code clears 4.5:1 on the ground.

The incumbent site palette — paper `#f5f3ee`, sapphire `#1e3a5f`, rust `#b5481f` — stays outside
`.home-line`. The home page's header and footer adopt the Line through the body class, not by
changing the shared tokens.

**The Route Colour Rule.** On the Line, a saturated colour belongs to a stage or a status, never to a
container. A card with a coloured border is not this world.

## Typography

Public Sans is self-hosted from `/fonts` (OFL) in 400, 600, 700, and 800. The home page uses it as
signage: heavy, tight, and uppercase for station names; sentence case for the headline and body.

Display runs at `clamp(3rem, 7vw, 6rem)`, weight 800, line-height 0.9, tracking -0.04em. Headings run
at `clamp(2.25rem, 4.4vw, 4.25rem)`, weight 800, line-height 0.98, tracking -0.035em. Body is
`clamp(1rem, 0.3vw + 0.95rem, 1.1rem)` at 1.6. Labels are 0.75rem, 800, 0.08em, uppercase. Station
codes and the halt clock use the platform mono with tabular figures because they are data.

The site's serif is not used inside `.home-line`.

## Layout

The hero is a seven-column line across the content width; the first viewport carries the headline,
the Robodebt notice, the primary action, all seven stations, and the legend. Sections are full-width
bands separated by a hairline, with a maximum inner width of 1420px.

At 1100px the self-test board and the mechanism grid stack. At 820px the line becomes a vertical
rail: station rows stack, the dots sit on the rail, and the branch and terminus stay at the foot. The
casebook is a three-column row (name, six stops, halt time); below 820px it becomes a name and halt
row with the stops on their own line. The network is a 2×2 board that becomes one column.

## Elevation & Depth

Flat. Depth is carried by hairline rules, tonal fills, and the rail itself. The only float shadow in
the system is the site chrome's (menus, popovers); the home page adds none. The sticky header's blur
is functional chrome, not decoration.

## Shapes

Sharp corners on buttons, notices, fields, and plates (`border-radius: 0`). Station dots are 50%
circles with a 3px stage-colour border; interchange rings add a 2px outer circle. The suspended
branch uses the 8px radius at its bottom corners. No pills on the home page.

## Components

- **Primary button.** Ink ground, ground text, square corners, `16px 24px` padding; hover and focus
  turn vermilion. Applies to the hero CTA, the self-test result, and the footer Subscribe.
- **Ghost button.** Transparent ground, ink border and text, square; hover inverts to ink.
- **Station dot.** 14px, 3px stage-colour border, ground fill. Failed stations fill; drifted
  stations tint; suspended stations dash. The Consequence halt carries a 2.8s pulse ring.
- **Notice.** White surface, 2px ink border, square, 16px padding. Used for the Robodebt service
  notice and the self-test result.
- **Field.** White surface, 1px ink border, square, Public Sans. The footer newsletter field matches
  the Subscribe button.
- **Casebook row.** Name and learning outcome, six stops on a hairline, halt time in mono. The
  column heads are CAP, AUT, EVD, DEP, STA, COR.
- **Self-test.** Six stops on a 6px ink rail; each node is its stage colour. A held answer fills the
  node, a "no" or "not sure" floods it vermilion.
- **Network.** Four line-coloured bars (cobalt, vermilion, teal, violet) over a 2×2 board of links.

## Do's and Don'ts

**Do**

- Keep the chain as the page's spine and the first viewport as its thesis.
- Use colour to encode a stage or a status, and keep the station codes citable.
- Keep the halt clock, the Robodebt stop at Consequence, and the legend.
- Keep the self-test on the line; the signal stops at the first gap.
- Keep the mobile rail vertical with the dots on it.

**Don't**

- Don't add a kicker or eyebrow above a heading.
- Don't use same-size card grids, nested cards, or a hero-metric template.
- Don't use a coloured side stripe on a card or callout.
- Don't set prose in mono; mono is for codes, figures, and measurements.
- Don't use gradient text, glass decoration, or hard offset shadows.
- Don't let the route colours become decoration, and don't apply the Line tokens outside
  `.home-line`.
