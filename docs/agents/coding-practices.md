# Coding practices

Keep code readable, tested, and consistent with project conventions.

## General principles

- Keep functions and files short and focused; remove dead or duplicate code.
- Maintain consistent naming and formatting; prefer standard tools over custom helpers.
- Add or update tests/checks when behavior changes; document how to run them if non-obvious.

## TypeScript conventions

- Enable strict mode; avoid `any` types—use `unknown` with type guards when types are uncertain.
- Prefer explicit return types for exported functions to catch signature drift.
- Use Zod or similar for runtime validation of external data (API responses, JSON files).
- Co-locate types with their usage; export shared types from dedicated `types.ts` files.

## Astro component patterns

- Keep components single-responsibility: one layout, one data source, one concern.
- Prefer server-first rendering; only add `client:*` hydration when interaction is required.
- Use TypeScript interfaces for props; document optional props with JSDoc comments.
- Extract repeated markup into shared components under `src/components/`.

## Testing expectations

- **Unit tests** (`bun test`): cover utility functions, data transformations, and validators.
- **Component tests**: use the Astro container API for rendering; keep tests focused on output.
- **E2E tests** (`bun run test:e2e`): cover critical user flows and accessibility checks.
- When adding new features, add tests before marking work complete.
- Run `bun run check` before committing for code or mixed changes.
