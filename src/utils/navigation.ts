const normalizePath = (path: string) => {
  const [clean] = path.split("#");
  if (!clean) return "/";

  const trimmed =
    clean.endsWith("/") && clean !== "/" ? clean.slice(0, -1) : clean;

  return trimmed || "/";
};

const isCurrentLink = (href: string, currentPath: string) =>
  normalizePath(href) === normalizePath(currentPath);

const toViewTransitionName = (href: string, scope: "desktop" | "mobile") => {
  const normalized = normalizePath(href);
  const slug = normalized
    .replace(/^\/|\/$/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");

  return `nav-link-${scope}-${slug || "home"}`;
};

export { isCurrentLink, normalizePath, toViewTransitionName };
