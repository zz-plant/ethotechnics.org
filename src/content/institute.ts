import type {
  AnchorLink,
  PageWithPermalink,
  PanelCopy,
  PublishedContent,
} from "./types";

export type GovernanceItem = {
  title: string;
  detail: string;
};

export type Steward = {
  name: string;
  role: string;
  focus: string;
  contactLabel: string;
  contactHref: string;
};

export type ContactChannel = {
  label: string;
  href: string;
  description: string;
  linkLabel: string;
};

export type InstituteContent = PageWithPermalink &
  PublishedContent & {
    anchorLinks: AnchorLink[];
    panelCopy: PanelCopy;
    highlights: {
      title: string;
      detail: string;
      tags: string[];
    }[];
    boundaries: {
      title: string;
      detail: string;
      tags: string[];
    }[];
    programs: {
      title: string;
      detail: string;
      outcome: string;
      status: string;
      howToJoin: string;
      ctaLabel: string;
      ctaHref: string;
    }[];
    governance: GovernanceItem[];
    stewards: Steward[];
    contact: ContactChannel[];
  };

export const instituteContent: InstituteContent = {
  pageTitle: "Institute — Ethotechnics",
  pageDescription:
    "Open research arm developing Ethotechnics theory and methods, with clear routes to Studio support.",
  published: "2024-09-01T00:00:00Z",
  permalink: "/institute",
  anchorLinks: [
    { href: "#overview", label: "What we do" },
    { href: "#boundaries", label: "What we don't do" },
    { href: "#programs", label: "Release stewardship" },
    { href: "#studio", label: "Studio partnership" },
    { href: "#governance", label: "Governance" },
    { href: "#stewards", label: "Stewards" },
    { href: "#contact", label: "Contact" },
  ],
  panelCopy: {
    eyebrow: "Fast track",
    title: "Need implementation support? Start with the Studio.",
    description:
      "The Institute stays open and self-serve. The Studio helps with facilitation, audits, and co-delivery.",
  },
  highlights: [
    {
      title: "Publish open frameworks and patterns",
      detail:
        "Release frameworks, patterns, and tools that practitioners can reuse without gatekeeping.",
      tags: ["Open research", "Patterns", "Tools"],
    },
    {
      title: "Maintain the glossary and resource library",
      detail:
        "Keep shared terminology and pattern guidance stable for citation and reuse.",
      tags: ["Glossary", "Library", "Stable permalinks"],
    },
    {
      title: "Share case studies and field notes",
      detail:
        "Publish applied findings that translate practice into reusable guidance.",
      tags: ["Field notes", "Case studies", "Applied research"],
    },
    {
      title: "Support scholars and practitioners",
      detail:
        "Offer clear citations, research metadata, and resources for academic and field use.",
      tags: ["Citations", "Research support", "Practitioner-ready"],
    },
  ],
  boundaries: [
    {
      title: "No direct consulting",
      detail:
        "Implementation support lives with Ethotechnics Studio, not the Institute.",
      tags: ["Studio", "Implementation"],
    },
    {
      title: "No certification or credentialing",
      detail:
        "The Institute does not offer certification programs at this time.",
      tags: ["No credentialing"],
    },
    {
      title: "No active community facilitation",
      detail:
        "Resources are self-serve; community facilitation is not a current offering.",
      tags: ["Self-serve", "Resources"],
    },
  ],
  programs: [
    {
      title: "Framework releases",
      detail:
        "Open releases of frameworks, patterns, and tooling documentation.",
      outcome:
        "Outputs: versioned releases with citations, changelogs, and permalinks.",
      status: "Active development",
      howToJoin:
        "Follow updates on the Research and Mechanisms pages.",
      ctaLabel: "Browse frameworks",
      ctaHref: "/standards",
    },
    {
      title: "Research synthesis",
      detail:
        "Working papers, field notes, and bridge artifacts for scholars and practitioners.",
      outcome:
        "Outputs: structured abstracts, datasets, and citation guidance.",
      status: "Rolling publication",
      howToJoin: "Browse the Research section for current releases.",
      ctaLabel: "Read research",
      ctaHref: "/research",
    },
    {
      title: "Case study publishing",
      detail:
        "Applied case studies shared through Field Notes and research artifacts.",
      outcome:
        "Outputs: anonymized case narratives, pattern links, and recommended next steps.",
      status: "As available",
      howToJoin: "Share a field note or case study when you have one.",
      ctaLabel: "Share a field note",
      ctaHref: "/field-notes",
    },
  ],
  governance: [
    {
      title: "Public charter",
      detail:
        "Clear rules for consent, attribution, and data handling so partners know how their input is used.",
    },
    {
      title: "Documented safeguards",
      detail:
        "Escalation paths, appeal windows, and office hours when a diagnostic shows heightened risk.",
    },
    {
      title: "Decision history",
      detail:
        "Versioned notes and steward assignments so future teams can see why a path was chosen.",
    },
  ],
  stewards: [
    {
      name: "Kanav Jain",
      role: "Institute Lead",
      focus: "Roadmapping programs and coordinating Studio partners.",
      contactLabel: "Contact Kanav",
      contactHref:
        "mailto:hello@ethotechnics.org?subject=Institute%20steward%20contact",
    },
  ],
  contact: [
    {
      label: "Book a diagnostic review",
      href: "mailto:studio@ethotechnics.org",
      description:
        "Share the diagnostic output or risk area so we can suggest the right forum.",
      linkLabel: "Email Studio",
    },
    {
      label: "Research inquiries",
      href: "mailto:research@ethotechnics.org",
      description:
        "Questions about citations, working papers, or scholarly collaboration.",
      linkLabel: "Email research@ethotechnics.org",
    },
    {
      label: "Press and speaking",
      href: "mailto:hello@ethotechnics.org",
      description: "For briefings, interviews, or event participation.",
      linkLabel: "Email hello@ethotechnics.org",
    },
  ],
};
