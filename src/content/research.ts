import type {
  AnchorLink,
  GlossaryLinked,
  PageWithPermalink,
  PanelCopy,
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
  structuredAbstract: {
    question: string;
    method: string;
    sample: string;
    findings: string;
    limitations: string;
  };
  datasets: string[];
  ethicsNotes: string[];
  references: { label: string; href: string }[];
};

export type ResearchContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    anchorLinks: AnchorLink[];
    panelCopy: PanelCopy;
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
    "Inquiries, methods, and study findings that surface the human impacts of technology.",
  permalink: "/research",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-01-09T00:00:00Z",
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
    updated: "2026-01-09T00:00:00Z",
    version: "v1.1.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/save/https://ethotechnics.org/research",
    changelog: [
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
      label: "CC BY 4.0",
      href: "https://creativecommons.org/licenses/by/4.0/",
    },
    attribution:
      "Credit Ethotechnics Institute Research Team, include the page title + version, and link to the canonical permalink.",
  },
  lastUpdated: "2026-01-09T00:00:00Z",
  updateCadence:
    "Updates publish on a quarterly cadence with interim Field Notes.",
  anchorLinks: [
    { href: "#orientation", label: "Orientation" },
    { href: "#bridge-artifacts", label: "Bridge artifacts" },
    { href: "#agenda", label: "Agenda" },
    { href: "#focus-areas", label: "Focus areas" },
    { href: "#publications", label: "Publications" },
  ],
  panelCopy: {
    eyebrow: "How to read these entries",
    title: "Cross-linked with the Library glossary.",
    description:
      "Agenda items, focus areas, and publications link back to glossary anchors so readers share the same definitions. Use them when citing Field Notes or diagnostics results to keep language consistent.",
  },
  orientationCards: [
    {
      title: "Protocols with receipts",
      description:
        "Shared prompt packs and facilitation notes keep teams aligned when fielding interviews or co-design sessions.",
      tags: [
        "Participatory methods",
        "Plain-language scripts",
        "Reusable consent",
      ],
    },
    {
      title: "Decisions we can cite",
      description:
        "Every study ties to glossary anchors and decision logs, making it easy to reference the why behind research calls.",
      tags: ["Glossary-linked", "Decision hygiene", "Traceable handoffs"],
    },
    {
      title: "Signals into diagnostics",
      description:
        "Focus areas flow into readiness labs so partners see risk levels, escalation paths, and facilitation options in one place.",
      tags: ["Readiness labs", "Risk surfaced early", "Studio handoffs"],
    },
  ],
  bridgeArtifacts: [
    {
      slug: "burden-taxonomy",
      title: "Burden as a measurable governance risk",
      type: "Framework paper + taxonomy",
      summary:
        "Synthesis of burden signals, governance risk tiers, and linked instrument outputs for peer citation.",
      tags: ["taxonomy", "instrument", "governance"],
      href: "/research/bridge-artifacts#burden-taxonomy",
    },
    {
      slug: "consent-instrument",
      title: "Consent integrity instrument pack",
      type: "Validated instrument",
      summary:
        "Prompt pack and scoring rubric for evaluating consent journeys and disclosure compliance.",
      tags: ["instrument", "consent", "methods"],
      href: "/research/bridge-artifacts#consent-instrument",
    },
    {
      slug: "maintenance-case-series",
      title: "Maintenance stewardship case series",
      type: "Case study series",
      summary:
        "Comparable case studies capturing escalation ownership, comms cadence, and mitigation outcomes.",
      tags: ["case study", "operations", "stewardship"],
      href: "/research/bridge-artifacts#maintenance-case-series",
    },
    {
      slug: "pattern-language-review",
      title: "Ethotechnics pattern language review",
      type: "Systematic review",
      summary:
        "Structured review mapping pattern adoption across policy, design, and governance programs.",
      tags: ["systematic review", "patterns", "policy"],
      href: "/research/bridge-artifacts#pattern-language-review",
    },
  ],
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
      structuredAbstract: {
        question:
          "How do progressive consent prompts reduce fatigue and improve understanding?",
        method:
          "Structured interviews plus co-design workshops using scripted prompts and consent checkpoints.",
        sample:
          "8–12 participant sessions per pilot, spanning public service and healthcare contexts.",
        findings:
          "Layered prompts increase recall and reduce drop-off when paired with reversible exits.",
        limitations:
          "Small sample sizes and qualitative framing limit statistical generalization.",
      },
      datasets: [
        "Anonymized consent checkpoint transcripts (summary excerpts).",
        "Prompt pack template with scoring rubric.",
      ],
      ethicsNotes: [
        "Verbal consent recorded for each session.",
        "Participant identities anonymized in shared artifacts.",
      ],
      references: [
        {
          label:
            "Participatory design for AI systems (introductory bibliography)",
          href: "https://dl.acm.org/doi/10.1145/3313831.3376717",
        },
        {
          label: "Consent in sociotechnical systems primer",
          href: "https://doi.org/10.1145/3544548.3580917",
        },
      ],
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
      structuredAbstract: {
        question:
          "Which operational signals most reliably predict sustained burden?",
        method:
          "Mixed-methods pilot using burden modeler outputs plus qualitative debriefs.",
        sample:
          "12 scenarios across support, operations, and research groups over two quarters.",
        findings:
          "Handoff volume and escalation ambiguity correlate with the highest burden index spikes.",
        limitations:
          "Internal-only pilots; broader validation needed across external partners.",
      },
      datasets: [
        "Anonymized burden index summary table (scenario-level).",
        "Mitigation playbook excerpts tied to hotspot categories.",
      ],
      ethicsNotes: [
        "Scenario names anonymized before external sharing.",
        "Consent gathered from participating teams for aggregate reporting.",
      ],
      references: [
        {
          label: "Workload measurement in sociotechnical systems",
          href: "https://doi.org/10.1080/00140139.2020.1747045",
        },
        {
          label: "Human factors in operational risk",
          href: "https://doi.org/10.1201/9781315373865",
        },
      ],
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
      structuredAbstract: {
        question: "How do stewardship windows improve maintenance readiness?",
        method:
          "Workshop facilitation with tabletop exercises and decision log reviews.",
        sample:
          "6 maintenance planning cohorts across public and private sector teams.",
        findings:
          "Shared stewardship calendars improve escalation clarity and reduce rollback delays.",
        limitations:
          "Findings based on facilitated sessions; self-serve teams may vary.",
      },
      datasets: [
        "Stewardship window planning template.",
        "Communication cadence checklist with role mapping.",
      ],
      ethicsNotes: [
        "Facilitated sessions follow standard consent and anonymization protocols.",
        "Partner data remains confidential unless explicitly shared.",
      ],
      references: [
        {
          label: "Incident response and maintenance operations review",
          href: "https://doi.org/10.1145/3351095.3372866",
        },
        {
          label: "Escalation readiness in operations teams",
          href: "https://doi.org/10.1145/3290605.3300512",
        },
      ],
    },
  ],
};
