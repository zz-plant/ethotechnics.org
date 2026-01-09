# AGENTS — src/

Scope: Astro pages, layouts, components, and styles.

## Formatting and structure
- Match existing spacing (2-space indent) and rely on Prettier defaults for `.astro`, `.tsx`, and CSS files.
- Keep imports minimal and ordered by module type (packages first, then local files); avoid unused exports.
- Prefer semantic HTML and descriptive prop names; document optional props with TypeScript types.

## Tooling and checks
- Limit hydration (`client:*`) to components that need it; keep the default zero-JS behavior elsewhere.
- Extend shared styles in `src/styles/global.css` instead of inline styles when possible.
- Run `bun run typecheck` and `bun run astro:check` for any code or layout changes; run `bun run check` for broader changes.

## Review checklist
- Accessibility: verify focus order, aria labels, and color contrast align with existing patterns.
- Performance: avoid unnecessary client bundles or heavy dependencies; keep islands small.
- Consistency: reuse existing components and utility classes before adding new ones, and remove dead code.
