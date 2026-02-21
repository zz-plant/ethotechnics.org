const normalizePath = (path: string) => {
  const [clean] = path.split(/[?#]/, 1);
  if (!clean) return "/";

  const trimmed =
    clean.endsWith("/") && clean !== "/" ? clean.slice(0, -1) : clean;

  return trimmed || "/";
};

const normalizeHash = (value?: string) => {
  if (!value) return "";
  const [, hash = ""] = value.split("#", 2);
  return hash ? `#${hash}` : "";
};

const isHashLink = (href: string) => href.includes("#");

const isSameDocumentHashLink = (href: string) => {
  if (!isHashLink(href)) return false;
  return normalizePath(href) === "/";
};

const isCurrentLink = (href: string, currentPath: string) => {
  if (isHashLink(href)) return false;

  return normalizePath(href) === normalizePath(currentPath);
};

const getAriaCurrent = (href: string, currentPath: string, currentHash = "") => {
  if (isCurrentLink(href, currentPath)) return "page";

  if (
    isSameDocumentHashLink(href) &&
    normalizePath(currentPath) === "/" &&
    normalizeHash(href) === normalizeHash(currentHash)
  ) {
    return "location";
  }

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

export {
  getAriaCurrent,
  isCurrentLink,
  isHashLink,
  isSameDocumentHashLink,
  normalizePath,
  toViewTransitionName,
};
