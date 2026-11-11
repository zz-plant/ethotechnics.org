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
  pageTitle: "Composite failure patterns — Ethotechnics",
  pageDescription:
    "Three composite scenarios, from an appeals backlog to unlogged overrides. None reports on a named institution. Each names the missing control and the fix.",
  permalink: "/incidents",
  eyebrow: "Composite scenarios",
  title: "Failure patterns, each drawn from many systems",
  description:
    "These are composites. None reports on a named institution or a dated event. Each names the control that was missing, the signal that would have shown it, and the fix. The records linked under each scenario are this site's templates and schemas for what it was missing, not its sources. For failures a court, an inquiry, or a regulator established, see the casebook.",
};

export const incidentLessons: IncidentLesson[] = [
  {
    slug: "appeals-backlog-trigger",
    title: "An appeals backlog kept people locked out",
    summary:
      "Appeals arrived faster than staff could answer them, and nothing escalated a case when its deadline passed.",
    published: "2026-02-14T00:00:00Z",
    updated: "2026-02-20T00:00:00Z",
    glossaryRefs: ["appeal-event", "repair-sla", "burden-hours"],
    incident: {
      headline:
        "A surge in appeals filled the queue. Suspended accounts stayed suspended while each appeal waited its turn.",
      impact:
        "Account holders were locked out for weeks and were told different things.",
      sector: "Financial services",
      timeframe: "Composite, not a dated event",
    },
    governanceFailures: [
      "Nothing escalated a case when its repair deadline passed.",
      "Staffing was not planned for a surge.",
      "People waiting in the queue saw no status.",
    ],
    signalsToWatch: [
      "Appeal queue length vs. staffed capacity.",
      "Percentage of cases breaching repair deadlines.",
      "Average response time per escalation tier.",
    ],
    remediationChecklist: [
      "Escalate a case when its deadline is breached.",
      "Show people in the queue its status and when to expect an answer.",
      "Put queue length and breached deadlines in front of whoever is on call.",
    ],
    sources: [
      { label: "Incident memo template", href: "/standards/incident-memo" },
      {
        label: "Repair deadline schema",
        href: "/standards/repair-sla.schema.json",
      },
    ],
  },
  {
    slug: "model-override-visibility",
    title: "Staff overrode the model and left no record",
    summary:
      "Staff reversed automated denials by hand. The decision record had no place for an override or its reason.",
    published: "2026-02-05T00:00:00Z",
    glossaryRefs: ["decision-record", "auditability"],
    incident: {
      headline:
        "Reviewers overturned denials they judged wrong. None of the overrides, or the reasons for them, was logged.",
      impact:
        "People with similar cases got different outcomes, and nobody could trace who decided.",
      sector: "Public benefits",
      timeframe: "Composite, not a dated event",
    },
    governanceFailures: [
      "The decision record did not capture human overrides.",
      "Reviewers had no shared format for the reason behind an override.",
      "Audits could not see how overridden cases ended.",
    ],
    signalsToWatch: [
      "Rate of manual overrides per decision category.",
      "Percentage of overrides with no reason recorded.",
      "Audit sample completeness for override cases.",
    ],
    remediationChecklist: [
      "Log every override in the decision record.",
      "Require a written reason before an override is approved.",
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
    title: "Appeals were won and the decisions stood",
    summary:
      "Appeals were marked resolved, but the remedies they granted never reached the teams responsible for delivering them.",
    published: "2026-01-22T00:00:00Z",
    glossaryRefs: ["appeal-event", "remedy"],
    incident: {
      headline:
        "An appeal closed when it was decided, not when its remedy was delivered. Nobody owned the step in between.",
      impact:
        "People won their appeals, and their decisions were never reversed.",
      sector: "Healthcare",
      timeframe: "Composite, not a dated event",
    },
    governanceFailures: [
      "Nothing confirmed to the appeals team that a remedy had been delivered.",
      "No one was named as the owner of a remedy.",
      "A case showed as resolved before its remedy was verified.",
    ],
    signalsToWatch: [
      "Gap between appeal approvals and remedies delivered.",
      "Number of appeals lacking an assigned remedy owner.",
      "Time from approval to confirmed remedy delivery.",
    ],
    remediationChecklist: [
      "Name the remedy's owner when the appeal is decided.",
      "Close an appeal only when delivery of its remedy is confirmed.",
      "Track remedies delivered against appeal outcomes.",
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
