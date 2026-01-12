import type { AnchorLink, PageWithPermalink, PanelCopy } from "./types";

export type ValidatorEntry = {
  id: string;
  title: string;
  description: string;
  slug: string;
  standardRef: string;
  inputs: ValidatorInputField[];
  thresholds: ValidatorThreshold[];
  clauseRefs: string[];
  mechanismRefs: string[];
  outputSchema: ValidatorOutputSchema;
};

export type ValidatorMethod = {
  title: string;
  description: string;
  steps: string[];
};

export type ValidatorInputField = {
  name: string;
  label: string;
  type: "number" | "select";
  required: boolean;
  min?: number;
  max?: number;
  options?: string[];
};

export type ValidatorThreshold = {
  level: "green" | "yellow" | "red";
  condition: string;
  summary: string;
};

export type ValidatorOutputField = {
  name: string;
  type: string;
  description: string;
};

export type ValidatorOutputSchema = {
  fields: ValidatorOutputField[];
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
      inputs: [
        {
          name: "duration",
          label: "Estimated time to completion (minutes)",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "steps",
          label: "Number of required steps",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "exit",
          label: "Exit available on every screen",
          type: "select",
          required: true,
          options: ["yes", "no"],
        },
      ],
      thresholds: [
        {
          level: "red",
          condition: "duration > 25, steps > 7, or exit === no",
          summary: "High risk: constructive denial detected.",
        },
        {
          level: "yellow",
          condition: "duration > 15 or steps > 5",
          summary: "Medium risk: burden nearing the upper bound.",
        },
        {
          level: "green",
          condition: "duration <= 15 and steps <= 5",
          summary: "Low risk: consent burden within bounds.",
        },
      ],
      clauseRefs: ["STD-01.3.1", "STD-01.3.2", "STD-01.7.1"],
      mechanismRefs: ["MEC-04"],
      outputSchema: {
        fields: [
          {
            name: "result_id",
            type: "string",
            description: "Unique identifier for the diagnostic result.",
          },
          {
            name: "generated_at",
            type: "string",
            description: "ISO-8601 timestamp when the report was created.",
          },
          {
            name: "validator_id",
            type: "string",
            description: "Validator identifier (e.g., VAL-01).",
          },
          {
            name: "standard_id",
            type: "string",
            description: "Standard identifier associated with the validator.",
          },
          {
            name: "inputs",
            type: "object",
            description: "Input payload evaluated by the validator.",
          },
          {
            name: "status",
            type: "string",
            description: "Risk level: green, yellow, or red.",
          },
          {
            name: "risk_statement",
            type: "string",
            description: "Human-readable summary of the risk posture.",
          },
          {
            name: "violated_clauses",
            type: "string[]",
            description: "Clause IDs implicated by the risk result.",
          },
          {
            name: "recommended_mechanisms",
            type: "string[]",
            description: "Mechanism IDs recommended for remediation.",
          },
          {
            name: "next_actions",
            type: "string[]",
            description: "Operator actions to improve compliance.",
          },
        ],
      },
    },
    {
      id: "VAL-02",
      title: "Risk Radar",
      description:
        "Surface cumulative exposure across high-friction touchpoints.",
      slug: "risk-radar",
      standardRef: "STD-01",
      inputs: [
        {
          name: "touchpoints",
          label: "Number of high-friction touchpoints",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "wait",
          label: "Average wait time (minutes)",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "appeal",
          label: "Appeal path available for every touchpoint",
          type: "select",
          required: true,
          options: ["yes", "no"],
        },
      ],
      thresholds: [
        {
          level: "red",
          condition: "touchpoints >= 5, wait >= 8, or appeal === no",
          summary: "High risk: constructive denial detected.",
        },
        {
          level: "yellow",
          condition: "touchpoints >= 3 or wait >= 5",
          summary: "Medium risk: friction clusters emerging.",
        },
        {
          level: "green",
          condition: "touchpoints < 3 and wait < 5",
          summary: "Low risk: exposure within bounds.",
        },
      ],
      clauseRefs: ["STD-01.5.1", "STD-01.5.3", "STD-01.6.1"],
      mechanismRefs: ["MEC-06"],
      outputSchema: {
        fields: [
          {
            name: "result_id",
            type: "string",
            description: "Unique identifier for the diagnostic result.",
          },
          {
            name: "generated_at",
            type: "string",
            description: "ISO-8601 timestamp when the report was created.",
          },
          {
            name: "validator_id",
            type: "string",
            description: "Validator identifier (e.g., VAL-02).",
          },
          {
            name: "standard_id",
            type: "string",
            description: "Standard identifier associated with the validator.",
          },
          {
            name: "inputs",
            type: "object",
            description: "Input payload evaluated by the validator.",
          },
          {
            name: "status",
            type: "string",
            description: "Risk level: green, yellow, or red.",
          },
          {
            name: "risk_statement",
            type: "string",
            description: "Human-readable summary of the risk posture.",
          },
          {
            name: "violated_clauses",
            type: "string[]",
            description: "Clause IDs implicated by the risk result.",
          },
          {
            name: "recommended_mechanisms",
            type: "string[]",
            description: "Mechanism IDs recommended for remediation.",
          },
          {
            name: "next_actions",
            type: "string[]",
            description: "Operator actions to improve compliance.",
          },
        ],
      },
    },
    {
      id: "VAL-03",
      title: "Latency Audit",
      description:
        "Validate bounded duration requirements against system latency.",
      slug: "latency-audit",
      standardRef: "STD-01",
      inputs: [
        {
          name: "timeout",
          label: "Declared timeout (seconds)",
          type: "number",
          required: true,
          min: 10,
        },
        {
          name: "latency",
          label: "Observed max latency (seconds)",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "escalation",
          label: "Human escalation path in place",
          type: "select",
          required: true,
          options: ["yes", "no"],
        },
      ],
      thresholds: [
        {
          level: "red",
          condition: "latency > timeout or escalation === no",
          summary: "High risk: bounded duration violated.",
        },
        {
          level: "yellow",
          condition: "latency > timeout * 0.8",
          summary: "Medium risk: latency near timeout threshold.",
        },
        {
          level: "green",
          condition: "latency <= timeout * 0.8",
          summary: "Low risk: bounded duration honored.",
        },
      ],
      clauseRefs: ["STD-01.3.1", "STD-01.3.2", "STD-01.3.3"],
      mechanismRefs: ["MEC-04"],
      outputSchema: {
        fields: [
          {
            name: "result_id",
            type: "string",
            description: "Unique identifier for the diagnostic result.",
          },
          {
            name: "generated_at",
            type: "string",
            description: "ISO-8601 timestamp when the report was created.",
          },
          {
            name: "validator_id",
            type: "string",
            description: "Validator identifier (e.g., VAL-03).",
          },
          {
            name: "standard_id",
            type: "string",
            description: "Standard identifier associated with the validator.",
          },
          {
            name: "inputs",
            type: "object",
            description: "Input payload evaluated by the validator.",
          },
          {
            name: "status",
            type: "string",
            description: "Risk level: green, yellow, or red.",
          },
          {
            name: "risk_statement",
            type: "string",
            description: "Human-readable summary of the risk posture.",
          },
          {
            name: "violated_clauses",
            type: "string[]",
            description: "Clause IDs implicated by the risk result.",
          },
          {
            name: "recommended_mechanisms",
            type: "string[]",
            description: "Mechanism IDs recommended for remediation.",
          },
          {
            name: "next_actions",
            type: "string[]",
            description: "Operator actions to improve compliance.",
          },
        ],
      },
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
