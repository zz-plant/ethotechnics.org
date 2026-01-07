import type {
  GlossaryLinked,
  PageWithPermalink,
  PublishedContent,
} from "./types";

export type AgendaItem = GlossaryLinked & {
  title: string;
  timeframe: string;
  goals: string[];
};

export type FocusArea = GlossaryLinked & {
  slug: string;
  title: string;
  description: string;
  questions: string[];
};

export type Publication = GlossaryLinked & {
  title: string;
  type: "protocol" | "report" | "deck";
  summary: string;
  tags: string[];
  href: string;
  ctaLabel: string;
};

export type ResearchContent = PageWithPermalink &
  PublishedContent & {
    agenda: AgendaItem[];
    focusAreas: FocusArea[];
    publications: Publication[];
    lastUpdated: string;
    updateCadence: string;
  };

export const researchContent: ResearchContent = {
  pageTitle: "Research — Ethotechnics",
  pageDescription:
    "Inquiries, methods, and study findings that surface the human impacts of technology.",
  permalink: "/research",
  published: "2024-09-01T00:00:00Z",
  lastUpdated: "2024-10-15T00:00:00Z",
  updateCadence:
    "Updates publish on a quarterly cadence with interim Field Notes.",
  agenda: [
    {
      title: "Participation and consent at scale",
      timeframe: "Q3–Q4",
      goals: [
        "Map consent journeys for high-stakes services and identify where fatigue or confusion spikes.",
        "Prototype safeguards that let people pause automation without losing access.",
        "Ship plain-language participation guides teams can adapt to new launches.",
      ],
      glossaryRefs: ["consent-journey", "safety-valve"],
    },
    {
      title: "Operational burden and service debt",
      timeframe: "Rolling",
      goals: [
        "Quantify burden index inputs with community partners and support teams.",
        "Track how often maintenance windows slip and what mitigations keep people safe.",
        "Publish heuristics for appeal paths that reduce frustration.",
      ],
      glossaryRefs: [
        "burden-index",
        "stewardship-window",
        "signal-credibility",
      ],
    },
  ],
  focusAreas: [
    {
      slug: "governance",
      title: "Governance",
      description:
        "Decision accountability, data stewardship, and escalation paths people can understand.",
      questions: [
        "What documentation helps non-technical partners see how choices were made?",
        "How can we expose decision logs without creating new harms?",
      ],
      glossaryRefs: ["stewardship-window", "signal-credibility"],
    },
    {
      slug: "safeguards",
      title: "Safeguards",
      description:
        "Consent-aware defaults, appeal paths, and reversible states that reduce risk.",
      questions: [
        "Where do people need safety valves to pause or undo automation?",
        "Which UI cues make opt-outs visible without friction?",
      ],
      glossaryRefs: ["consent-journey", "safety-valve"],
    },
    {
      slug: "ui-patterns",
      title: "UI patterns",
      description:
        "Interface practices that foreground agency, clarity, and inclusive framing.",
      questions: [
        "How do we explain model limitations without blame-shifting?",
        "Which interaction patterns keep people oriented in complex flows?",
      ],
      glossaryRefs: ["signal-credibility"],
    },
  ],
  publications: [
    {
      title: "Participatory consent prompts",
      type: "protocol",
      summary:
        "Field protocol and templates for testing progressive consent experiences with communities.",
      tags: ["consent", "facilitation", "safeguards"],
      glossaryRefs: ["consent-journey"],
      href: "/assets/start-here/playbook-excerpt.pdf",
      ctaLabel: "Download protocol",
    },
    {
      title: "Burden index calculator notes",
      type: "report",
      summary:
        "Applied findings from piloting the burden modeler across support and research teams.",
      tags: ["diagnostics", "measurement", "governance"],
      glossaryRefs: ["burden-index", "signal-credibility"],
      href: "/assets/start-here/diagnostic-readout.pdf",
      ctaLabel: "View report sample",
    },
    {
      title: "Maintenance readiness deck",
      type: "deck",
      summary:
        "Workshop slides for negotiating stewardship windows with cross-functional leads.",
      tags: ["maintenance", "governance", "operations"],
      glossaryRefs: ["stewardship-window"],
      href: "mailto:studio@ethotechnics.org?subject=Maintenance%20readiness%20deck",
      ctaLabel: "Request the deck",
    },
  ],
};
