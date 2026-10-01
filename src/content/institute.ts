import type { AnchorLink, PageWithPermalink, PublishedContent } from "./types";
import { studio, studioSummary } from "./studio";

export type GovernanceItem = {
  title: string;
  detail: string;
  artifactLabel: string;
  artifactHref: string;
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
    highlights: {
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
  pageTitle: "Institute — programs, stewards, and contact — Ethotechnics",
  pageDescription:
    "Open standards and diagnostics to use without contacting anyone, three programs outside teams can ask to join, and when to bring in the Studio for hands-on help.",
  published: "2025-09-01T00:00:00Z",
  permalink: "/institute",
  anchorLinks: [
    { href: "#overview", label: "What you can do" },
    { href: "#programs", label: "Programs" },
    { href: "#studio", label: "Studio partnership" },
    { href: "#governance", label: "Governance" },
    { href: "#stewards", label: "Stewards" },
    { href: "#contact", label: "Contact" },
  ],
  highlights: [
    {
      title: "Start with open guidance",
      detail:
        "Use the standards, mechanisms, and diagnostics without contacting anyone. A diagnostic readout names the risks before you involve a partner.",
      tags: ["Self-serve", "Open CC BY-SA 4.0", "Library-first"],
    },
    {
      title: "Contribute to the library",
      detail:
        "Send a public failure for scoring, a correction, or a draft guide for the library.",
      tags: ["Cases", "Corrections", "Guides"],
    },
    {
      title: "Know when to escalate",
      detail:
        "When a healthcare AI system needs an outside evaluation, the Studio takes it on as commissioned work. The comparison below shows where that handoff happens.",
      tags: ["Escalation", "Studio partnership"],
    },
  ],
  programs: [
    {
      title: "Self-serve diagnostics",
      detail:
        "Four tools that take one workflow or one record stream and return a readout you can file.",
      outcome:
        "Outputs: a scored readout, the mechanisms behind each finding, and a link you can share.",
      status: "Open",
      howToJoin: "Run one from the diagnostics page. No contact is needed.",
      ctaLabel: "Open the diagnostics",
      ctaHref: "/diagnostics",
    },
    {
      title: "Studio engagements",
      detail: studioSummary,
      outcome: `Outputs, as the Studio lists them: ${studio.offers.map((offer) => offer.output.charAt(0).toLowerCase() + offer.output.slice(1).replace(/\.$/, "")).join("; ")}.`,
      status: "Commissioned",
      howToJoin:
        "Book a consultation on ethotechnics.com, or email the Studio.",
      ctaLabel: "Visit Ethotechnics Studio",
      ctaHref: studio.href,
    },
    {
      title: "Publishing pipeline",
      detail: "Turn internal research into open guides.",
      outcome:
        "Outputs: edited copy, citations, and release notes published in the Library.",
      status: "By request",
      howToJoin: "Send a draft or outline for intake and scheduling.",
      ctaLabel: "Submit a draft",
      ctaHref:
        "mailto:hello@ethotechnics.org?subject=Publishing%20pipeline%20intake",
    },
  ],
  governance: [
    {
      title: "Public charter",
      detail:
        "Rules for consent, attribution, and data handling that state how a partner's input is used.",
      artifactLabel: "View RFC lifecycle",
      artifactHref: "/institute/governance#lifecycle",
    },
    {
      title: "Documented safeguards",
      detail:
        "Escalation paths and comment windows for the Institute's own decisions, each recorded as an RFC.",
      artifactLabel: "Review current RFCs",
      artifactHref: "/institute/governance#open-rfcs",
    },
    {
      title: "Decision history",
      detail:
        "Versioned notes and steward assignments so future teams can see why a path was chosen.",
      artifactLabel: "Open decision log",
      artifactHref: "/institute/governance#decision-log",
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
      label: "Commission the Studio",
      href: studio.href,
      description: `For an outside evaluation of a healthcare AI system. Book on ethotechnics.com or email ${studio.email}.`,
      linkLabel: "Ethotechnics Studio",
    },
    {
      label: "Contribute a case or a guide",
      href: "mailto:hello@ethotechnics.org?subject=Contribution",
      description:
        "Send a public failure for scoring, a correction, or a draft guide for the library.",
      linkLabel: "Email hello@ethotechnics.org",
    },
    {
      label: "Press and speaking",
      href: "mailto:hello@ethotechnics.org",
      description: "For briefings, interviews, or event participation.",
      linkLabel: "Email hello@ethotechnics.org",
    },
  ],
};
