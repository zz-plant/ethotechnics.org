export type ActionClassRow = {
  actionClass: string;
  examples: string;
  reversibility: string;
  controls: string;
};

export type SignalIntegrityRow = {
  signal: string;
  gaming: string;
  detection: string;
  tiers: string;
};

export type PracticeMechanism = {
  title: string;
  href: string;
};

export type PracticeSection = {
  id: string;
  eyebrow: string;
  title: string;
  summary: string;
  requirements: string[];
  signals?: string[];
  mechanisms: PracticeMechanism[];
  gaps: string[];
};

export const anchorLinks = [
  { href: "#who-this-is-for", label: "Who this is for" },
  { href: "#overview", label: "Practice snapshot" },
  { href: "#what-this-is", label: "What this is" },
  { href: "#core-premise", label: "Core premise" },
  { href: "#knowing-differently", label: "Infrastructure for knowing" },
  { href: "#epistemic-obstacles", label: "Epistemic obstacles" },
  { href: "#receipt-schema", label: "Agent receipt schema" },
  { href: "#action-taxonomy", label: "Action-class taxonomy" },
  { href: "#contestability-surface", label: "Contestability surface" },
  { href: "#exception-policy", label: "Exception policy" },
  { href: "#requirements", label: "1. Requirements" },
  { href: "#failure-design", label: "2. Failure-first design" },
  { href: "#accountability", label: "3. Accountability" },
  { href: "#contestability", label: "4. Contestability" },
  { href: "#risk-backlog", label: "5. Risk backlog" },
  { href: "#pressure-test", label: "6. Pressure-test claims" },
  { href: "#signal-integrity", label: "Signal integrity" },
  { href: "#control-checklist", label: "Control checklist" },
  { href: "#safety-object-model", label: "Agent safety object model" },
  { href: "#boundaries", label: "Practice boundaries" },
  { href: "#fast-path", label: "Fast path" },
  { href: "#referenced-by", label: "Referenced by" },
];

export const summaryTakeaways = [
  "Align agent capabilities with explicit action classes and receipts.",
  "Move ethics conversations from intent claims to enforceable controls, clocks, and human recourse.",
  "Use failure-first controls like kill switches, hard clocks, and rollback paths.",
  "Anchor remediation with contestability paths and evidence packs.",
];

export const summaryRelatedLinks = [
  { label: "Mechanisms", href: "/mechanisms" },
  { label: "Diagnostics", href: "/diagnostics" },
  { label: "Evidence packs", href: "/evidence-packs" },
];

export const summaryJumpLinks = [
  { label: "Requirements", href: "#requirements" },
  { label: "Failure-first design", href: "#failure-design" },
  { label: "Contestability", href: "#contestability" },
  { label: "Control checklist", href: "#control-checklist" },
];

export const actionClassRows: ActionClassRow[] = [
  {
    actionClass: "READ",
    examples: "Fetch account data, view records, list files.",
    reversibility: "Reversible",
    controls:
      "Receipt + log. Auto-approve within scope. 24h review clock if flagged.",
  },
  {
    actionClass: "WRITE",
    examples: "Update profile fields, edit records, sync CRM notes.",
    reversibility: "Reversible",
    controls:
      "Receipt + diff capture. Undo path required. Review clock for material changes.",
  },
  {
    actionClass: "TRANSFER",
    examples: "Move funds, transfer assets, change ownership.",
    reversibility: "Irreversible",
    controls:
      "Pre-action approval gate. Dual control + Hard Clock. Immediate receipt + appeal.",
  },
  {
    actionClass: "EXECUTE",
    examples: "Run jobs, trigger workflows, deploy changes.",
    reversibility: "Often irreversible",
    controls:
      "Approval gate for high-impact runs. Kill switch + rollback plan. Receipt + decision log.",
  },
  {
    actionClass: "PUBLISH",
    examples: "Post public content, send broadcasts, trigger notifications.",
    reversibility: "Often irreversible",
    controls:
      "Progressive consent prompt. Delay window for rollback. Evidence pack anchor required.",
  },
  {
    actionClass: "DELETE",
    examples: "Delete records, revoke access, purge data.",
    reversibility: "Irreversible",
    controls:
      "Two-step confirmation + reversible buffer. Remedy clock + owner sign-off.",
  },
  {
    actionClass: "CONTACT_HUMAN",
    examples: "Send emails, create tickets, call users.",
    reversibility: "Partially reversible",
    controls:
      "Human-readable rationale + opt-out. Rate limits. Receipt issued to recipient.",
  },
  {
    actionClass: "EXECUTE_CODE",
    examples: "Run scripts, deploy changes, trigger workflows.",
    reversibility: "Irreversible",
    controls:
      "Sandbox first. Manual approval for prod. Circuit breaker on anomaly.",
  },
];

export const signalIntegrityRows: SignalIntegrityRow[] = [
  {
    signal: "Unsafe-action rate",
    gaming: "Downgrade severity or reclassify incidents to reduce counts.",
    detection:
      "Compare receipts to incident logs; sample audits on action class tags.",
    tiers:
      "Tier 0: manual incident tally. Tier 1: receipt-to-incident reconciliation. Tier 2: automated anomaly alerts by class.",
  },
  {
    signal: "Human override rate",
    gaming: "Route overrides through informal channels to avoid logging.",
    detection:
      "Require override receipts and diff logs; reconcile with chat/ticket systems.",
    tiers:
      "Tier 0: weekly override count. Tier 1: override receipts tied to decision IDs. Tier 2: real-time override dashboards with owner sign-off.",
  },
  {
    signal: "Time-to-detection & mitigation",
    gaming: "Reset clocks by closing and reopening incidents.",
    detection:
      "Immutable event timestamps; auditor view of first-seen vs. closed.",
    tiers:
      "Tier 0: manual timestamps. Tier 1: system-generated clocks. Tier 2: independent monitoring clock source.",
  },
  {
    signal: "Task success vs. error cost & blast radius",
    gaming: "Count partial success as success; ignore downstream cost.",
    detection: "Link receipts to outcome metrics and remediation costs.",
    tiers:
      "Tier 0: aggregate success rate. Tier 1: success with cost tagging. Tier 2: cost + blast radius per action class.",
  },
];

export const controlChecklist = `- [ ] Receipt schema v1.0 implemented and validated against a JSON schema.
- [ ] Receipts emitted for every automated decision (owner + action class included).
- [ ] Human owner named with escalation authority and on-call coverage.
- [ ] Decision log (MEC-01) captures dissent, owner, and outcome for every high-impact action.
- [ ] Kill switch (MEC-05) tested with documented rollback criteria.
- [ ] Appeal path (MEC-06) embedded in UI with timelines and escalation ladder.
- [ ] Clocks published in UI (ack, review, remedy) and enforced in logging.
- [ ] Action-class registry published with reversible/irreversible flags and approvals.
- [ ] Evidence pack links attached to receipts (STD-01 + STD-02).
- [ ] Sign-off: product owner + risk steward + on-call reviewer recorded.
- [ ] Required logs exist: action log, override log, exception log, receipt log.
- [ ] Rollback trigger defined (unsafe-action spike, audit failure, or contested-remedy breach).`;

export const promptPackInstall = {
  title: "Ethotechnics agent prompt pack",
  version: "v1.0.0",
  downloadUrl: "/agent-toolkit/ethotechnics-agent-prompt-pack-v1.0.0.md",
  pathSnippet: "prompts/ethotechnics/ethotechnics-agent-prompt-pack-v1.0.0.md",
  invokeExample: "use: ethotechnics-agent-prompt-pack-v1.0.0",
};

export const practiceSections: PracticeSection[] = [
  {
    id: "requirements",
    eyebrow: "Practice 1",
    title: "Translate values into agent requirements",
    summary:
      "Safety goals are translated into explicit agent-level requirements, not left implicit.",
    requirements: [
      "Autonomy level (recommend vs. act)",
      "Delegation rights (sub-tasks, sub-agents)",
      "Allowed vs. forbidden action classes",
      "Tool and API scopes (least privilege)",
      "Spend, rate, and time limits",
      "Data rules (access, retention, scoped memory, deletion/export)",
      "Consent rules (when explicit approval is required)",
    ],
    signals: [
      "Unsafe-action rate (optionally severity-weighted)",
      "Human override / intervention rate",
      "Time-to-detection and time-to-mitigation",
      "Task success vs. error cost and blast radius",
    ],
    mechanisms: [
      {
        title: "MEC-02 Progressive consent prompts",
        href: "/mechanisms/patterns/progressive-consent",
      },
      {
        title: "MEC-01 Decision log with dissent",
        href: "/mechanisms/patterns/decision-log",
      },
      {
        title: "MEC-04 The Hard Clock",
        href: "/mechanisms/mec-04-hard-clock",
      },
    ],
    gaps: [
      "Action-class taxonomy calibration per tool scope and domain.",
      "Delegation authority registry for sub-agents and sub-tasks.",
      "Agent data retention + memory deletion controls.",
    ],
  },
  {
    id: "failure-design",
    eyebrow: "Practice 2",
    title: "Design for failure before deployment",
    summary:
      "Agent failure is assumed; the goal is containment, recovery, and bounded harm.",
    requirements: [
      "Pause / disable authority with escalation paths",
      "Confirmation gates for high-impact actions",
      "Rate limits and circuit breakers by action class",
      "Sandbox or dry-run mode",
      "Safe mode under uncertainty or policy conflict",
      "Compensating actions where reversibility is not literal",
      "Incident runbooks (who acts, in what order)",
    ],
    mechanisms: [
      {
        title: "MEC-05 Kill switch for runaway automation",
        href: "/mechanisms/patterns/kill-switch",
      },
      {
        title: "MEC-04 The Hard Clock",
        href: "/mechanisms/mec-04-hard-clock",
      },
      {
        title: "MEC-03 Maintenance windowing",
        href: "/mechanisms/patterns/maintenance-windowing",
      },
    ],
    gaps: [
      "Exception policy for re-enabling automation after a kill switch.",
      "Safe-mode playbook that keeps humans in control.",
      "Live-trust system for throttling or shutting down on anomaly.",
    ],
  },
  {
    id: "accountability",
    eyebrow: "Practice 3",
    title: "Anchor accountability in the receipts",
    summary:
      "Receipts tie every agent action to an accountable owner, evidence, and a timeline for review.",
    requirements: [
      "Receipts emitted for every agent action",
      "Receipt includes owner, action class, and time stamps",
      "Decision log linked to every irreversible action",
      "Evidence pack or policy linked to every exception",
      "Immutable logs for action, override, and exception paths",
      "On-call coverage for receipt review and remediation",
    ],
    mechanisms: [
      {
        title: "MEC-01 Decision log with dissent",
        href: "/mechanisms/patterns/decision-log",
      },
      {
        title: "MEC-06 Contestability & appeals",
        href: "/mechanisms/patterns/contestability",
      },
      {
        title: "MEC-07 Evidence packs",
        href: "/mechanisms/patterns/evidence-pack",
      },
    ],
    gaps: [
      "Receipt schema support in the agent platform.",
      "Receipt registry with queryable exports for audit.",
      "Receipts that render in a human-readable summary view.",
    ],
  },
  {
    id: "contestability",
    eyebrow: "Practice 4",
    title: "Make contestability tangible",
    summary:
      "People must see how to contest, reverse, and seek remedy when automation impacts them.",
    requirements: [
      "Appeal path visible in every UI where automation acts",
      "Published clocks for acknowledgement, review, and remedy",
      "Escalation ladder with accountable decision owners",
      "Audit trail linking appeals to receipts and outcomes",
      "Evidence parity between automated and human decisions",
    ],
    mechanisms: [
      {
        title: "MEC-06 Contestability & appeals",
        href: "/mechanisms/patterns/contestability",
      },
      {
        title: "MEC-04 The Hard Clock",
        href: "/mechanisms/mec-04-hard-clock",
      },
    ],
    gaps: [
      "Contestability receipts linked to appeals and remediation outcomes.",
      "Appeal intake templates for agent decisions.",
      "Escalation system that ties into incident response.",
    ],
  },
  {
    id: "risk-backlog",
    eyebrow: "Practice 5",
    title: "Keep a risk backlog for automation",
    summary:
      "Known risks are tracked like technical debt: logged, owned, and prioritized.",
    requirements: [
      "Risk backlog with severity, owner, and remediation plan",
      "Escalation for critical or repeated issues",
      "Risk backlog reviewed with every release or change",
      "Risk remediation budgeted like reliability work",
    ],
    mechanisms: [
      {
        title: "MEC-01 Decision log with dissent",
        href: "/mechanisms/patterns/decision-log",
      },
      {
        title: "MEC-05 Kill switch for runaway automation",
        href: "/mechanisms/patterns/kill-switch",
      },
    ],
    gaps: [
      "Risk register template that includes action class and receipt links.",
      "Metrics to rank remediation by severity and time-to-halt exposure.",
    ],
  },
  {
    id: "pressure-test",
    eyebrow: "Practice 6",
    title: "Pressure-test safety claims",
    summary:
      "Safety claims only hold if they survive simulated, adversarial, and drift scenarios.",
    requirements: [
      "Stress tests for unsafe action rates and override response",
      "Simulations for repeated override or policy conflict",
      "Failure rehearsals for kill switch or rollback",
      "Scenario drills for contested decisions and appeals",
    ],
    mechanisms: [
      {
        title: "MEC-05 Kill switch for runaway automation",
        href: "/mechanisms/patterns/kill-switch",
      },
      {
        title: "MEC-09 Ethical interrupts",
        href: "/mechanisms/patterns/ethical-interrupts",
      },
    ],
    gaps: [
      "Safety case template that links tests to claims.",
      "Red-team exercises for agent drift and abuse modes.",
    ],
  },
];
