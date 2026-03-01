import type { PageCopy, PublishedContent } from "./types";
import homeData from "./home.json";

export type Metric = {
  label: string;
  value: string;
  icon?: string;
};

export type FeatureAction = {
  label: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon?: string;
  emphasis?: boolean;
  eyebrow?: string;
  pills?: string[];
  actions?: FeatureAction[];
};

export type Panel = {
  title: string;
  description: string;
  pills: string[];
};

export type HeroBadge = {
  label: string;
  title: string;
};

export type HeroAction = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  icon?: string;
};

export type HeroMedia = {
  src: string;
  alt: string;
  caption?: string;
};

export type HomeContent = PageCopy & {
  hero: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    lede: string;
    map: string;
    badge: HeroBadge;
    actions: HeroAction[];
    quickLinks: {
      href: string;
      label: string;
    }[];
    metrics: Metric[];
    panel: Panel;
    media: HeroMedia;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
    features: FeatureCard[];
  };
  tracks: {
    eyebrow: string;
    heading: string;
    body: string;
    promptTitle: string;
    promptNote: string;
    prompts: {
      question: string;
      answer: string;
      href: string;
      label: string;
    }[];
    cards: FeatureCard[];
  };
  features: {
    eyebrow: string;
    heading: string;
    body: string;
    cards: FeatureCard[];
  };
  highlight: {
    eyebrow: string;
    heading: string;
    body: string;
    note: PublishedContent & {
      title: string;
      description: string;
      actions: string[];
      link: {
        label: string;
        href: string;
      };
    };
    pills: string[];
    panel: {
      title: string;
      body: string;
      link: {
        label: string;
        href: string;
      };
    };
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    actions: HeroAction[];
  };
};

export const homeContent: HomeContent = homeData[0] as HomeContent;
