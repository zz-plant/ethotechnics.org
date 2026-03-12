export type SchemaContext = "https://schema.org";

export type OrganizationNode = {
  "@context": SchemaContext;
  "@type": "Organization";
  "@id": string;
  name: string;
  url: string;
  description: string;
  logo: {
    "@type": "ImageObject";
    "@id": string;
    url: string;
  };
  sameAs: string[];
};

export type WebsiteNode = {
  "@context": SchemaContext;
  "@type": "WebSite";
  "@id": string;
  name: string;
  url: string;
  inLanguage: "en";
  publisher: { "@id": string };
  potentialAction: {
    "@type": "SearchAction";
    target: string;
    "query-input": "required name=search_term_string";
  };
};

export type WebPageType = "WebPage" | "CollectionPage" | "DefinedTerm";

export type WebPageNode = {
  "@context": SchemaContext;
  "@type": WebPageType;
  "@id": string;
  name: string;
  description: string;
  url: string;
  inLanguage: "en";
  isPartOf: { "@id": string };
  publisher: { "@id": string };
  primaryImageOfPage: {
    "@type": "ImageObject";
    "@id": string;
    url: string;
    width: number;
    height: number;
    caption: string;
  };
  image: { "@id": string };
  breadcrumb?: { "@id": string };
  inDefinedTermSet?: string;
  dateModified?: string;
};

export type BreadcrumbListNode = {
  "@context": SchemaContext;
  "@type": "BreadcrumbList";
  "@id": string;
  itemListElement: Array<{
    "@type": "ListItem";
    position: number;
    name: string;
    item: string;
  }>;
};

export type ArticleNode = {
  "@context": SchemaContext;
  "@type": "Article" | "TechArticle";
  "@id": string;
  headline: string;
  description: string;
  image: string[];
  author: { "@id": string };
  publisher: { "@id": string };
  mainEntityOfPage: { "@id": string };
  inLanguage: "en";
  datePublished?: string;
  dateModified?: string;
};

export type SchemaNode =
  | OrganizationNode
  | WebsiteNode
  | WebPageNode
  | BreadcrumbListNode
  | ArticleNode;
