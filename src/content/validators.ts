import type { AnchorLink, PageWithPermalink } from "./types";

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
  validators: ValidatorEntry[];
  method: ValidatorMethod;
};

export const validatorsContent: ValidatorsContent = {
  pageTitle: "Validators — Ethotechnics Institute",
  pageDescription:
    "Three forms that score a user journey against STD-01, the temporal rights standard, and return a red, yellow, or green status, the clauses at risk, and a fix.",
  permalink: "/validators",
  anchorLinks: [
    { href: "#focus", label: "Browse by focus" },
    { href: "#tools", label: "Validator tools" },
    { href: "#method", label: "Method" },
  ],
  validators: [
    {
      id: "VAL-01",
      title: "Burden Modeler",
      description:
        "Scores how much time a user journey takes from people, and whether it is heavy enough to keep them from the service, from its duration, its step count, and whether every screen has an exit.",
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
          summary:
            "Over 25 minutes, more than 7 steps, or a screen with no exit. A journey this heavy can keep people from the service. Cut steps, or add an exit to every screen.",
        },
        {
          level: "yellow",
          condition: "duration > 15 or steps > 5",
          summary:
            "Over 15 minutes or more than 5 steps. Red starts above 25 minutes or 7 steps.",
        },
        {
          level: "green",
          condition: "duration <= 15, steps <= 5, and exit === yes",
          summary:
            "15 minutes or less, 5 steps or fewer, and an exit on every screen.",
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
            description: "ISO 8601 timestamp when the report was created.",
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
        "Scores the friction a journey adds up to, from the number of hard steps, the average wait, and whether each step can be appealed.",
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
          summary:
            "Five or more high-friction touchpoints, an average wait of 8 minutes or more, or a touchpoint with no appeal path. Friction at this level can keep people from the service.",
        },
        {
          level: "yellow",
          condition: "touchpoints >= 3 or wait >= 5",
          summary:
            "Three or more high-friction touchpoints, or an average wait of 5 minutes or more. Red starts at five touchpoints or an 8-minute wait.",
        },
        {
          level: "green",
          condition: "touchpoints < 3, wait < 5, and appeal === yes",
          summary:
            "Fewer than three high-friction touchpoints, an average wait under 5 minutes, and an appeal path at every touchpoint.",
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
            description: "ISO 8601 timestamp when the report was created.",
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
        "Checks observed latency against the declared timeout and whether a human escalation path exists.",
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
          summary:
            "Latency runs past the declared timeout, or there is no human escalation path. Enforce the timeout, and send requests that reach it to a person.",
        },
        {
          level: "yellow",
          condition: "latency > timeout * 0.8",
          summary: "Latency is above 80% of the declared timeout.",
        },
        {
          level: "green",
          condition: "latency <= timeout * 0.8 and escalation === yes",
          summary:
            "Latency is within 80% of the declared timeout, and a human escalation path exists.",
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
            description: "ISO 8601 timestamp when the report was created.",
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
      "Each validator turns STD-01 clauses into input fields. It returns a report card that names a mechanism to fix what it finds.",
    steps: [
      "Collect three inputs from the system's operators or QA team.",
      "Compare the inputs with the published thresholds.",
      "Generate a report card with a red, yellow, or green status.",
    ],
  },
};
