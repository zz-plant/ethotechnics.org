import type { AnchorLink, PageWithPermalink, PanelCopy } from "./types";

export type ValidatorEntry = {
  id: string;
  title: string;
  description: string;
  slug: string;
  standardRef: string;
};

export type ValidatorMethod = {
  title: string;
  description: string;
  steps: string[];
};

export type ValidatorsContent = PageWithPermalink & {
  anchorLinks: AnchorLink[];
  panelCopy: PanelCopy;
  validators: ValidatorEntry[];
  method: ValidatorMethod;
};

export const validatorsContent: ValidatorsContent = {
  pageTitle: "Validators — Ethotechnics Institute",
  pageDescription:
    "Interactive validators that score systems against Ethotechnics standards.",
  permalink: "/validators",
  anchorLinks: [
    { href: "#tools", label: "Validator tools" },
    { href: "#method", label: "Method" },
  ],
  panelCopy: {
    eyebrow: "Outputs",
    title: "Report-card ready",
    description:
      "Every validator produces a score, a risk statement, and a mechanism to remediate gaps.",
  },
  validators: [
    {
      id: "VAL-01",
      title: "Burden Modeler",
      description:
        "Score time tax and constructive denial risk across user journeys.",
      slug: "burden-modeler",
      standardRef: "STD-01",
    },
    {
      id: "VAL-02",
      title: "Risk Radar",
      description:
        "Surface cumulative exposure across high-friction touchpoints.",
      slug: "risk-radar",
      standardRef: "STD-01",
    },
    {
      id: "VAL-03",
      title: "Latency Audit",
      description:
        "Validate bounded duration requirements against system latency.",
      slug: "latency-audit",
      standardRef: "STD-01",
    },
  ],
  method: {
    title: "How validators score systems",
    description:
      "Validators translate STD clauses into input fields, then surface a report card with an actionable mechanism for remediation.",
    steps: [
      "Collect minimal inputs from operators or QA teams.",
      "Evaluate against published thresholds and temporal rights.",
      "Generate a report card with a visible Red / Yellow / Green status.",
    ],
  },
};
