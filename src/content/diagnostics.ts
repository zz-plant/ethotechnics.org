import type { PageWithPermalink } from './types';

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

export type DiagnosticsContent = PageWithPermalink & {
  tools: DiagnosticTool[];
  offRampNote: string;
};

export const diagnosticsContent: DiagnosticsContent = {
  pageTitle: 'Diagnostics — Ethotechnics',
  pageDescription: 'Tools for auditing systems, measuring risk, and tracking progress on responsible technology goals.',
  permalink: '/diagnostics',
  offRampNote:
    'Off-ramp to ethotechnics.com/studio: when a result flags high risk or ambiguity, escalate for a facilitated deep dive.',
  tools: [
    {
      slug: 'burden-modeler',
      title: 'Burden Modeler',
      description:
        'Quantifies task load, cognitive friction, and risk exposure so teams can prioritize relief.',
      readiness: [
        'Use after initial research to baseline the burden index before shipping.',
        'Invite support and operations partners to validate inputs and weightings.',
      ],
      outputs: [
        'A burden index score with a short explanation for stakeholders.',
        'Flagged hotspots with pattern recommendations to reduce friction.',
        'Result page with off-ramp link to ethotechnics.com/studio for escalation.',
      ],
      studioNote: 'Result pages always include the off-ramp to ethotechnics.com/studio for risky or unclear scores.',
      ctaLabel: 'Book a facilitated burden modeling session',
      ctaHref: 'https://ethotechnics.com/studio',
      ctaAriaLabel: 'Book a facilitated burden modeling session through ethotechnics.com/studio',
      exampleLabel: 'See example burden model outputs',
      exampleHref: 'https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#burden-modeler',
    },
    {
      slug: 'llm-capacity-benchmark',
      title: 'LLM Capacity Benchmark',
      description:
        'Lightweight evaluation to see if a model and its surrounding UI respect consent and context limits.',
      readiness: [
        'Run before piloting a new model-powered feature with real people.',
        'Pair with progressive consent prompts to keep expectations clear.',
      ],
      outputs: [
        'Readiness summary that highlights consent journey gaps.',
        'UI nits and mitigation guidance tied to pattern language filters.',
        'Result page reiterating the off-ramp link to ethotechnics.com/studio for complex findings.',
      ],
      studioNote: 'Result pages always include the off-ramp to ethotechnics.com/studio before finalizing recommendations.',
      ctaLabel: 'Run the LLM readiness check',
      ctaHref: 'https://ethotechnics.com/studio',
      ctaAriaLabel: 'Request an LLM readiness check through ethotechnics.com/studio',
      exampleLabel: 'Review a benchmark output sample',
      exampleHref: 'https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#llm-capacity-benchmark',
    },
    {
      slug: 'maintenance-simulator',
      title: 'Maintenance Simulator',
      description: 'Scenario planning tool for stewardship windows and service-level impacts.',
      readiness: [
        'Use during planning to negotiate maintenance coverage with partners.',
        'Stress-test appeal paths and safety valves for outages or escalations.',
      ],
      outputs: [
        'Simulated runbooks with mitigation branches and ownership.',
        'Communication templates mapped to risk levels and roles.',
        'Result page footer reminding teams about the off-ramp to ethotechnics.com/studio.',
      ],
      studioNote: 'Result pages always include the off-ramp to ethotechnics.com/studio so teams know where to escalate.',
      ctaLabel: 'Schedule a maintenance simulation',
      ctaHref: 'https://ethotechnics.com/studio',
      ctaAriaLabel: 'Schedule a maintenance simulation through ethotechnics.com/studio',
      exampleLabel: 'Preview a simulation output',
      exampleHref: 'https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#maintenance-simulator',
    },
    {
      slug: 'capacity-forecaster',
      title: 'Technical Capacity Forecaster',
      description:
        'Charts compound decay against refusal windows to spot saturation risk across a 24-month horizon.',
      readiness: [
        'Use when delivery teams need to visualize stability trade-offs with remediation paths.',
        'Pair with portfolio reviews to align refusal policies with operational bandwidth.',
      ],
      outputs: [
        'Side-by-side baseline and remediated capacity projections.',
        'PDF export with saturation callouts for stakeholder sharing.',
        'Result page reiterating the off-ramp link to ethotechnics.com/studio for complex findings.',
      ],
      studioNote: 'Result pages always include the off-ramp to ethotechnics.com/studio before finalizing recommendations.',
      ctaLabel: 'Open the capacity forecaster',
      ctaHref: '/diagnostics/capacity-forecaster',
      ctaAriaLabel: 'Open the Technical Capacity Forecaster tool',
      exampleLabel: 'View capacity forecast examples',
      exampleHref:
        'https://github.com/ethotechnics/et3/blob/main/docs/diagnostics-outputs.md#technical-capacity-forecaster',
    },
  ],
};
