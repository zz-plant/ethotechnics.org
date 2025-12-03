export type PageCopy = {
  pageTitle: string;
  pageDescription: string;
};

export type PageWithPermalink = PageCopy & {
  permalink: string;
};

export type GlossaryLinked = {
  glossaryRefs: string[];
};
