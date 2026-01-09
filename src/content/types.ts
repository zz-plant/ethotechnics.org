export type PageCopy = {
  pageTitle: string;
  pageDescription: string;
};

export type PublishedContent = {
  published: string;
  updated?: string;
};

export type Author = {
  name: string;
  affiliation: string;
  email?: string;
  orcid?: string;
};

export type PublicationMetadata = {
  authors: Author[];
  contact: string;
  published: string;
  updated?: string;
  version: string;
  doi?: string;
  archiveUrl?: string;
  changelog: { version: string; date: string; summary: string }[];
  license: { label: string; href: string };
  attribution: string;
};

export type PageWithPermalink = PageCopy & {
  permalink: string;
};

export type GlossaryLinked = {
  glossaryRefs: string[];
};

export type AnchorLink = {
  href: string;
  label: string;
};

export type PanelCopy = {
  eyebrow: string;
  title: string;
  description: string;
};
