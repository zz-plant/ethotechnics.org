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

const isCurrentLink = (
  href: string,
  currentPath: string,
  matchSection = false,
) => {
  if (isHashLink(href)) return false;

  const normHref = normalizePath(href);
  const normCurrent = normalizePath(currentPath);

  if (normHref === normCurrent) return true;

  if (matchSection && normHref !== "/") {
    return normCurrent.startsWith(`${normHref}/`);
  }

  return false;
};

const getAriaCurrent = (
  href: string,
  currentPath: string,
  currentHash = "",
  matchSection = false,
) => {
  if (isCurrentLink(href, currentPath, false)) return "page";

  if (
    isSameDocumentHashLink(href) &&
    normalizePath(currentPath) === "/" &&
    normalizeHash(href) === normalizeHash(currentHash)
  ) {
    return "location";
  }

  if (matchSection && isCurrentLink(href, currentPath, true)) {
    return "true";
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
