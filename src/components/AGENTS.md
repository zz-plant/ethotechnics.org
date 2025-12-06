# AGENTS — src/components/

Scope: shared UI components and interactive islands under `src/components/`.

## Structure and navigation
- Keep components focused: one responsibility with clear props; export reusable variants over page-specific logic.
- Route updates and navigation links should flow through shared primitives (e.g., `Navigation.astro`) to keep menus consistent.
- Prefer server-first rendering; only opt into `client:*` hydration when interaction is required.

## Styling and accessibility
- Reuse tokens and patterns from `src/styles/global.css`; avoid inline styles and heavyweight dependencies.
- Preserve accessible names, focus order, and ARIA labels established in existing components when adding new UI.
- Keep spacing and typography consistent with surrounding layout sections (e.g., `SectionBlock`, `PageIntro`).
