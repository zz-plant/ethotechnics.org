export type PageCopy = {
  pageTitle: string;
  pageDescription: string;
};

export type PublishedContent = {
  published: string;
  updated?: string;
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
