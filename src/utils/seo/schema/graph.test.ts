import { describe, expect, it } from "bun:test";

import { resolveRouteProfile } from "../route-type";
import { buildSchemaGraph, itemList, type PageSchema } from "./graph";

const site = "https://ethotechnics.org";

const build = (path: string, schema?: PageSchema) => {
  const canonical = new URL(path, site).toString();
  return buildSchemaGraph({
    siteName: "Ethotechnics Institute",
    siteBase: `${site}/`,
    siteDescription: "Standards for answerable automated decisions.",
    canonical,
    title: "Example page — Ethotechnics",
    pageName: "Example page",
    description: "Example description",
    seoImage: {
      src: `${site}/api/og.png?template=default`,
      alt: "Example page — Ethotechnics Institute",
      width: 1200,
      height: 630,
    },
    organizationId: `${site}/#organization`,
    websiteId: `${site}/#website`,
    logoId: `${site}/#logo`,
    logoUrl: `${site}/favicon.svg`,
    primaryImageId: `${canonical}#primaryimage`,
    profile: resolveRouteProfile(path),
    normalizedPublishedTime: "2026-01-09T00:00:00.000Z",
    normalizedModifiedTime: "2026-02-01T00:00:00.000Z",
    breadcrumbs: [
      { name: "Home", absoluteUrl: `${site}/` },
      { name: "Example page", absoluteUrl: canonical },
    ],
    schema,
  });
};

const pageNodes = (graph: ReturnType<typeof build>, canonical: string) =>
  graph.filter((node) => node["@id"] === canonical);

describe("buildSchemaGraph", () => {
  it("describes every page with exactly one page node", () => {
    for (const path of [
      "/",
      "/standards",
      "/standards/std-08-delegation",
      "/diagnostics/record-conformance",
      "/glossary/contestability",
      "/explainers/stoppability",
    ]) {
      const graph = build(path, { faq: [{ question: "Q?", answer: "A." }] });
      const ids = graph.map((node) => node["@id"]).filter(Boolean);
      expect(new Set(ids).size).toBe(ids.length);
      expect(pageNodes(graph, new URL(path, site).toString())).toHaveLength(1);
    }
  });

  it("credits the framework's author by the Person @id kanav.net publishes", () => {
    const website = build("/").find((node) => node["@type"] === "WebSite");
    expect(website?.author).toEqual({
      "@type": "Person",
      "@id": "https://kanav.net/#person",
      name: "Kanav Jain",
      url: "https://kanav.net",
    });
  });

  it("credits an article to whoever its byline names", () => {
    const essay = build("/research/the-green-dashboard", {
      byline: "Kanav Jain",
    }).find((node) => String(node["@id"]).endsWith("#article"));
    expect(essay?.author).toMatchObject({
      "@type": "Person",
      "@id": "https://kanav.net/#person",
    });

    const standard = build("/standards/std-08-delegation", {
      byline: "Ethotechnics Institute",
    }).find((node) => String(node["@id"]).endsWith("#article"));
    expect(standard?.author).toEqual({ "@id": `${site}/#organization` });
  });

  it("gives a hub a CollectionPage and no article", () => {
    const graph = build("/standards", {
      page: { mainEntity: itemList([{ name: "STD-01", url: `${site}/a` }]) },
    });
    const [page] = pageNodes(graph, `${site}/standards`);
    expect(page?.["@type"]).toBe("CollectionPage");
    expect(page?.mainEntity).toMatchObject({
      "@type": "ItemList",
      numberOfItems: 1,
      itemListElement: [{ position: 1, item: { name: "STD-01" } }],
    });
    expect(graph.some((node) => String(node["@id"]).endsWith("#article"))).toBe(
      false,
    );
  });

  it("gives a standard a TechArticle carrying its identifier and dates", () => {
    const graph = build("/standards/std-08-delegation", {
      article: { identifier: "STD-08", version: "0.3.2" },
    });
    const article = graph.find((node) => node["@type"] === "TechArticle");
    expect(article).toMatchObject({
      "@id": `${site}/standards/std-08-delegation#article`,
      headline: "Example page",
      identifier: "STD-08",
      version: "0.3.2",
      datePublished: "2026-01-09T00:00:00.000Z",
      mainEntityOfPage: { "@id": `${site}/standards/std-08-delegation` },
    });
  });

  it("describes a tool page's tool as a WebApplication", () => {
    const graph = build("/diagnostics/record-conformance");
    const [page] = pageNodes(graph, `${site}/diagnostics/record-conformance`);
    expect(page?.mainEntity).toEqual({
      "@id": `${site}/diagnostics/record-conformance#app`,
    });
    expect(graph.some((node) => node["@type"] === "WebApplication")).toBe(true);
    expect(graph.some((node) => node["@type"] === "Article")).toBe(false);
  });

  it("makes a page with questions an FAQPage too", () => {
    const graph = build("/explainers/stoppability", {
      faq: [{ question: "What is it?", answer: "A halt that works." }],
    });
    const [page] = pageNodes(graph, `${site}/explainers/stoppability`);
    expect(page?.["@type"]).toEqual(["WebPage", "FAQPage"]);
    expect(page?.mainEntity).toEqual([
      {
        "@type": "Question",
        name: "What is it?",
        acceptedAnswer: { "@type": "Answer", text: "A halt that works." },
      },
    ]);
  });

  it("adds the entities a page describes under their own @id", () => {
    const termId = `${site}/glossary/contestability#defined-term`;
    const graph = build("/glossary/contestability", {
      page: { mainEntity: { "@id": termId } },
      nodes: [
        { "@type": "DefinedTerm", "@id": termId, name: "Contestability" },
      ],
    });
    const [page] = pageNodes(graph, `${site}/glossary/contestability`);
    expect(page?.["@type"]).toBe("WebPage");
    expect(page?.mainEntity).toEqual({ "@id": termId });
    expect(graph.find((node) => node["@id"] === termId)).toMatchObject({
      "@context": "https://schema.org",
      "@type": "DefinedTerm",
    });
  });
});
