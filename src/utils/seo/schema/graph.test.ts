import { describe, expect, it } from "bun:test";

import { buildSchemaGraph } from "./graph";

const baseInput = {
  siteName: "Ethotechnics Institute",
  siteBase: "https://ethotechnics.org",
  siteDescription: "Ethical technology standards and mechanisms.",
  title: "Example page",
  description: "Example description",
  seoImage: {
    src: "https://ethotechnics.org/api/og.png?template=default",
    alt: "Example page — Ethotechnics Institute",
    width: 1200,
    height: 630,
  },
  organizationId: "https://ethotechnics.org#organization",
  websiteId: "https://ethotechnics.org#website",
  logoId: "https://ethotechnics.org#logo",
  logoUrl: "https://ethotechnics.org/logo.svg",
  normalizedPublishedTime: "2025-01-01T00:00:00.000Z",
  normalizedModifiedTime: "2025-01-02T00:00:00.000Z",
};

const buildForRoute = (route: {
  canonical: string;
  structuredDataType:
    | "collection"
    | "webpage"
    | "defined-term"
    | "tech-article";
  openGraphType: "article" | "website";
  breadcrumbs: Array<{ name: string; absoluteUrl: string }>;
}) =>
  buildSchemaGraph({
    ...baseInput,
    canonical: route.canonical,
    webpageId: route.canonical,
    primaryImageId: `${route.canonical}#primaryimage`,
    structuredDataType: route.structuredDataType,
    openGraphType: route.openGraphType,
    breadcrumbs: route.breadcrumbs,
  });

describe("buildSchemaGraph", () => {
  it("builds homepage collection schema", () => {
    const graph = buildForRoute({
      canonical: "https://ethotechnics.org/",
      structuredDataType: "collection",
      openGraphType: "website",
      breadcrumbs: [{ name: "Home", absoluteUrl: "https://ethotechnics.org/" }],
    });

    const webpage = graph.find(
      (node) => node["@id"] === "https://ethotechnics.org/",
    );
    expect(webpage?.["@type"]).toBe("CollectionPage");
    expect(graph.some((node) => node["@type"] === "Article")).toBeFalse();
  });

  it("builds article-like page schema with article node", () => {
    const graph = buildForRoute({
      canonical: "https://ethotechnics.org/research/ai-assurance",
      structuredDataType: "webpage",
      openGraphType: "article",
      breadcrumbs: [
        { name: "Home", absoluteUrl: "https://ethotechnics.org/" },
        {
          name: "Research",
          absoluteUrl: "https://ethotechnics.org/research",
        },
      ],
    });

    const articleNode = graph.find((node) => node["@type"] === "Article");
    expect(articleNode).toBeDefined();
    expect(articleNode?.["@id"]).toBe(
      "https://ethotechnics.org/research/ai-assurance#article",
    );
    expect(graph.some((node) => node["@type"] === "BreadcrumbList")).toBeTrue();
  });

  it("builds glossary term schema as DefinedTerm", () => {
    const graph = buildForRoute({
      canonical: "https://ethotechnics.org/glossary/accountability",
      structuredDataType: "defined-term",
      openGraphType: "article",
      breadcrumbs: [
        { name: "Home", absoluteUrl: "https://ethotechnics.org/" },
        { name: "Glossary", absoluteUrl: "https://ethotechnics.org/glossary" },
      ],
    });

    const webpage = graph.find(
      (node) =>
        node["@id"] === "https://ethotechnics.org/glossary/accountability",
    );
    expect(webpage?.["@type"]).toBe("DefinedTerm");
    expect(webpage).toHaveProperty(
      "inDefinedTermSet",
      "https://ethotechnics.org/glossary",
    );
  });

  it("builds standards page schema as webpage with article metadata", () => {
    const graph = buildForRoute({
      canonical: "https://ethotechnics.org/standards/w3c-vc-schemas",
      structuredDataType: "webpage",
      openGraphType: "article",
      breadcrumbs: [
        { name: "Home", absoluteUrl: "https://ethotechnics.org/" },
        {
          name: "Standards",
          absoluteUrl: "https://ethotechnics.org/standards",
        },
      ],
    });

    const webpage = graph.find(
      (node) =>
        node["@id"] === "https://ethotechnics.org/standards/w3c-vc-schemas",
    );
    expect(webpage?.["@type"]).toBe("WebPage");
    expect(graph.some((node) => node["@type"] === "Article")).toBeTrue();
  });
});
