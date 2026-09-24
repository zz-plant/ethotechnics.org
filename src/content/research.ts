import type {
  AnchorLink,
  GlossaryLinked,
  PageWithPermalink,
  PublicationMetadata,
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
  // "planned" means no study has been run and nothing below is a result.
  status: "planned" | "published";
  structuredAbstract: {
    question: string;
    method: string;
    sample: string;
    findings: string;
    limitations: string;
  };
  datasets: string[];
  ethicsNotes: string[];
};

export type ResearchContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    anchorLinks: AnchorLink[];
    standardsTimeline: {
      period: string;
      title: string;
      summary: string;
      standardRef: string;
      href: string;
    }[];
    orientationCards: {
      title: string;
      description: string;
      tags: string[];
    }[];
    bridgeArtifacts: {
      slug: string;
      title: string;
      type: string;
      summary: string;
      tags: string[];
      href: string;
    }[];
    agenda: AgendaItem[];
    focusAreas: FocusArea[];
    publications: Publication[];
    lastUpdated: string;
    updateCadence: string;
  };

export const researchContent: ResearchContent = {
  pageTitle: "Research — Ethotechnics",
  pageDescription:
    "The research behind the standards: open questions, planned studies, theory essays, and dated research notes.",
  permalink: "/research",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-09-22T00:00:00Z",
  publication: {
    authors: [
      {
        name: "Ethotechnics Institute Research Team",
        affiliation: "Ethotechnics Institute",
        email: "research@ethotechnics.org",
      },
    ],
    contact: "research@ethotechnics.org",
    published: "2025-12-03T00:00:00Z",
    updated: "2026-09-22T00:00:00Z",
    version: "v1.2.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/web/*/https://ethotechnics.org/research",
    changelog: [
      {
        version: "v1.2.0",
        date: "2026-09-22",
        summary:
          "Marked the three publications as planned studies. Removed sample sizes, findings, and timeline entries that no published data supported, and four bridge artifacts that were never published.",
      },
      {
        version: "v1.1.0",
        date: "2026-01-09",
        summary:
          "Added structured abstracts, data transparency notes, and bridge artifact citations.",
      },
      {
        version: "v1.0.0",
        date: "2025-12-03",
        summary: "Initial research agenda and publication list.",
      },
    ],
    license: {
      label: "CC BY-SA 4.0",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    attribution:
      "Credit Ethotechnics Institute Research Team, include the page title + version, and link to the canonical permalink.",
  },
  lastUpdated: "2026-09-22T00:00:00Z",
  updateCadence:
    "Updates publish on a quarterly cadence with interim Field Notes.",
  anchorLinks: [
    { href: "#orientation", label: "Orientation" },
    { href: "#bridge-artifacts", label: "Bridge artifacts" },
    { href: "#standards-timeline", label: "Standards timeline" },
    { href: "#agenda", label: "Agenda" },
    { href: "#focus-areas", label: "Focus areas" },
    { href: "#publications", label: "Publications" },
  ],
  standardsTimeline: [
    {
      period: "2026 Q1",
      title: "STD-01 ratification draft",
      summary:
        "Version 1.0 was released for public review. It stays a draft until two independent implementation reports and a standards council ratification.",
      standardRef: "STD-01",
      href: "/standards/std-01-temporal-rights",
    },
    {
      period: "2026 Q3",
      title: "Typed decision model clauses",
      summary:
        "A review of typed decision models, which return a fixed answer type with a probability per option, led to three STD-08 clauses: content carries no authority, a decision threshold is a policy, and a routing threshold is part of the intervention specification.",
      standardRef: "STD-08",
      href: "/standards/std-08-delegation",
    },
  ],
  orientationCards: [
    {
      title: "Questions before findings",
      description:
        "Each focus area states the questions it is trying to answer. A finding is published only with the method and data behind it.",
      tags: ["Open questions", "Stated methods", "Data with findings"],
    },
    {
      title: "Glossary-linked",
      description:
        "Agenda items, focus areas, and publications link to the glossary terms they use, so a reader can check each definition.",
      tags: ["Glossary-linked", "Shared vocabulary"],
    },
    {
      title: "Research into standards",
      description:
        "Research that changes a requirement lands as a dated clause in a standard, recorded in that standard's publication history.",
      tags: ["Standards", "Dated clauses", "Publication history"],
    },
  ],
  bridgeArtifacts: [
    {
      slug: "frontier-doctrine-scan",
      title: "Frontier doctrine scan (2026-09)",
      type: "Dated research note",
      summary:
        "Ten frontier labs scored 0 to 4 against the twelve laws on public doctrine and product architecture, not safety performance.",
      tags: ["doctrine", "laws", "frontier"],
      href: "/research/frontier-doctrine-scan",
    },
    {
      slug: "theory-essays",
      title: "Theory essays",
      type: "Essay series",
      summary:
        "Why the laws hold: absorption as concealment, the engineering tradition, automation and capture, dependence without standing and running both ways, friction as accidental governance, what does not convert, insulation, ethotechnical design, what outcomes hide, challenge density, exception learning, the model of a person, endogenous authorization, deliberate non-use, the compulsion problem, what Ethotechnics is not, and democratic vs. coercive governability.",
      tags: ["theory", "laws", "doctrine"],
      href: "/research/theory",
    },
  ],
  agenda: [
    {
      title: "Participation and consent in high-volume services",
      timeframe: "Q3–Q4",
      goals: [
        "Map consent journeys for consequential services and find where fatigue or confusion spikes.",
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
        "Decision accountability, data handling, and escalation paths people can understand.",
      questions: [
        "What documentation shows non-technical partners how choices were made?",
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
        "Interface practices that show people their options, in plain language, without excluding anyone.",
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
      status: "planned",
      summary:
        "Planned field protocol for testing progressive consent prompts with the people who use a service.",
      tags: ["consent", "facilitation", "safeguards"],
      glossaryRefs: ["consent-journey"],
      href: "/explainers/consent-journey",
      ctaLabel: "Read the consent journey explainer",
      structuredAbstract: {
        question:
          "Do progressive consent prompts reduce fatigue and improve understanding?",
        method:
          "Planned: structured interviews and co-design workshops using scripted prompts and consent checkpoints.",
        sample: "No sessions have been run.",
        findings: "None yet.",
        limitations:
          "A small, qualitative study would not support statistical generalization.",
      },
      datasets: [
        "To be published with the results: anonymized checkpoint excerpts and the prompt pack.",
      ],
      ethicsNotes: [
        "Each session will record verbal consent.",
        "Participant identities will be removed from anything shared.",
      ],
    },
    {
      title: "Burden index signals",
      type: "report",
      status: "planned",
      summary:
        "Planned pilot to test which operational signals the burden modeler should weight most.",
      tags: ["diagnostics", "measurement", "governance"],
      glossaryRefs: ["burden-index", "signal-credibility"],
      href: "/diagnostics/burden-modeler",
      ctaLabel: "Open the burden modeler",
      structuredAbstract: {
        question:
          "Which operational signals most reliably predict sustained burden?",
        method:
          "Planned: burden modeler outputs compared with debriefs from the teams involved.",
        sample: "No scenarios have been collected.",
        findings: "None yet.",
        limitations:
          "A first pilot with a few teams would need validation with outside partners.",
      },
      datasets: [
        "To be published with the results: an anonymized scenario-level summary table.",
      ],
      ethicsNotes: [
        "Scenario names will be anonymized before anything is shared.",
        "Participating teams will consent to aggregate reporting.",
      ],
    },
    {
      title: "Maintenance readiness workshop",
      type: "deck",
      status: "planned",
      summary:
        "Workshop slides for negotiating stewardship windows with cross-functional leads.",
      tags: ["maintenance", "governance", "operations"],
      glossaryRefs: ["stewardship-window"],
      href: "mailto:studio@ethotechnics.org?subject=Maintenance%20readiness%20deck",
      ctaLabel: "Request the deck",
      structuredAbstract: {
        question: "Do stewardship windows improve maintenance readiness?",
        method:
          "Planned: facilitated tabletop exercises followed by a review of the teams' decision logs.",
        sample: "No workshops have been evaluated.",
        findings: "None yet.",
        limitations:
          "Results from facilitated sessions may not hold for teams working on their own.",
      },
      datasets: [
        "Stewardship window planning template.",
        "Communication cadence checklist with role mapping.",
      ],
      ethicsNotes: [
        "Partner data will stay confidential unless a partner chooses to share it.",
      ],
    },
  ],
};
