import {
  buildArticleNode,
  buildBreadcrumbListNode,
  buildOrganizationNode,
  buildWebPageNode,
  buildWebsiteNode,
} from "./builders";
import type { SchemaNode, WebPageType } from "./types";

type StructuredDataType =
  | "collection"
  | "webpage"
  | "defined-term"
  | "tech-article";

type SeoImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type SchemaGraphInput = {
  siteName: string;
  siteBase: string;
  siteDescription: string;
  canonical: string;
  title: string;
  description: string;
  seoImage: SeoImage;
  organizationId: string;
  websiteId: string;
  webpageId: string;
  logoId: string;
  logoUrl: string;
  primaryImageId: string;
  structuredDataType: StructuredDataType;
  openGraphType: "article" | "website";
  normalizedPublishedTime?: string;
  normalizedModifiedTime?: string;
  breadcrumbs: Array<{ name: string; absoluteUrl: string }>;
};

const mapWebPageType = (type: StructuredDataType): WebPageType => {
  if (type === "collection") return "CollectionPage";
  if (type === "defined-term") return "DefinedTerm";
  return "WebPage";
};

const buildSchemaGraph = (input: SchemaGraphInput): SchemaNode[] => {
  const graph: SchemaNode[] = [];

  graph.push(
    buildOrganizationNode({
      organizationId: input.organizationId,
      siteName: input.siteName,
      siteBase: input.siteBase,
      description: input.siteDescription,
      logoId: input.logoId,
      logoUrl: input.logoUrl,
      sameAs: [
        "https://ethotechnics.com",
        "https://github.com/zz-plant/ethotechnics.org",
      ],
    }),
  );

  graph.push(
    buildWebsiteNode({
      websiteId: input.websiteId,
      siteName: input.siteName,
      siteBase: input.siteBase,
      organizationId: input.organizationId,
    }),
  );

  const webpageNode = buildWebPageNode({
    webpageId: input.webpageId,
    title: input.title,
    description: input.description,
    canonical: input.canonical,
    websiteId: input.websiteId,
    organizationId: input.organizationId,
    primaryImageId: input.primaryImageId,
    imageUrl: input.seoImage.src,
    imageWidth: input.seoImage.width,
    imageHeight: input.seoImage.height,
    imageAlt: input.seoImage.alt,
    webPageType: mapWebPageType(input.structuredDataType),
    inDefinedTermSet:
      input.structuredDataType === "defined-term"
        ? new URL("/glossary", input.siteBase).toString()
        : undefined,
  });

  if (input.normalizedModifiedTime) {
    webpageNode.dateModified = input.normalizedModifiedTime;
  }

  if (input.breadcrumbs.length > 1) {
    const breadcrumbNode = buildBreadcrumbListNode({
      canonical: input.canonical,
      items: input.breadcrumbs,
    });
    graph.push(breadcrumbNode);
    webpageNode.breadcrumb = {
      "@id": breadcrumbNode["@id"],
    };
  }

  graph.push(webpageNode);

  if (input.openGraphType === "article") {
    graph.push(
      buildArticleNode({
        articleId: `${input.canonical}#article`,
        articleType:
          input.structuredDataType === "tech-article"
            ? "TechArticle"
            : "Article",
        headline: input.title,
        description: input.description,
        imageUrl: input.seoImage.src,
        organizationId: input.organizationId,
        webpageId: input.webpageId,
        datePublished: input.normalizedPublishedTime,
        dateModified: input.normalizedModifiedTime,
      }),
    );
  }

  return graph;
};

export { buildSchemaGraph };
export type { SchemaGraphInput, SeoImage, StructuredDataType };
