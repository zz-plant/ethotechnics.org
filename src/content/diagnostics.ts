import type {
  PageWithPermalink,
  PublicationMetadata,
  PublishedContent,
} from "./types";

export type DiagnosticMethodCards = {
  measures: string[];
  doesNotMeasure: string[];
  assumptions: string[];
};

export type DiagnosticMethodOverview = {
  inputs: string[];
  procedure: string[];
  outputs: string[];
};

export type DiagnosticInstrument = {
  prompts: string[];
  rubric: string[];
  scoringLogic: string[];
};

export type DiagnosticValidation = {
  pilotNotes: string;
  reliability: string;
  failureModes: string[];
};

export type DiagnosticReplicability = {
  runSteps: string[];
  exampleOutputs: string[];
};

export type DiagnosticTool = {
  slug: string;
  title: string;
  description: string;
  methodCards: DiagnosticMethodCards;
  methodOverview: DiagnosticMethodOverview;
  instrument: DiagnosticInstrument;
  validation: DiagnosticValidation;
  replicability: DiagnosticReplicability;
  bestFor: string;
  readiness: string[];
  outputs: string[];
  estimatedTime: string;
  prepChecklist: string[];
  ctaLabel: string;
  ctaHref: string;
  ctaAriaLabel?: string;
  exampleLabel: string;
  exampleHref: string;
  deliveryType: "self-serve" | "studio";
};

export type DiagnosticsOffRampCallout = {
  eyebrow: string;
  title: string;
  description: string;
  actions: {
    label: string;
    href: string;
    variant?: "primary" | "ghost";
    rel?: string;
    target?: string;
  }[];
};

export type DiagnosticsContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    tools: DiagnosticTool[];
    offRampNote: string;
    offRampCallout: DiagnosticsOffRampCallout;
    valueProps: { title: string; description: string }[];
    facilitation: {
      title: string;
      description: string;
      steps: { title: string; detail: string }[];
      note: string;
    };
  };

export const diagnosticsContent: DiagnosticsContent = {
  pageTitle: "Diagnostics — Ethotechnics",
  pageDescription:
    "Pick a diagnostic, arrive with a question, and leave with a decision-ready summary and a clear off-ramp.",
  permalink: "/diagnostics",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-01-09T00:00:00Z",
  publication: {
    authors: [
      {
        name: "Ethotechnics Institute Diagnostics Lab",
        affiliation: "Ethotechnics Institute",
        email: "diagnostics@ethotechnics.org",
      },
    ],
    contact: "diagnostics@ethotechnics.org",
    published: "2025-12-03T00:00:00Z",
    updated: "2026-01-09T00:00:00Z",
    version: "v1.1.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/save/https://ethotechnics.org/diagnostics",
    changelog: [
      {
        version: "v1.1.0",
        date: "2026-01-09",
        summary:
          "Published method cards, transparency notes, and replicability guidance for each diagnostic.",
      },
      {
        version: "v1.0.0",
        date: "2025-12-03",
        summary: "Initial diagnostics suite release.",
      },
    ],
    license: {
      label: "CC BY 4.0",
      href: "https://creativecommons.org/licenses/by/4.0/",
    },
    attribution:
      "Credit Ethotechnics Institute Diagnostics Lab, include tool name + version, and link to the canonical permalink.",
  },
  offRampNote:
    "If a diagnostic surfaces high risk or ambiguity, we route you to a facilitated deep dive through ethotechnics.com/studio.",
  offRampCallout: {
    eyebrow: "Studio off-ramp",
    title: "Escalate when diagnostics surface risk.",
    description:
      "Every diagnostic readout includes a Studio escalation path so you can move from insight to facilitation without rework.",
    actions: [
      {
        label: "Visit the Studio",
        href: "https://ethotechnics.com/studio",
        variant: "primary",
        rel: "noreferrer",
        target: "_blank",
      },
      {
        label: "See Institute vs. Studio",
        href: "/institute",
        variant: "ghost",
      },
    ],
  },
  valueProps: [
    {
      title: "Decide quickly",
      description:
        "Each diagnostic is scoped to a single question so you can share a concise readout with executives, regulators, or partners.",
    },
    {
      title: "Land on an off-ramp",
      description:
        "Every result page includes the escalation path to ethotechnics.com/studio when risk or ambiguity shows up.",
    },
    {
      title: "Link to shared language",
      description:
        "Recommendations connect to the mechanism language so product, policy, and ops teams can move together.",
    },
  ],
  facilitation: {
    title: "You bring the scenario, we guide the decision.",
    description:
      "Sessions are lightweight and focused. We keep the scope tight so you can move work forward without adding overhead.",
    steps: [
      {
        title: "Frame the question",
        detail:
          "We define what a good answer looks like and what needs to be decided after the diagnostic.",
      },
      {
        title: "Run the tool together",
        detail:
          "You walk through prompts, inputs, and trade-offs while we map gaps and risks.",
      },
      {
        title: "Leave with a next step",
        detail:
          "You get a linkable readout, mechanism references, and the off-ramp to ethotechnics.com/studio if you need facilitation.",
      },
    ],
    note: "Diagnostics are written for visitors: no prior relationship needed, and every tool is CC BY through the Institute.",
  },
  tools: [
    {
      slug: "burden-modeler",
      title: "Burden Modeler",
      description:
        "Quantifies task load, cognitive friction, and risk exposure so you can reroute toil before it burns people out.",
      methodCards: {
        measures: [
          "Task load volume across roles and handoffs.",
          "Cognitive friction introduced by tooling or policy complexity.",
          "Risk exposure across the workflow with weighted severity.",
        ],
        doesNotMeasure: [
          "Individual performance or productivity.",
          "Legal compliance posture or audit readiness.",
          "Long-term cultural or morale shifts beyond the scenario window.",
        ],
        assumptions: [
          "Inputs reflect cross-functional consensus, not a single point of view.",
          "Task volume estimates are directionally accurate for the period.",
          "Risk weights reflect the scenario’s actual severity bands.",
        ],
      },
      methodOverview: {
        inputs: [
          "Scenario name and primary workflow.",
          "Estimated task volume and handoff counts.",
          "Known friction points and escalation paths.",
        ],
        procedure: [
          "Weight task load, friction, and risk sliders with the scenario team.",
          "Review the computed burden index and hotspot ranking.",
          "Select mitigation paths and estimate relief impact.",
        ],
        outputs: [
          "Burden index score with plain-language findings.",
          "Ranked hotspot list with mitigation recommendations.",
          "Relief estimates tied to the selected mitigations.",
        ],
      },
      instrument: {
        prompts: [
          "Scenario name and workflow summary.",
          "Weekly task volume or queue size.",
          "Number of handoffs or escalation checkpoints.",
          "Friction rating (1–5) for key steps.",
          "Risk exposure rating (1–5) for each stage.",
        ],
        rubric: [
          "Task load, friction, and risk scored on 1–5 scales.",
          "Risk weights adjusted via criticality slider.",
        ],
        scoringLogic: [
          "Burden index = weighted average of load, friction, and risk.",
          "Hotspots rank by combined load and risk scores.",
          "Relief estimate computed from mitigations selected.",
        ],
      },
      validation: {
        pilotNotes:
          "Piloted across support, operations, and research scenarios to calibrate weights and language.",
        reliability:
          "Inter-rater alignment improves after a shared calibration pass; variance shrinks on second runs.",
        failureModes: [
          "Over-weighting a single friction point can skew results.",
          "Underspecified task volume leads to low-confidence outputs.",
          "High uncertainty if scenario owners are not present for scoring.",
        ],
      },
      replicability: {
        runSteps: [
          "Gather a cross-functional scoring group.",
          "Use the prompt list and rubric to score the scenario.",
          "Record weighting decisions and rationale.",
          "Compare output against historical incidents for calibration.",
        ],
        exampleOutputs: [
          "Sample burden index readout with hotspots and relief estimates.",
          "Anonymized scenario summary and mitigation plan.",
        ],
      },
      bestFor:
        "Best for leaders who need a fast workload snapshot before teams hit a burnout threshold.",
      readiness: [
        "Run when leaders need to see how burden accumulates across roles or release cycles.",
        "Pair with support and operations partners to weight inputs and confirm where friction is worst.",
      ],
      outputs: [
        "Burden index score with plain-language findings tied to your scenario.",
        "Ranked hotspots with mitigation paths and expected relief per action.",
      ],
      estimatedTime: "10–15 minutes",
      prepChecklist: [
        "Scenario name and primary workflow.",
        "Rough task volume or handoff counts.",
        "Known friction points or escalation paths.",
      ],
      ctaLabel: "Open the burden modeler",
      ctaHref: "/diagnostics/burden-modeler",
      ctaAriaLabel: "Open the burden modeler diagnostic tool",
      exampleLabel: "See burden model outputs",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#burden-modeler",
      deliveryType: "self-serve",
    },
    {
      slug: "llm-capacity-benchmark",
      title: "LLM Capacity Benchmark",
      description:
        "Lightweight evaluation to check if a model and its surrounding UI respect consent and context limits.",
      methodCards: {
        measures: [
          "Consent and disclosure coverage across the user journey.",
          "Context boundary alignment between model behavior and UI framing.",
          "User control availability and visibility in the flow.",
        ],
        doesNotMeasure: [
          "Model accuracy, toxicity, or bias metrics.",
          "Infrastructure performance or latency.",
          "Legal review of terms or policy compliance.",
        ],
        assumptions: [
          "Prompts and scenarios are representative of real use.",
          "Consent copy and disclosure states are production-ready.",
          "Reviewers have access to product and policy context.",
        ],
      },
      methodOverview: {
        inputs: [
          "Representative prompt set and usage flows.",
          "Current consent and disclosure copy.",
          "Stakeholder context for model limitations and risks.",
        ],
        procedure: [
          "Run prompts through the interface and capture disclosures.",
          "Score consent journey checkpoints against rubric.",
          "Document gaps and map recommendations to mechanism language.",
        ],
        outputs: [
          "Readiness summary highlighting consent gaps.",
          "UI and governance mitigation guidance.",
          "Escalation note with studio facilitation path.",
        ],
      },
      instrument: {
        prompts: [
          "User prompt set with context variants.",
          "Disclosure checkpoints and UI states list.",
          "Consent copy and opt-out flows.",
        ],
        rubric: [
          "Consent clarity score (1–5) per checkpoint.",
          "Context alignment score (1–5) for model outputs.",
          "Control visibility score (1–5) for exit paths.",
        ],
        scoringLogic: [
          "Aggregate checkpoint scores into readiness tiers.",
          "Flag any score ≤2 as a mandatory mitigation.",
          "Summarize recommendations by mechanism category.",
        ],
      },
      validation: {
        pilotNotes:
          "Piloted with early-stage AI pilots and consent-heavy workflows to refine rubric language.",
        reliability:
          "Paired reviewers reconcile scores in a short calibration session; discrepancies drop after alignment.",
        failureModes: [
          "Scoring drifts if reviewers lack model context.",
          "Missing edge cases can inflate readiness scores.",
          "UI copy changes after scoring can invalidate results.",
        ],
      },
      replicability: {
        runSteps: [
          "Compile prompt set and UI flow map.",
          "Run the rubric with two reviewers.",
          "Document scores and differences in a shared sheet.",
          "Publish the summary with linked mechanism recommendations.",
        ],
        exampleOutputs: [
          "Consent checkpoint scorecard with mitigation notes.",
          "Anonymized readiness summary deck excerpt.",
        ],
      },
      bestFor:
        "Best for teams validating consent, disclosure, and context limits before an AI pilot.",
      readiness: [
        "Run before piloting a new model-powered feature with real people.",
        "Pair with progressive consent prompts to keep expectations clear.",
      ],
      outputs: [
        "Readiness summary that highlights consent journey gaps.",
        "UI nits and mitigation guidance tied to mechanism language filters.",
      ],
      estimatedTime: "30–45 minutes",
      prepChecklist: [
        "Sample prompts or flows to benchmark.",
        "Current consent or disclosure copy.",
        "Stakeholder who owns model and UI decisions.",
      ],
      ctaLabel: "Request via Studio",
      ctaHref: "https://ethotechnics.com/studio",
      ctaAriaLabel:
        "Request an LLM readiness check through ethotechnics.com/studio",
      exampleLabel: "Review a benchmark output sample",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#llm-capacity-benchmark",
      deliveryType: "studio",
    },
    {
      slug: "maintenance-simulator",
      title: "Maintenance Simulator",
      description:
        "Tabletop simulation that plays through outages, maintenance windows, and handoffs to stress-test coverage.",
      methodCards: {
        measures: [
          "Ownership clarity across outage and maintenance branches.",
          "Time-to-halt readiness for escalations.",
          "Communication cadence readiness by risk level.",
        ],
        doesNotMeasure: [
          "Actual system uptime or performance metrics.",
          "Incident response SLA compliance in production.",
          "Staffing coverage outside the simulated scenario.",
        ],
        assumptions: [
          "Scenario reflects likely outage or maintenance conditions.",
          "Participants represent core escalation roles.",
          "Communication templates align with current policy.",
        ],
      },
      methodOverview: {
        inputs: [
          "Scenario description and stress level.",
          "Escalation owners and comms partners.",
          "Known dependencies and rollback paths.",
        ],
        procedure: [
          "Run tabletop branches for outage or maintenance.",
          "Log ownership, escalation, and timing decisions.",
          "Capture gaps and draft mitigation actions.",
        ],
        outputs: [
          "Scenario walkthrough with ownership gaps.",
          "Communication templates aligned to risk levels.",
          "Coverage and escalation summary for follow-up.",
        ],
      },
      instrument: {
        prompts: [
          "Scenario selection and risk level.",
          "Escalation owner confirmation.",
          "Rollback and communication template prompts.",
        ],
        rubric: [
          "Ownership clarity score (1–5).",
          "Escalation readiness score (1–5).",
          "Communication readiness score (1–5).",
        ],
        scoringLogic: [
          "Average readiness score across the three rubric areas.",
          "Flag any score ≤2 as a critical mitigation item.",
          "Summarize follow-ups by escalation owner.",
        ],
      },
      validation: {
        pilotNotes:
          "Piloted with operations and support partners to ensure coverage gaps surfaced in tabletop runs.",
        reliability:
          "Facilitator notes are reconciled post-run; agreement improves with standardized templates.",
        failureModes: [
          "Skipping escalation owners leads to incomplete coverage maps.",
          "Outdated communication templates skew readiness scores.",
          "Unrealistic scenarios understate actual risk.",
        ],
      },
      replicability: {
        runSteps: [
          "Select a scenario and risk level.",
          "Confirm escalation owners and comms partners.",
          "Run the tabletop and capture decisions in the log.",
          "Export the summary and share with stakeholders.",
        ],
        exampleOutputs: [
          "Maintenance run log with ownership notes.",
          "Communication template pack for a high-risk window.",
        ],
      },
      bestFor:
        "Best for operations leaders rehearsing outage response and escalation ownership.",
      readiness: [
        "Use during planning to negotiate coverage, escalation, and staffing constraints with partners.",
        "Stress-test appeal paths, safety valves, and service-level guarantees before launch.",
      ],
      outputs: [
        "Scenario runs with clear ownership, mitigation branches, and time-to-halt expectations.",
        "Communication templates mapped to risk levels, roles, and escalation routes.",
      ],
      estimatedTime: "20–30 minutes",
      prepChecklist: [
        "Upcoming maintenance or outage scenario.",
        "Named escalation owner and comms partner.",
        "Known dependency or rollback risks.",
      ],
      ctaLabel: "Open the maintenance simulator",
      ctaHref: "/diagnostics/maintenance-simulator",
      ctaAriaLabel: "Open the maintenance simulator",
      exampleLabel: "Preview a simulation output",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#maintenance-simulator",
      deliveryType: "self-serve",
    },
    {
      slug: "capacity-forecaster",
      title: "Technical Capacity Forecaster",
      description:
        "Charts compound decay against refusal windows to spot saturation risk across a 24-month horizon.",
      methodCards: {
        measures: [
          "Projected capacity decay over a 24-month horizon.",
          "Impact of remediation timing on saturation risk.",
          "Effect of refusal windows on delivery throughput.",
        ],
        doesNotMeasure: [
          "Real-time operational performance or incident rates.",
          "Budget constraints outside the modeled inputs.",
          "External market or policy changes affecting demand.",
        ],
        assumptions: [
          "Baseline capacity is stable absent remediation.",
          "Refusal windows accurately represent pause periods.",
          "Remediation effects scale linearly over time.",
        ],
      },
      methodOverview: {
        inputs: [
          "Baseline capacity and delivery targets.",
          "Remediation timing and intensity.",
          "Refusal windows and recovery assumptions.",
        ],
        procedure: [
          "Model baseline and remediated trajectories.",
          "Compare saturation points across scenarios.",
          "Export PDF summary with callouts.",
        ],
        outputs: [
          "Baseline vs. remediated capacity curves.",
          "Saturation risk callouts for decision points.",
          "Stakeholder-ready PDF snapshot.",
        ],
      },
      instrument: {
        prompts: [
          "Baseline capacity and decay rate.",
          "Remediation schedule and effect size.",
          "Refusal window timing and duration.",
        ],
        rubric: [
          "Capacity scales normalized to 0–100.",
          "Remediation impact scored as low/medium/high.",
        ],
        scoringLogic: [
          "Projected capacity = baseline - decay + remediation offsets.",
          "Saturation flagged when capacity drops below threshold.",
          "PDF summary generated from projection tables.",
        ],
      },
      validation: {
        pilotNotes:
          "Benchmarked against historical delivery timelines to calibrate decay and remediation curves.",
        reliability:
          "Scenario comparisons align when baseline data is consistent; variability rises with uncertain inputs.",
        failureModes: [
          "Overly optimistic remediation inputs understate saturation.",
          "Incomplete refusal windows distort capacity troughs.",
          "Baseline data drift makes longitudinal comparisons unreliable.",
        ],
      },
      replicability: {
        runSteps: [
          "Collect baseline capacity and delivery targets.",
          "Input remediation timing and refusal windows.",
          "Run simulations for baseline and mitigation cases.",
          "Export PDF summary and archive inputs.",
        ],
        exampleOutputs: [
          "Capacity forecast PDF with saturation callouts.",
          "Scenario comparison table used in stakeholder review.",
        ],
      },
      bestFor:
        "Best for delivery leaders aligning long-term stability plans with capacity constraints.",
      readiness: [
        "Use when delivery teams need to visualize stability trade-offs with remediation paths.",
        "Pair with portfolio reviews to align refusal policies with operational bandwidth.",
      ],
      outputs: [
        "Side-by-side baseline and remediated capacity projections.",
        "PDF export with saturation callouts for stakeholder sharing.",
      ],
      estimatedTime: "15–20 minutes",
      prepChecklist: [
        "Current capacity baseline or recent burn rates.",
        "Known remediation options or refusal windows.",
        "Stakeholder who needs the output PDF.",
      ],
      ctaLabel: "Open the capacity forecaster",
      ctaHref: "/diagnostics/capacity-forecaster",
      ctaAriaLabel: "Open the Technical Capacity Forecaster tool",
      exampleLabel: "View capacity forecast examples",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#technical-capacity-forecaster",
      deliveryType: "self-serve",
    },
  ],
};
