# Visual textures

- `BaseLayout` registers SVG filters `paper-grain` (paper noise) and `ink-hatch` (halftone-style grain) inside a hidden `<svg>` so any page can reference them.
- The body background uses `--grain-texture` from `global.css` to add grain without a runtime filter;
  reuse the same variable on large surfaces instead of `filter: url('#paper-grain')` to avoid extra
  paint work on scroll.
- Use `filter: url('#ink-hatch')` on decorative strokes (for example, hero beams or gridlines) instead
  of glows. Pair it with muted ink colors and verify focus outlines still meet contrast on the light
  palette.
