# Adding new pages

Quick steps to add an Astro page without breaking navigation or metadata.

- **Pick the route path:** Create a folder in `src/pages` with `index.astro` inside (e.g.,
  `src/pages/new-page/index.astro`) to keep clean, trailing-slash URLs.
- **Start from `BaseLayout`:** Import `BaseLayout` at the top of the page and pass `title` and
  `description` for SEO and social cards. The layout will set canonical, favicon, and Open Graph
  defaults.
- **Keep copy in `src/content`:** Add a `pageContent` object in a new or existing file under
  `src/content/` (see `src/content/types.ts` for helpers like `PageWithPermalink`). Pull text,
  permalinks, and CTA labels from that object inside the page to keep strings consistent with
  navigation and tests.
- **Compose with shared components:** Use `PageIntro` for the hero, `SectionBlock` for page
  sections, and `CardGrid`/`CardItem` for collections. Import components from `src/components/`
  and reuse the `className` props instead of adding inline styles.
- **Update navigation when needed:** Add the new route to the `navLinks` array in
  `src/components/Navigation.astro` so it appears in the primary menu. Add footer links only if the
  page should be discoverable site-wide.
- **Validate before opening a PR:** Run `bun run check` to cover linting, types, tests, and Astro's
  checker.
