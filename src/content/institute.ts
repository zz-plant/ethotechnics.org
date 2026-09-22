import type { AnchorLink, PageWithPermalink, PublishedContent } from "./types";

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
  pageTitle:
    "Institute — AI Governance Programs and Decision Forums | Ethotechnics",
  pageDescription:
    "The Institute runs diagnostic reviews, decision forums that log an owner and follow-ups, and a publishing pipeline for open guides, with a route to Studio.",
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
      tags: ["Self-serve", "Open CC BY 4.0", "Library-first"],
    },
    {
      title: "Choose the right program",
      detail:
        "Join a sprint, research cohort, or forum that matches your decision window.",
      tags: ["Sprints", "Cohorts", "Forums"],
    },
    {
      title: "Know when to escalate",
      detail:
        "When a diagnostic surfaces a risk your team cannot close alone, the Studio takes it on as a commissioned engagement. The comparison below shows where that handoff happens.",
      tags: ["Escalation", "Studio partnership", "Fast triage"],
    },
  ],
  programs: [
    {
      title: "Readiness diagnostics",
      detail:
        "Short exercises that rate risk in data handling, user consent, and impact after launch.",
      outcome:
        "Outputs: a risk map, suggested mitigations, and links to the Library pages behind each one.",
      status: "Rolling access",
      howToJoin:
        "Start with the diagnostics menu and share your readout for routing.",
      ctaLabel: "Request a diagnostic review",
      ctaHref:
        "mailto:studio@ethotechnics.org?subject=Diagnostic%20review%20request",
    },
    {
      title: "Decision forums",
      detail:
        "Short governance reviews of a pending decision by reviewers from outside the team.",
      outcome:
        "Outputs: a logged decision, accountable steward, and follow-ups with owners and dates.",
      status: "Quarterly cohorts",
      howToJoin: "Email the Studio to be matched with the next forum window.",
      ctaLabel: "Join the next forum",
      ctaHref:
        "mailto:studio@ethotechnics.org?subject=Decision%20forum%20request",
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
        "Escalation paths, appeal windows, and office hours when a diagnostic shows heightened risk.",
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
      label: "Book a diagnostic review",
      href: "mailto:studio@ethotechnics.org",
      description:
        "Share the diagnostic output or risk area so we can suggest the right forum.",
      linkLabel: "Email Studio",
    },
    {
      label: "Propose a program partnership",
      href: "mailto:studio@ethotechnics.org",
      description:
        "Co-develop a cohort, publish a playbook, or request facilitation support.",
      linkLabel: "Email Studio",
    },
    {
      label: "Press and speaking",
      href: "mailto:hello@ethotechnics.org",
      description: "For briefings, interviews, or event participation.",
      linkLabel: "Email hello@ethotechnics.org",
    },
  ],
};
