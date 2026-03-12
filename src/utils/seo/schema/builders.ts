import type {
  ArticleNode,
  BreadcrumbListNode,
  OrganizationNode,
  WebsiteNode,
  WebPageNode,
  WebPageType,
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
  webPageType: WebPageType;
  inDefinedTermSet?: string;
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
  ...(input.inDefinedTermSet
    ? {
        inDefinedTermSet: input.inDefinedTermSet,
      }
    : {}),
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
  articleType: "Article" | "TechArticle";
  headline: string;
  description: string;
  imageUrl: string;
  organizationId: string;
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
  author: {
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

export {
  buildArticleNode,
  buildBreadcrumbListNode,
  buildOrganizationNode,
  buildWebPageNode,
  buildWebsiteNode,
};
