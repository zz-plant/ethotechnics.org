# AGENTS — src/pages/

Scope: Astro route files in `src/pages/` (including nested folders).

## Layout and metadata
- Prefer shared shells such as `BaseLayout` and reuse page sections instead of duplicating markup.
- Keep frontmatter minimal: set `title`/`description` for SEO and pass page-specific data as props.
- Update navigation or breadcrumbs through shared components rather than hard-coding links per page.

## Styling and content structure
- Favor semantic HTML and existing utility classes from `src/styles/global.css`; avoid inline styles.
- Keep content blocks small and readable; extract repeated sections into components under `src/components/`.
- Maintain consistent heading hierarchy and link patterns to match the site’s information architecture.
