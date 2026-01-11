import type { AnchorLink, PageWithPermalink, PanelCopy } from "./types";

export type StandardEntry = {
  id: string;
  slug: string;
  title: string;
  description: string;
  status: string;
  version: string;
  effectiveDate: string;
  published: string;
};

export type DoctrineEntry = {
  id: string;
  title: string;
  description: string;
  href: string;
  eyebrow?: string;
  ctaLabel: string;
};

export type StandardsContent = PageWithPermalink & {
  anchorLinks: AnchorLink[];
  panelCopy: PanelCopy;
  standards: StandardEntry[];
  doctrine: DoctrineEntry[];
};

export const standardsContent: StandardsContent = {
  pageTitle: "Standards — Ethotechnics Institute",
  pageDescription:
    "Canonical standards and doctrine stewarded by the Institute of Ethotechnics.",
  permalink: "/standards",
  anchorLinks: [
    { href: "#active", label: "Active standards" },
    { href: "#doctrine", label: "Doctrine" },
  ],
  panelCopy: {
    eyebrow: "Stewardship",
    title: "Documented for citation",
    description:
      "Each standard ships with stable IDs, publication metadata, and direct references to mechanisms.",
  },
  standards: [
    {
      id: "STD-01",
      slug: "std-01-temporal-rights",
      title: "The Temporal Bill of Rights",
      description:
        "Defines the seven inalienable rights protecting human time against automated systems.",
      status: "Draft for Ratification",
      version: "1.0",
      effectiveDate: "January 2026",
      published: "2026-01-01",
    },
  ],
  doctrine: [
    {
      id: "core-axioms",
      title: "Core axioms",
      description:
        "First principles for accountable system design and governance.",
      href: "/standards/core-axioms",
      eyebrow: "Doctrine",
      ctaLabel: "View axioms",
    },
    {
      id: "std-01-mapping-artifact",
      title: "STD-01 mapping artifact",
      description: "Brandless end-to-end mapping from harm to binding change.",
      href: "/standards/std-01-mapping-artifact",
      eyebrow: "STD-01 reference",
      ctaLabel: "Open mapping",
    },
    {
      id: "micro-diagram-language",
      title: "Micro-diagram language",
      description: "Canonical diagram shapes, line styles, and axes.",
      href: "/standards/micro-diagram-language",
      eyebrow: "Reference",
      ctaLabel: "View diagram spec",
    },
    {
      id: "std-01-minimum-binding-set",
      title: "STD-01 minimum binding set",
      description:
        "Minimum binding requirements per right with clause references.",
      href: "/standards/std-01-minimum-binding-set",
      eyebrow: "STD-01 reference",
      ctaLabel: "Review binding set",
    },
    {
      id: "glossary",
      title: "Glossary",
      description: "Immutable terminology and canonical definitions.",
      href: "/glossary",
      eyebrow: "Reference",
      ctaLabel: "Browse glossary",
    },
  ],
};
