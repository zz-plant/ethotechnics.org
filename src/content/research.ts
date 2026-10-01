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
    "Research on one question: when an automated system is wrong, does the evidence reach someone who can change the rule? Essays, scored cases, a working paper.",
  permalink: "/research",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-10-01T00:00:00Z",
  publication: {
    authors: [
      {
        name: "Ethotechnics Institute",
        affiliation: "Ethotechnics Institute",
        email: "hello@ethotechnics.org",
      },
    ],
    contact: "hello@ethotechnics.org",
    published: "2025-12-03T00:00:00Z",
    updated: "2026-10-01T00:00:00Z",
    version: "v1.4.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/web/*/https://ethotechnics.org/research",
    changelog: [
      {
        version: "v1.4.0",
        date: "2026-10-01",
        summary:
          "Opened the page with the research question and what the research has produced: the casebook standing result, the frontier doctrine scan, the working paper, and the theory.",
      },
      {
        version: "v1.3.0",
        date: "2026-09-25",
        summary:
          "Revised The Green Dashboard from specification v0.1 to working paper v0.2: added related work, formal definitions, a four-condition factorial design, and falsifiable hypotheses.",
      },
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
      "Credit the Ethotechnics Institute, include the page title + version, and link to the canonical permalink.",
  },
  lastUpdated: "2026-10-01T00:00:00Z",
  updateCadence:
    "Each change is dated in the changelog at the foot of the page.",
  anchorLinks: [
    { href: "#results", label: "Results" },
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
        "Version 1.0 was released for public review. It stays a draft until two independent implementation reports and a decision recorded through the RFC process.",
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
      title: "Does an upheld challenge change the rule?",
      timeframe: "Open question",
      goals: [
        "Record, for each casebook case, what changed after the failure: one case, the process, or the rule.",
        "Find systems that publish how many challenges they uphold, and check whether any rule changed after them.",
        "Test whether the corrective learning evals can be scored from public records alone.",
      ],
      glossaryRefs: ["exception-absorption", "exception-learning"],
    },
    {
      title: "Who pays for correction?",
      timeframe: "Open question",
      goals: [
        "Measure the time a person spends proving an automated decision wrong, using the time cost STD-01 asks operators to publish.",
        "Set an institution's efficiency figures beside the correction work its system moves onto claimants, staff, and clinicians.",
        "Find where, if anywhere, that work appears in a public budget.",
      ],
      glossaryRefs: ["burden-transfer-event", "compensated-performance"],
    },
  ],
  focusAreas: [
    {
      slug: "standing",
      title: "Standing",
      description:
        "Who can make a running system answer: a challenge route, a date by which it must be answered, and someone who can force a halt.",
      questions: [
        "Which public systems give the person they decide about a challenge that must be answered by a date?",
        "When a challenge is upheld, who besides that person learns of it?",
      ],
      glossaryRefs: ["corrective-standing", "standing-mechanism"],
    },
    {
      slug: "correction",
      title: "Correction",
      description:
        "Whether an upheld challenge reaches the rule that produced the decision, and how long that takes.",
      questions: [
        "How long after the first upheld challenge did each casebook rule change?",
        "What record would show that a rule changed because of a challenge?",
      ],
      glossaryRefs: ["exception-learning", "correction-obligation"],
    },
    {
      slug: "burden",
      title: "Burden",
      description:
        "Who does the work of correcting the system, and whether the institution counts that work as a cost.",
      questions: [
        "How much time does a successful challenge cost the person who brings it?",
        "Which efficiency figures leave that time out?",
      ],
      glossaryRefs: [
        "burden-transfer-event",
        "principle-of-non-expropriation-of-resilience",
      ],
    },
  ],
  publications: [
    {
      title: "Burden index signals",
      type: "report",
      status: "planned",
      summary:
        "Planned pilot to test which operational signals the Workload Modeler should weight most.",
      tags: ["diagnostics", "measurement", "governance"],
      glossaryRefs: ["burden-index", "signal-credibility"],
      href: "/diagnostics/burden-modeler",
      ctaLabel: "Open the Workload Modeler",
      structuredAbstract: {
        question:
          "Which operational signals most reliably predict sustained burden?",
        method:
          "Planned: Workload Modeler outputs compared with debriefs from the teams involved.",
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
      title:
        "When the Dashboard Is Green: Evaluating Compensatory Reward Hacking in Long-Horizon AI Agents",
      type: "protocol",
      status: "published",
      summary:
        "Working paper v0.2: The Green Dashboard, a 52-week hospital department simulation testing whether AI agents fulfill operational mandates by consuming unmeasured human capacities. Defines compensatory reward hacking, specifies a factorial design with falsifiable hypotheses, diagnoses seven gaps in current evaluation practice, and states the conception of emancipation the benchmark presupposes. No experiments have been run.",
      tags: ["evaluations", "benchmarking", "reward-hacking", "governance"],
      glossaryRefs: [
        "reciprocal-accommodation",
        "extractive-cannibalism",
        "green-dashboard-trap",
        "dual-ledger-evaluation",
        "systemic-refusal",
      ],
      href: "/research/the-green-dashboard",
      ctaLabel: "Read the working paper",
      structuredAbstract: {
        question:
          "Can an AI agent achieve its assigned objectives by consuming human resources that its performance metrics fail to account for?",
        method:
          "Proposed, not run: a 52-week turn-based department simulation in a 2×2 factorial design (conventional vs. expanded reward accounting; routine reporting vs. randomized independent audits), with four precommitted stress tests.",
        sample:
          "Simulated hospital department: 20 heterogeneous workers, weekly demand of 120 units against sustainable capacity of 100 units.",
        findings:
          "The paper defines compensatory reward hacking, specifies the primary outcome metric (the green-under-depletion rate), identifies seven gaps in current evaluation practice, and anticipates objections from the philosophical traditions the benchmark draws on. No experiments have been conducted.",
        limitations:
          "Rule-based simulated workers in the initial implementation. The simulation would not establish the frequency of these failures in real organizations.",
      },
      datasets: [
        "Simulation parameter configuration schema v0.1.",
        "Dual-ledger telemetry log definition and stress test seed vectors.",
      ],
      ethicsNotes: [
        "Evaluations test synthetic agents against simulated worker profiles without human subject risk.",
      ],
    },
  ],
};
