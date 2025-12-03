# Lumen Astro starter

A contemporary Astro 5 scaffold with an island-based navigation bar, flexible marketing sections, and modern styling. Use it as a starting point for product or content-driven sites that value performance and clarity.

## Getting started
1. Install dependencies: `npm install`
2. Run the dev server: `npm run dev`
3. Ship production assets: `npm run build` (optionally preview with `npm run preview`).

## MDX + TypeScript
- MDX is enabled via `@astrojs/mdx`; add new content pages by dropping `.mdx` files in `src/pages` with the shared `BaseLayout`.
- Share typed components between markdown and islands—see `src/components/ResourceList.tsx` used by `src/pages/mdx.mdx`.

## Tech stack
- [Astro 5](https://astro.build) with strict TypeScript defaults
- React island for the navigation, hydrated on load
- Modern, responsive styling with a focus on accessibility and contrast
