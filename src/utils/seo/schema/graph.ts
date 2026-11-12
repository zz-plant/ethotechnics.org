import type { RouteProfile } from "../route-type";
import {
  buildArticleNode,
  buildBreadcrumbListNode,
  buildOrganizationNode,
  buildWebApplicationNode,
  buildWebPageNode,
  buildWebsiteNode,
} from "./builders";
import type { JsonLdNode, PersonReference, SchemaNode } from "./types";

type SeoImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * What a page adds to the graph the layout builds for it. A page used to
 * emit a second page node of its own; five hubs described themselves twice,
 * three of them under the same @id with different properties.
 */
type PageSchema = {
  /** Merged into the page node: mainEntity, about, keywords, and the like. */
  page?: Record<string, unknown>;
  /** Merged into the article node: identifier, version, and the like. */
  article?: Record<string, unknown>;
  /** Entities the page describes, each with an @id under the page's URL. */
  nodes?: JsonLdNode[];
  /** Questions answered on the page. The page node becomes an FAQPage too. */
  faq?: Array<{ question: string; answer: string }>;
};

type SchemaGraphInput = {
  siteName: string;
  siteBase: string;
  siteDescription: string;
  canonical: string;
  /** The document title, brand included. */
  title: string;
  /** The page's own name, for an article headline or a tool's name. */
  pageName: string;
  description: string;
  seoImage: SeoImage;
  organizationId: string;
  websiteId: string;
  logoId: string;
  logoUrl: string;
  primaryImageId: string;
  profile: Pick<RouteProfile, "kind" | "pageType" | "articleType">;
  normalizedPublishedTime?: string;
  normalizedModifiedTime?: string;
  breadcrumbs: Array<{ name: string; absoluteUrl: string }>;
  schema?: PageSchema;
};

// The about page credits the framework to Kanav Jain and links kanav.net,
// whose Person node carries this @id.
const FRAMEWORK_AUTHOR: PersonReference = {
  "@type": "Person",
  "@id": "https://kanav.net/#person",
  name: "Kanav Jain",
  url: "https://kanav.net",
};

/** A list of the pages a collection links to, in the order it shows them. */
const itemList = (
  items: Array<{ name: string; url: string } & Record<string, unknown>>,
) => ({
  "@type": "ItemList",
  numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item,
  })),
});

const buildSchemaGraph = (input: SchemaGraphInput): SchemaNode[] => {
  const { canonical, profile, schema = {} } = input;
  const graph: SchemaNode[] = [];

  graph.push(
    buildOrganizationNode({
      organizationId: input.organizationId,
      siteName: input.siteName,
      siteBase: input.siteBase,
      description: input.siteDescription,
      logoId: input.logoId,
      logoUrl: input.logoUrl,
      // ethotechnics.com was listed here until October 2026. It was the
      // retired Studio's site, not another name for this organization.
      sameAs: ["https://github.com/zz-plant/ethotechnics.org"],
    }),
  );

  graph.push(
    buildWebsiteNode({
      websiteId: input.websiteId,
      siteName: input.siteName,
      siteBase: input.siteBase,
      organizationId: input.organizationId,
      author: FRAMEWORK_AUTHOR,
    }),
  );

  const webpageNode = buildWebPageNode({
    webpageId: canonical,
    title: input.title,
    description: input.description,
    canonical,
    websiteId: input.websiteId,
    organizationId: input.organizationId,
    primaryImageId: input.primaryImageId,
    imageUrl: input.seoImage.src,
    imageWidth: input.seoImage.width,
    imageHeight: input.seoImage.height,
    imageAlt: input.seoImage.alt,
    webPageType: schema.faq?.length
      ? [profile.pageType, "FAQPage"]
      : profile.pageType,
  });

  if (input.normalizedPublishedTime) {
    webpageNode.datePublished = input.normalizedPublishedTime;
  }
  if (input.normalizedModifiedTime) {
    webpageNode.dateModified = input.normalizedModifiedTime;
  }
  if (profile.kind === "home") {
    webpageNode.about = { "@id": input.organizationId };
  }

  if (input.breadcrumbs.length > 1) {
    const breadcrumbNode = buildBreadcrumbListNode({
      canonical,
      items: input.breadcrumbs,
    });
    graph.push(breadcrumbNode);
    webpageNode.breadcrumb = { "@id": breadcrumbNode["@id"] };
  }

  const pageNodes: SchemaNode[] = [webpageNode];

  if (profile.articleType) {
    const articleNode = buildArticleNode({
      articleId: `${canonical}#article`,
      articleType: profile.articleType,
      headline: input.pageName,
      description: input.description,
      imageUrl: input.seoImage.src,
      organizationId: input.organizationId,
      webpageId: canonical,
      datePublished: input.normalizedPublishedTime,
      dateModified: input.normalizedModifiedTime,
    });
    Object.assign(articleNode, schema.article);
    pageNodes.push(articleNode);
    webpageNode.mainEntity = { "@id": articleNode["@id"] };
  }

  if (profile.kind === "tool") {
    const appNode = buildWebApplicationNode({
      appId: `${canonical}#app`,
      name: input.pageName,
      description: input.description,
      url: canonical,
      organizationId: input.organizationId,
    });
    pageNodes.push(appNode);
    webpageNode.mainEntity = { "@id": appNode["@id"] };
  }

  if (schema.faq?.length) {
    webpageNode.mainEntity = schema.faq.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    }));
  }

  Object.assign(webpageNode, schema.page);
  graph.push(...pageNodes);

  for (const node of schema.nodes ?? []) {
    graph.push({ "@context": "https://schema.org", ...node });
  }

  return graph;
};

export { buildSchemaGraph, itemList };
export type { PageSchema, SchemaGraphInput, SeoImage };
