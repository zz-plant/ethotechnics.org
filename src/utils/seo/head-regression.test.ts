import { describe, expect, it } from "bun:test";

import { resolveOgTemplate } from "./og-template";
import { resolveOpenGraphType } from "./route-type";

const buildOgImageUrl = (
  path: string,
  title: string,
  description: string,
): string => {
  const url = new URL("/api/og.png", "https://ethotechnics.org");
  url.searchParams.set("title", title);
  url.searchParams.set("description", description);
  url.searchParams.set("template", resolveOgTemplate(undefined, path));
  url.searchParams.set("path", path);
  return url.toString();
};

const legacyResolveOpenGraphType = (path: string): "article" | "website" => {
  const nonArticleRoutes = new Set([
    "/",
    "/api",
    "/robots.txt",
    "/search",
    "/sitemap.xml",
  ]);
  if (path.startsWith("/glossary") || nonArticleRoutes.has(path))
    return "website";
  return "article";
};

const legacyResolveTemplate = (
  path: string,
):
  | "default"
  | "home"
  | "standards"
  | "glossary"
  | "taxonomy"
  | "mechanisms"
  | "editorial" => {
  if (path === "/") return "home";
  if (path.startsWith("/standards")) return "standards";
  if (path.startsWith("/glossary")) return "glossary";
  if (
    path.startsWith("/taxonomy") ||
    path.startsWith("/governance") ||
    path.startsWith("/delivery") ||
    path.startsWith("/assurance") ||
    path.startsWith("/experience")
  ) {
    return "taxonomy";
  }
  if (
    path.startsWith("/mechanisms") ||
    path.startsWith("/library") ||
    path.startsWith("/validators")
  ) {
    return "mechanisms";
  }
  if (
    path.startsWith("/research") ||
    path.startsWith("/incidents") ||
    path.startsWith("/field-notes") ||
    path.startsWith("/explainers")
  ) {
    return "editorial";
  }

  return "default";
};

describe("head metadata regression", () => {
  const routes = [
    "/",
    "/research/ai-assurance",
    "/glossary/accountability",
    "/standards/w3c-vc-schemas",
  ];

  it("keeps Open Graph type mapping consistent with legacy behavior", () => {
    for (const route of routes) {
      expect(resolveOpenGraphType(route)).toBe(
        legacyResolveOpenGraphType(route),
      );
    }
  });

  it("keeps OG image template selection consistent with legacy behavior", () => {
    for (const route of routes) {
      expect(resolveOgTemplate(undefined, route)).toBe(
        legacyResolveTemplate(route),
      );
    }
  });

  it("keeps representative OG image head tag values stable", () => {
    for (const route of routes) {
      const imageUrl = buildOgImageUrl(
        route,
        "Route title",
        "Route description",
      );
      const template = new URL(imageUrl).searchParams.get("template");
      expect(template).toBe(legacyResolveTemplate(route));
      expect(new URL(imageUrl).searchParams.get("path")).toBe(route);
    }
  });
});
