import type {
  GlossaryLinked,
  PageWithPermalink,
  PublishedContent,
} from "./types";

export type IncidentLesson = GlossaryLinked &
  PublishedContent & {
    slug: string;
    title: string;
    summary: string;
    incident: {
      headline: string;
      impact: string;
      sector: string;
      timeframe: string;
    };
    governanceFailures: string[];
    signalsToWatch: string[];
    remediationChecklist: string[];
    sources: { label: string; href: string }[];
  };

export type IncidentLessonsIntro = PageWithPermalink & {
  eyebrow: string;
  title: string;
  description: string;
};

export const incidentLessonsIntro: IncidentLessonsIntro = {
  pageTitle: "Three composite failure patterns — Ethotechnics",
  pageDescription:
    "Three composite scenarios, from an appeals backlog to unlogged overrides. None reports on a named institution. Each names the missing control and the fix.",
  permalink: "/incidents",
  eyebrow: "Composite scenarios",
  title: "Three failure patterns, each drawn from many systems.",
  description:
    "These are composites. None reports on a named institution or a dated event. Each names the control that was missing, the signal that would have shown it, and the fix. For failures a court, an inquiry, or a regulator established, see the casebook.",
};

export const incidentLessons: IncidentLesson[] = [
  {
    slug: "appeals-backlog-trigger",
    title: "Appeals backlog triggers unnoticed harm loops",
    summary:
      "A surge in appeal volume stalled remediation timelines, leaving affected users in unresolved states for weeks.",
    published: "2026-02-14T00:00:00Z",
    updated: "2026-02-20T00:00:00Z",
    glossaryRefs: ["appeal-event", "repair-sla", "burden-hours"],
    incident: {
      headline: "Appeal triage delay compounded user burden.",
      impact: "Prolonged access suspension and inconsistent communications.",
      sector: "Financial services",
      timeframe: "Composite, not a dated event",
    },
    governanceFailures: [
      "No automated escalation when repair SLAs crossed risk thresholds.",
      "Insufficient staffing model for volume spikes.",
      "Missing user-visible status updates during queue backlog.",
    ],
    signalsToWatch: [
      "Appeal queue length vs. staffed capacity.",
      "Percentage of cases breaching repair SLA targets.",
      "Average response time per escalation tier.",
    ],
    remediationChecklist: [
      "Define escalation triggers tied to SLA breaches.",
      "Publish queue status and expected resolution windows.",
      "Instrument backlog health dashboards for on-call review.",
    ],
    sources: [
      { label: "Incident memo template", href: "/standards/incident-memo" },
      { label: "Repair SLA schema", href: "/standards/repair-sla.schema.json" },
    ],
  },
  {
    slug: "model-override-visibility",
    title: "Model overrides happened without audit trace",
    summary:
      "Human overrides removed automated denials, but the rationale was never logged for later audit review.",
    published: "2026-02-05T00:00:00Z",
    glossaryRefs: ["decision-record", "auditability"],
    incident: {
      headline: "Manual decisions skipped decision-log capture.",
      impact: "Inconsistent outcomes and incomplete accountability trails.",
      sector: "Public benefits",
      timeframe: "Composite, not a dated event",
    },
    governanceFailures: [
      "Decision record capture did not include human override flows.",
      "No shared reasoning schema for override justification.",
      "Audit reviews lacked visibility into resolution outcomes.",
    ],
    signalsToWatch: [
      "Rate of manual overrides per decision category.",
      "Percentage of overrides missing rationale metadata.",
      "Audit sample completeness for override cases.",
    ],
    remediationChecklist: [
      "Extend decision-log middleware to capture overrides.",
      "Require structured rationale fields before approval.",
      "Sample override outcomes in monthly audits.",
    ],
    sources: [
      {
        label: "Decision record schema",
        href: "/standards/decision-record.schema.json",
      },
      { label: "Audit playbook", href: "/diagnostics" },
    ],
  },
  {
    slug: "appeal-remedy-mismatch",
    title: "Appeal accepted without remedy follow-through",
    summary:
      "Appeals were marked resolved, but remediation actions failed to reach the teams responsible for execution.",
    published: "2026-01-22T00:00:00Z",
    glossaryRefs: ["appeal-event", "remedy"],
    incident: {
      headline: "Resolution closed before repair tasks were complete.",
      impact: "User outcomes never corrected despite approved appeals.",
      sector: "Healthcare",
      timeframe: "Composite, not a dated event",
    },
    governanceFailures: [
      "No confirmation loop between appeal resolution and delivery teams.",
      "Remedy ownership unclear across internal workflows.",
      "Status updates not tied to verified repair completion.",
    ],
    signalsToWatch: [
      "Gap between appeal approvals and repair completions.",
      "Number of appeals lacking assigned remediation owners.",
      "Time from approval to confirmed repair delivery.",
    ],
    remediationChecklist: [
      "Assign remedy ownership at appeal decision time.",
      "Require confirmation before closing appeal records.",
      "Track repair completions against appeal outcomes.",
    ],
    sources: [
      {
        label: "Appeal event schema",
        href: "/standards/appeal-event.schema.json",
      },
      { label: "Remedy essentials", href: "/explainers/remedy-essentials" },
    ],
  },
];
