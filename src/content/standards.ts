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
    {
      id: "STD-02",
      slug: "std-02-contestability-recourse",
      title: "The Contestability & Recourse Standard",
      description:
        "Defines contestability, review, and remedy obligations for consequential systems.",
      status: "Draft for Peer Review",
      version: "0.9",
      effectiveDate: "TBD (proposed 2026)",
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
      id: "ethotechnics-for-agents",
      title: "Ethotechnics for Agents",
      description:
        "Mechanism-first practice for implementing STD-01 and STD-02 in real agent systems.",
      href: "/standards/ethotechnics-for-agents",
      eyebrow: "Practice",
      ctaLabel: "View practice",
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
      id: "std-01-rights-matrix",
      title: "STD-01 rights matrix",
      description:
        "Crosswalk linking STD-01 rights to validators and mechanisms.",
      href: "/standards/std-01-rights-matrix",
      eyebrow: "STD-01 reference",
      ctaLabel: "View matrix",
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
      id: "where-this-binds",
      title: "Where this binds",
      description:
        "Guidance for referencing standards in contracts, procurement, and audits.",
      href: "/standards/where-this-binds",
      eyebrow: "Governance",
      ctaLabel: "See guidance",
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
