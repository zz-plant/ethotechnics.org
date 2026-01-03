import type { PageWithPermalink, PublishedContent } from "./types";

export type DiagnosticTool = {
  slug: string;
  title: string;
  description: string;
  readiness: string[];
  outputs: string[];
  studioNote: string;
  ctaLabel: string;
  ctaHref: string;
  ctaAriaLabel?: string;
  exampleLabel: string;
  exampleHref: string;
};

export type DiagnosticsContent = PageWithPermalink & PublishedContent & {
  tools: DiagnosticTool[];
  offRampNote: string;
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
  published: "2024-09-01T00:00:00Z",
  offRampNote:
    "If a diagnostic surfaces high risk or ambiguity, we route you to a facilitated deep dive through ethotechnics.com/studio.",
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
        "Recommendations connect to the pattern language so product, policy, and ops teams can move together.",
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
          "You get a linkable readout, pattern references, and the off-ramp to ethotechnics.com/studio if you need facilitation.",
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
      readiness: [
        "Run when leaders need to see how burden accumulates across roles or release cycles.",
        "Pair with support and operations partners to weight inputs and confirm where friction is worst.",
      ],
      outputs: [
        "Burden index score with plain-language findings tied to your scenario.",
        "Ranked hotspots with mitigation paths and expected relief per action.",
        "Result page with a persistent off-ramp to ethotechnics.com/studio.",
      ],
      studioNote:
        "Result pages always include the off-ramp to ethotechnics.com/studio for risky or unclear scores.",
      ctaLabel: "Book a facilitated burden modeling session",
      ctaHref: "https://ethotechnics.com/studio",
      ctaAriaLabel:
        "Book a facilitated burden modeling session through ethotechnics.com/studio",
      exampleLabel: "See example burden model outputs",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#burden-modeler",
    },
    {
      slug: "llm-capacity-benchmark",
      title: "LLM Capacity Benchmark",
      description:
        "Lightweight evaluation to check if a model and its surrounding UI respect consent and context limits.",
      readiness: [
        "Run before piloting a new model-powered feature with real people.",
        "Pair with progressive consent prompts to keep expectations clear.",
      ],
      outputs: [
        "Readiness summary that highlights consent journey gaps.",
        "UI nits and mitigation guidance tied to pattern language filters.",
        "Result page reiterating the off-ramp link to ethotechnics.com/studio for complex findings.",
      ],
      studioNote:
        "Result pages always include the off-ramp to ethotechnics.com/studio before finalizing recommendations.",
      ctaLabel: "Run the LLM readiness check",
      ctaHref: "https://ethotechnics.com/studio",
      ctaAriaLabel:
        "Request an LLM readiness check through ethotechnics.com/studio",
      exampleLabel: "Review a benchmark output sample",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#llm-capacity-benchmark",
    },
    {
      slug: "maintenance-simulator",
      title: "Maintenance Simulator",
      description:
        "Tabletop simulation that plays through outages, maintenance windows, and handoffs to stress-test coverage.",
      readiness: [
        "Use during planning to negotiate coverage, escalation, and staffing constraints with partners.",
        "Stress-test appeal paths, safety valves, and service-level guarantees before launch.",
      ],
      outputs: [
        "Scenario runs with clear ownership, mitigation branches, and time-to-halt expectations.",
        "Communication templates mapped to risk levels, roles, and escalation routes.",
        "Result page summarizing coverage gaps with the off-ramp to ethotechnics.com/studio.",
      ],
      studioNote:
        "Result pages always include the off-ramp to ethotechnics.com/studio so teams know where to escalate.",
      ctaLabel: "Open the maintenance simulator",
      ctaHref: "/tools/maintenance-simulator",
      ctaAriaLabel: "Open the maintenance simulator",
      exampleLabel: "Preview a simulation output",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#maintenance-simulator",
    },
    {
      slug: "capacity-forecaster",
      title: "Technical Capacity Forecaster",
      description:
        "Charts compound decay against refusal windows to spot saturation risk across a 24-month horizon.",
      readiness: [
        "Use when delivery teams need to visualize stability trade-offs with remediation paths.",
        "Pair with portfolio reviews to align refusal policies with operational bandwidth.",
      ],
      outputs: [
        "Side-by-side baseline and remediated capacity projections.",
        "PDF export with saturation callouts for stakeholder sharing.",
        "Result page reiterating the off-ramp link to ethotechnics.com/studio for complex findings.",
      ],
      studioNote:
        "Result pages always include the off-ramp to ethotechnics.com/studio before finalizing recommendations.",
      ctaLabel: "Open the capacity forecaster",
      ctaHref: "/diagnostics/capacity-forecaster",
      ctaAriaLabel: "Open the Technical Capacity Forecaster tool",
      exampleLabel: "View capacity forecast examples",
      exampleHref:
        "https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#technical-capacity-forecaster",
    },
  ],
};
