export type RouteType =
  | "homepage"
  | "glossary-index"
  | "glossary-term"
  | "standards"
  | "utility"
  | "article";

export type StructuredDataMode =
  | "auto"
  | "collection"
  | "webpage"
  | "defined-term"
  | "tech-article";

const UTILITY_ROUTES = new Set([
  "/",
  "/api",
  "/robots.txt",
  "/search",
  "/sitemap.xml",
]);

const normalizePath = (path: string): string => {
  if (!path) return "/";
  return path.startsWith("/") ? path : `/${path}`;
};

const classifyRouteType = (path: string): RouteType => {
  const normalizedPath = normalizePath(path);
  const pathSegments = normalizedPath.split("/").filter(Boolean);

  if (normalizedPath === "/") return "homepage";
  if (normalizedPath === "/glossary") return "glossary-index";
  if (normalizedPath.startsWith("/glossary/") && pathSegments.length === 2) {
    return "glossary-term";
  }
  if (normalizedPath.startsWith("/standards")) return "standards";
  if (UTILITY_ROUTES.has(normalizedPath)) return "utility";
  return "article";
};

const resolveOpenGraphType = (
  path: string,
  explicitOpenGraphType?: string,
): "article" | "website" => {
  if (
    explicitOpenGraphType === "article" ||
    explicitOpenGraphType === "website"
  ) {
    return explicitOpenGraphType;
  }

  const routeType = classifyRouteType(path);
  return routeType === "homepage" ||
    routeType === "glossary-index" ||
    routeType === "glossary-term" ||
    routeType === "utility"
    ? "website"
    : "article";
};

const resolveStructuredDataType = (
  path: string,
  structuredDataType: StructuredDataMode,
): Exclude<StructuredDataMode, "auto"> => {
  if (structuredDataType !== "auto") {
    return structuredDataType;
  }

  const routeType = classifyRouteType(path);
  if (routeType === "homepage") return "collection";
  if (routeType === "glossary-term") return "defined-term";
  return "webpage";
};

export {
  classifyRouteType,
  normalizePath,
  resolveOpenGraphType,
  resolveStructuredDataType,
};
