import type { PageWithPermalink, PublishedContent } from "./types";

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
  pageTitle: "Institute — Ethotechnics",
  pageDescription:
    "A visitor guide to Institute programs, decision forums, and how to involve the Studio when you need a partner.",
  published: "2024-09-01T00:00:00Z",
  permalink: "/institute",
  highlights: [
    {
      title: "Start with open guidance",
      detail:
        "Pull prompts, templates, and diagnostics from the Library to get a quick read on risk before involving a partner.",
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
        "If a diagnostic surfaces risk, see how the Studio steps in so escalation feels like help, not red tape.",
      tags: ["Escalation", "Studio partnership", "Fast triage"],
    },
  ],
  programs: [
    {
      title: "Readiness diagnostics",
      detail:
        "Short exercises to score risk across data stewardship, consent, and downstream impact.",
      outcome:
        "Outputs: a risk map, suggested mitigations, and links back to Library pages so teams can act.",
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
        "Lightweight governance reviews for teams that want a second set of eyes without slowing delivery.",
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
      detail:
        "Support for turning internal research or playbooks into open, reusable guides that stay versioned.",
      outcome:
        "Outputs: edited copy, citations, and release notes in the Library so readers can trust the source.",
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
      focus:
        "Roadmapping programs and coordinating partners across the studio.",
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
