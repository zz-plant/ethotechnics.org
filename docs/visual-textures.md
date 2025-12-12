# Visual textures

- `BaseLayout` registers SVG filters `paper-grain` (paper noise) and `ink-hatch` (halftone-style grain) inside a hidden `<svg>` so any page can reference them.
- The body background applies `filter: url('#paper-grain')` in `global.css` via `body::before`; reuse the same filter on other large surfaces with a light opacity and `mix-blend-mode: multiply` to keep the paper feel consistent.
- Use `filter: url('#ink-hatch')` on decorative strokes (for example, hero beams or gridlines) instead of glows. Pair it with muted ink colors and verify focus outlines still meet contrast on the light palette.
