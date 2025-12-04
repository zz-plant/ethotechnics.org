import type { PageWithPermalink } from './types';

export type DiagnosticTool = {
  slug: string;
  title: string;
  description: string;
  readiness: string[];
  outputs: string[];
  studioNote: string;
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
    'Studio off-ramp: when a result flags high risk or ambiguity, contact the Studio for a facilitated deep dive.',
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
        'Result page with off-ramp note and links to Studio for escalation.',
      ],
      studioNote: 'Result pages always include the Studio off-ramp for risky or unclear scores.',
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
        'Result page reiterating the Studio off-ramp for complex findings.',
      ],
      studioNote: 'Result pages always include the Studio off-ramp before finalizing recommendations.',
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
        'Result page footer reminding teams about the Studio off-ramp option.',
      ],
      studioNote: 'Result pages always include the Studio off-ramp so teams know where to escalate.',
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
        'Result page reiterating the Studio off-ramp for complex findings.',
      ],
      studioNote: 'Result pages always include the Studio off-ramp before finalizing recommendations.',
    },
  ],
};
