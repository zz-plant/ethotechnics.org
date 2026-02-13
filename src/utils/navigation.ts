const normalizePath = (path: string) => {
  const [clean] = path.split(/[?#]/, 1);
  if (!clean) return "/";

  const trimmed =
    clean.endsWith("/") && clean !== "/" ? clean.slice(0, -1) : clean;

  return trimmed || "/";
};

const isHashLink = (href: string) => href.includes("#");

const isCurrentLink = (href: string, currentPath: string) => {
  if (isHashLink(href)) return false;

  return normalizePath(href) === normalizePath(currentPath);
};

const getAriaCurrent = (href: string, currentPath: string) => {
  if (isCurrentLink(href, currentPath)) return "page";

  if (isHashLink(href) && normalizePath(currentPath) === "/") return "location";

  return undefined;
};

const toViewTransitionName = (href: string, scope: "desktop" | "mobile") => {
  const normalized = normalizePath(href);
  const slug = normalized
    .replace(/^\/|\/$/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .toLowerCase()
    .replace(/^-+|-+$/g, "");

  return `nav-link-${scope}-${slug || "home"}`;
};

export { getAriaCurrent, isCurrentLink, isHashLink, normalizePath, toViewTransitionName };
