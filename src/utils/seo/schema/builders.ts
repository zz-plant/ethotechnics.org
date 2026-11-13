import type { ArticleType } from "../route-type";
import type {
  ArticleNode,
  BreadcrumbListNode,
  JsonLdNode,
  OrganizationNode,
  PersonReference,
  WebsiteNode,
  WebPageNode,
} from "./types";

const buildOrganizationNode = (input: {
  organizationId: string;
  siteName: string;
  siteBase: string;
  description: string;
  logoId: string;
  logoUrl: string;
  sameAs: string[];
}): OrganizationNode => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": input.organizationId,
  name: input.siteName,
  url: input.siteBase,
  description: input.description,
  logo: {
    "@type": "ImageObject",
    "@id": input.logoId,
    url: input.logoUrl,
  },
  sameAs: input.sameAs,
});

const buildWebsiteNode = (input: {
  websiteId: string;
  siteName: string;
  siteBase: string;
  organizationId: string;
  author: PersonReference;
}): WebsiteNode => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": input.websiteId,
  name: input.siteName,
  url: input.siteBase,
  inLanguage: "en",
  publisher: {
    "@id": input.organizationId,
  },
  author: input.author,
  potentialAction: {
    "@type": "SearchAction",
    target: `${new URL("/search", input.siteBase).toString()}?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

const buildWebPageNode = (input: {
  webpageId: string;
  title: string;
  description: string;
  canonical: string;
  websiteId: string;
  organizationId: string;
  primaryImageId: string;
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  webPageType: WebPageNode["@type"];
}): WebPageNode => ({
  "@context": "https://schema.org",
  "@type": input.webPageType,
  "@id": input.webpageId,
  name: input.title,
  description: input.description,
  url: input.canonical,
  inLanguage: "en",
  isPartOf: {
    "@id": input.websiteId,
  },
  publisher: {
    "@id": input.organizationId,
  },
  primaryImageOfPage: {
    "@type": "ImageObject",
    "@id": input.primaryImageId,
    url: input.imageUrl,
    width: input.imageWidth,
    height: input.imageHeight,
    caption: input.imageAlt,
  },
  image: {
    "@id": input.primaryImageId,
  },
});

const buildBreadcrumbListNode = (input: {
  canonical: string;
  items: Array<{ name: string; absoluteUrl: string }>;
}): BreadcrumbListNode => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": `${input.canonical}#breadcrumb`,
  itemListElement: input.items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.absoluteUrl,
  })),
});

const buildArticleNode = (input: {
  articleId: string;
  articleType: ArticleType;
  headline: string;
  description: string;
  imageUrl: string;
  organizationId: string;
  /** A named person; the organization when absent. */
  author?: PersonReference;
  webpageId: string;
  datePublished?: string;
  dateModified?: string;
}): ArticleNode => ({
  "@context": "https://schema.org",
  "@type": input.articleType,
  "@id": input.articleId,
  headline: input.headline,
  description: input.description,
  image: [input.imageUrl],
  author: input.author ?? {
    "@id": input.organizationId,
  },
  publisher: {
    "@id": input.organizationId,
  },
  mainEntityOfPage: {
    "@id": input.webpageId,
  },
  inLanguage: "en",
  ...(input.datePublished ? { datePublished: input.datePublished } : {}),
  ...(input.dateModified ? { dateModified: input.dateModified } : {}),
});

/** The interactive tool a diagnostic page runs. */
const buildWebApplicationNode = (input: {
  appId: string;
  name: string;
  description: string;
  url: string;
  organizationId: string;
}): JsonLdNode => ({
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": input.appId,
  name: input.name,
  description: input.description,
  url: input.url,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  inLanguage: "en",
  publisher: { "@id": input.organizationId },
});

export {
  buildArticleNode,
  buildWebApplicationNode,
  buildBreadcrumbListNode,
  buildOrganizationNode,
  buildWebPageNode,
  buildWebsiteNode,
};
