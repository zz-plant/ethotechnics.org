import type { GlossaryTerm } from "./glossary";
import type {
  PageWithPermalink,
  PublicationMetadata,
  PublishedContent,
} from "./types";

import { glossaryContent, glossaryTerms } from "./glossary";

export type PrimerSection = {
  title: string;
  summary: string;
  takeaways: string[];
};

export type PatternFilter = {
  slug: "governance" | "friction" | "policy";
  label: string;
  description: string;
};

export type Pattern = {
  slug: string;
  title: string;
  summary: string;
  filters: PatternFilter["slug"][];
  glossaryRefs: string[];
  cues: string[];
  diagnostics: string[];
  steps: string[];
  policyRequirement: string;
  productRequirement: string;
  auditEvidenceChecklist: string;
  postmortemTrigger: string;
  artifacts: { name: string; purpose: string }[];
  example: { title: string; description: string };
  antiPatterns?: {
    title: string;
    failure: string;
    counterfactual: string;
    warning: string;
  }[];
};

export type SyllabusModule = {
  title: string;
  duration: string;
  topics: string[];
  outcome: string;
};

export type LibraryContent = PageWithPermalink &
  PublishedContent & {
    publication: PublicationMetadata;
    primer: PrimerSection[];
    glossary: { terms: GlossaryTerm[]; permalink: string };
    patterns: { filters: PatternFilter[]; entries: Pattern[] };
    syllabus: { overview: string; modules: SyllabusModule[] };
    quickStart: string[];
    recommended: {
      title: string;
      description: string;
      items: { title: string; description: string; href: string }[];
    };
    rolePathways: {
      title: string;
      description: string;
      roles: {
        id: string;
        label: string;
        summary: string;
        items: { title: string; description: string; href: string }[];
      }[];
    };
  };

export const libraryContent: LibraryContent = {
  pageTitle: "Mechanisms — Ethotechnics Institute",
  pageDescription:
    "Specification-ready mechanisms for accountable systems, with cited primers, glossary entries, and reusable safeguards.",
  permalink: "/mechanisms",
  published: "2025-12-03T00:00:00Z",
  updated: "2026-01-09T00:00:00Z",
  publication: {
    authors: [
      {
        name: "Ethotechnics Institute Research Team",
        affiliation: "Ethotechnics Institute",
        email: "research@ethotechnics.org",
      },
    ],
    contact: "research@ethotechnics.org",
    published: "2025-12-03T00:00:00Z",
    updated: "2026-01-09T00:00:00Z",
    version: "v1.1.0",
    doi: "Pending Zenodo deposit",
    archiveUrl:
      "https://web.archive.org/save/https://ethotechnics.org/mechanisms",
    changelog: [
      {
        version: "v1.1.0",
        date: "2026-01-09",
        summary:
          "Added citation metadata, mechanisms-level authorship details, and structured usage guidance.",
      },
      {
        version: "v1.0.0",
        date: "2025-12-03",
        summary: "Initial public mechanisms release.",
      },
    ],
    license: {
      label: "CC BY-SA 4.0",
      href: "https://creativecommons.org/licenses/by-sa/4.0/",
    },
    attribution:
      "Credit Ethotechnics Institute, include the page title + version, and link to the canonical permalink.",
  },
  quickStart: [
    "Skim the primer for a 5-minute orientation and shared vocabulary.",
    "Jump to the glossary for stable definitions you can cite immediately.",
    "Use the mechanism filters to pull the right safeguards for your scenario.",
    "Cite the permalinks in papers, policy memos, or peer reviews to anchor legitimacy.",
  ],
  recommended: {
    title: "Recommended starters",
    description:
      "Three high-signal mechanisms teams reuse most often when onboarding or auditing a system.",
    items: [
      {
        title: "MEC-01 Decision log with dissent",
        description:
          "Keep decisions legible with dissent, ownership, and follow-up dates.",
        href: "/mechanisms/patterns/decision-log",
      },
      {
        title: "MEC-02 Progressive consent prompts",
        description:
          "Stage consent requests with clear exits and reversible defaults.",
        href: "/mechanisms/patterns/progressive-consent",
      },
      {
        title: "MEC-03 Maintenance windowing",
        description: "Plan downtime and comms so stewardship stays visible.",
        href: "/mechanisms/patterns/maintenance-windowing",
      },
    ],
  },
  rolePathways: {
    title: "Role-based pathways",
    description:
      "Pick the role that matches your responsibilities to jump to the most relevant guides.",
    roles: [
      {
        id: "engineer",
        label: "I'm an Engineer",
        summary:
          "Prioritize stoppability, rollback readiness, and safe maintenance rhythms.",
        items: [
          {
            title: "MEC-05 Kill switch for runaway automation",
            description:
              "Stoppability playbook with triggers, operators, and restoration drills.",
            href: "/mechanisms/patterns/kill-switch",
          },
          {
            title: "MEC-03 Maintenance windowing",
            description:
              "Plan safe downtime, fallback coverage, and stewardship windows.",
            href: "/mechanisms/patterns/maintenance-windowing",
          },
          {
            title: "Glossary: Stoppability",
            description:
              "Shared language for halts, safety valves, and time-to-halt targets.",
            href: "/glossary/stoppability",
          },
        ],
      },
      {
        id: "product-manager",
        label: "I'm a Product Manager",
        summary:
          "Design consent, appeals, and accountability into the user journey.",
        items: [
          {
            title: "MEC-02 Progressive consent prompts",
            description:
              "Stage consent requests with clear exits and reversible defaults.",
            href: "/mechanisms/patterns/progressive-consent",
          },
          {
            title: "MEC-06 Appeal paths inside the UI",
            description:
              "Bake dispute routes and human review into the experience.",
            href: "/mechanisms/patterns/appeal-paths",
          },
          {
            title: "Glossary: Consent journey",
            description:
              "Map how people move through requests, opt-outs, and follow-ups.",
            href: "/glossary/consent-journey",
          },
        ],
      },
      {
        id: "regulator",
        label: "I'm a Regulator",
        summary:
          "Focus on accountability logs, audit trails, and remediation evidence.",
        items: [
          {
            title: "MEC-01 Decision log with dissent",
            description:
              "Accountability logs with owners, dissent, and review dates.",
            href: "/mechanisms/patterns/decision-log",
          },
          {
            title: "MEC-03 Maintenance windowing",
            description:
              "Operational evidence of stewardship windows and documented fixes.",
            href: "/mechanisms/patterns/maintenance-windowing",
          },
          {
            title: "Glossary: Repair log",
            description:
              "Trace fixes, follow-ups, and published commitments over time.",
            href: "/glossary/repair-log",
          },
        ],
      },
    ],
  },
  primer: [
    {
      title: "Primer",
      summary:
        "Short explainers teams can skim before working with the rest of the mechanisms.",
      takeaways: [
        "Why burden, consent, and stewardship matter for socio-technical systems.",
        "How to align governance artifacts with the lived experience of the people using your product.",
        "What “mechanism language” means for UI safeguards, facilitation prompts, and escalation design.",
      ],
    },
    {
      title: "Usage guidance",
      summary:
        "How to adapt the materials to your org without slowing delivery.",
      takeaways: [
        "Each section ships with permalinks; link directly in design docs or runbooks to keep teams aligned.",
        "Filters call out whether a mechanism is governance-first, friction guidance, or a policy control.",
        "Glossary terms stay stable so research, field notes, and diagnostics can cross-link without drift.",
      ],
    },
  ],
  glossary: {
    terms: glossaryTerms.slice(0, 12),
    permalink: glossaryContent.permalink,
  },
  patterns: {
    filters: [
      {
        slug: "governance",
        label: "Governance",
        description:
          "Decision logs, maintenance windows, and escalation paths backed by diagnostics.",
      },
      {
        slug: "friction",
        label: "Friction",
        description:
          "Consent prompts, appeal paths, and humane defaults that keep interfaces accountable.",
      },
      {
        slug: "policy",
        label: "Policy",
        description:
          "Charters, stewardship commitments, and controls you can cite in contracts and playbooks.",
      },
    ],
    entries: [
      {
        slug: "decision-log",
        title: "MEC-01 Decision log with dissent",
        summary:
          "Capture high-stakes calls, dissenting views, and follow-ups so governance stays legible to teams and impacted people.",
        filters: ["governance", "policy"],
        glossaryRefs: ["design-authority", "repair-log", "contestability"],
        cues: [
          "Record why options were ruled out and who was consulted.",
          "Attach plain-language summaries for external readers.",
          "Set a review date tied to the stewardship window.",
        ],
        diagnostics: ["burden-modeler"],
        steps: [
          "Log the decision, rejected options, and who was consulted in one place.",
          "Attach a short summary alongside the canonical record for external readers.",
          "Set a review date with a clear owner tied to the stewardship window.",
        ],
        policyRequirement: `Policy requirement (MEC-01 Decision log with dissent)
- Maintain a decision log for high-stakes changes with dissenting views and a dated review owner.
- Store the log in a shared system of record and retain links in audit and incident records.
Reference: https://ethotechnics.org/mechanisms/patterns/decision-log`,
        productRequirement: `Product requirement (MEC-01)
- Every high-stakes automated decision emits a decision-log entry ID in the receipt.
- The UI links to a plain-language summary within two clicks of the decision outcome.`,
        auditEvidenceChecklist: `Audit evidence checklist (MEC-01)
[ ] Decision log entries include owner, dissent, and review date.
[ ] Plain-language summaries are attached and shareable.
[ ] Stewardship reviews were completed on schedule.`,
        postmortemTrigger: `Postmortem trigger (MEC-01)
Trigger review if a high-stakes decision ships without a logged entry or dissent record.`,
        artifacts: [
          {
            name: "Decision record template",
            purpose:
              "Captures the decision, dissent, and follow-ups with owners.",
          },
          {
            name: "Plain-language summary",
            purpose:
              "One-paragraph recap teams can paste into briefs or release notes without jargon.",
          },
          {
            name: "Stewardship calendar entry",
            purpose:
              "Review reminder aligned to maintenance or appeal windows.",
          },
        ],
        example: {
          title: "Recording a launch gate call",
          description:
            "A cross-functional team logs why an automation launch was delayed, notes dissent from support leads, links the appeal path, and schedules a stewardship review in six weeks.",
        },
        antiPatterns: [
          {
            title: "Logs without dissent",
            failure:
              "Records the decision but omits rejected options and dissenting views.",
            counterfactual:
              "Decision logs include rejected options, dissent, and a dated review owner.",
            warning:
              "If no dissent exists, log the absence explicitly so future reviewers can see it was considered.",
          },
          {
            title: "Out-of-band records",
            failure:
              "Keeps accountability logs in private documents that impacted teams cannot access.",
            counterfactual:
              "Logs live in the canonical record with a shareable receipt link.",
            warning:
              "Sensitive data can be redacted, but the receipt must remain referenceable.",
          },
        ],
      },
      {
        slug: "progressive-consent",
        title: "MEC-02 Progressive consent prompts",
        summary:
          "Stage requests for data or automation over time, with reminders and exits that honor the consent journey.",
        filters: ["friction", "policy"],
        glossaryRefs: ["consent-journey", "permission-surface", "safety-valve"],
        cues: [
          "Pair each ask with why it is needed and how to revoke it.",
          "Show impacts of opting out before a person commits.",
          "Include a safety valve that defaults to privacy-preserving behavior.",
        ],
        diagnostics: ["llm-capacity-benchmark"],
        steps: [
          "Break large asks into small prompts that explain why each is needed.",
          "Preview what happens if someone opts out and keep the path visible.",
          "Offer a safety valve that defaults to privacy-preserving behavior.",
        ],
        policyRequirement: `Policy requirement (MEC-02 Progressive consent prompts)
- Stage consent requests with clear revocation paths and visible opt-out impacts.
- Document safety-valve defaults that preserve privacy when consent is withheld.
Reference: https://ethotechnics.org/mechanisms/patterns/progressive-consent`,
        productRequirement: `Product requirement (MEC-02)
- Each consent request includes purpose, duration, and revocation instructions.
- Opt-out paths remain visible and do not degrade core safety access.`,
        auditEvidenceChecklist: `Audit evidence checklist (MEC-02)
[ ] Consent journey map shows each ask, rationale, and rollback path.
[ ] Opt-out copy kit deployed across UI, email, and help surfaces.
[ ] Safety-valve defaults verified in staging and production.`,
        postmortemTrigger: `Postmortem trigger (MEC-02)
Trigger review if opt-out actions fail, are ignored, or re-enable without notice.`,
        artifacts: [
          {
            name: "Consent journey map",
            purpose:
              "Shows each request, rationale, and rollback path across the flow.",
          },
          {
            name: "Opt-out copy kit",
            purpose:
              "Short blurbs teams reuse in UI states, emails, and help docs.",
          },
          {
            name: "Safety valve checklist",
            purpose:
              "Confirms every step has a reversible, privacy-first fallback before shipping.",
          },
        ],
        example: {
          title: "Piloting a model-powered assistant",
          description:
            "Product and legal teams stage data collection prompts over several sessions, preview how opting out affects recommendations, and keep a global “pause automation” control visible in the UI.",
        },
        antiPatterns: [
          {
            title: "One-shot consent bundles",
            failure:
              "Asks for every permission at once without explaining timing or scope.",
            counterfactual:
              "Requests are staged with clear rationale, timing, and reversible defaults.",
            warning:
              "Bundling can be acceptable if the scope is minimal and opt-outs are explicit.",
          },
          {
            title: "Opt-out that does not stick",
            failure:
              "Offers a toggle but automation continues or re-enables without notice.",
            counterfactual:
              "Opt-outs pause automation and are logged with a visible confirmation.",
            warning:
              "Some baseline data use can remain if it is disclosed and required for service safety.",
          },
        ],
      },
      {
        slug: "maintenance-windowing",
        title: "MEC-03 Maintenance windowing",
        summary:
          "Schedule improvements, monitoring, and resourcing using a visible stewardship window.",
        filters: ["governance", "policy"],
        glossaryRefs: [
          "maintenance-window",
          "maintenance-metabolism",
          "repair-log",
        ],
        cues: [
          "Set owners and success criteria for each window.",
          "Map communication cadences to risk levels and audiences.",
          "Align dependencies so a degraded tool has a safe fallback.",
        ],
        diagnostics: ["maintenance-simulator"],
        steps: [
          "Define maintenance windows with owners, success criteria, and rollbacks.",
          "Publish communication cadences by risk level and audience.",
          "Check dependencies so degraded modes route to safe fallbacks.",
        ],
        policyRequirement: `Policy requirement (MEC-03 Maintenance windowing)
- Publish stewardship windows with named owners, success criteria, and rollback authority.
- Require comms cadences by risk tier before shipping changes.
Reference: https://ethotechnics.org/mechanisms/patterns/maintenance-windowing`,
        productRequirement: `Product requirement (MEC-03)
- Release plans include a window ID and owner in change tickets.
- Status updates and fallback behavior are visible to affected users.`,
        auditEvidenceChecklist: `Audit evidence checklist (MEC-03)
[ ] Window calendar lists owners, coverage, and success criteria.
[ ] Comms templates are published by risk level and audience.
[ ] Fallback matrix confirms safe degraded modes for dependencies.`,
        postmortemTrigger: `Postmortem trigger (MEC-03)
Trigger review if changes ship outside the stewardship window or without comms.`,
        artifacts: [
          {
            name: "Window calendar",
            purpose:
              "Shared schedule with owners, coverage, and success criteria.",
          },
          {
            name: "Comms templates",
            purpose:
              "Prewritten updates for high, medium, and low-risk changes tied to roles.",
          },
          {
            name: "Fallback matrix",
            purpose:
              "Lists degraded modes and who is paged when dependencies fail.",
          },
        ],
        example: {
          title: "Coordinating a stewardship sprint",
          description:
            "Engineering and operations publish a two-week window with a fallback matrix, schedule status updates by audience, and rehearse degraded-mode protocols before shipping changes.",
        },
        antiPatterns: [
          {
            title: "Stewardship without owners",
            failure:
              "Publishes a maintenance window without naming accountable owners or success criteria.",
            counterfactual:
              "Each window has a named owner, success criteria, and rollback authority.",
            warning:
              "Shared ownership is fine if responsibilities are explicit and visible.",
          },
          {
            title: "Silent maintenance",
            failure:
              "Ships changes without comms or status updates, leaving users unaware of risks.",
            counterfactual:
              "Comms are published by audience and risk tier, with fallback coverage noted.",
            warning:
              "Emergency patches can shorten comms, but they still require an after-action log.",
          },
        ],
      },
      {
        slug: "kill-switch",
        title: "MEC-05 Kill switch for runaway automation",
        summary:
          "Pre-authorized halt paths with named stewards, thresholds, and restoration drills so harms stop in seconds.",
        filters: ["governance", "friction"],
        glossaryRefs: ["stoppability", "ethical-interrupts", "time-to-halt"],
        cues: [
          "Define triggers tied to moral performance indicators and frontline reports.",
          "Name the people who can fire the switch and protect them from retaliation.",
          "Rehearse rollbacks so halts land in reversible, well-communicated states.",
        ],
        diagnostics: ["maintenance-simulator", "burden-modeler"],
        steps: [
          "Map the automation path and mark where halts must land safely with owners.",
          "Set tripwires for ethical interrupts that align with time-to-halt targets.",
          "Run drills that practice firing, communicating, and restoring from the halt.",
        ],
        policyRequirement: `Policy requirement (MEC-05 Kill switch for runaway automation)
- Maintain a pre-authorized halt path with a named roster and protection from retaliation.
- Publish tripwires tied to moral performance indicators and time-to-halt targets.
Reference: https://ethotechnics.org/mechanisms/patterns/kill-switch`,
        productRequirement: `Product requirement (MEC-05)
- The kill switch is reachable within one operational step from monitoring dashboards.
- Halt events emit receipts with owner, trigger, and restoration checklist links.`,
        auditEvidenceChecklist: `Audit evidence checklist (MEC-05)
[ ] Kill switch runbook names authorized operators and triggers.
[ ] Drill logs demonstrate time-to-halt performance.
[ ] Rollback checklists show safe restoration steps.`,
        postmortemTrigger: `Postmortem trigger (MEC-05)
Trigger review when time-to-halt targets are exceeded or the kill switch is unavailable.`,
        artifacts: [
          {
            name: "Kill switch runbook",
            purpose:
              "Documents triggers, authorized operators, and post-halt messaging.",
          },
          {
            name: "Rollback checklist",
            purpose:
              "Confirms data, access, and user impact are stable before resuming.",
          },
          {
            name: "After-action log template",
            purpose:
              "Captures what tripped the switch and how to tighten thresholds or observability.",
          },
        ],
        example: {
          title: "Containing a runaway recommendation loop",
          description:
            "Operations staff notice a spike in appeals and trip the kill switch, freezing recommendations, routing cases to humans, and restoring with updated thresholds before re-enabling automation.",
        },
        antiPatterns: [
          {
            title: "Kill switch without rehearsal",
            failure:
              "A halt path exists but no drills confirm that it works under pressure.",
            counterfactual:
              "Teams rehearse halts and document restore steps with time-to-halt targets.",
            warning:
              "Simulation is acceptable when production drills are risky, but it must be documented.",
          },
          {
            title: "Single-point approval",
            failure:
              "Only one person can trigger the halt, creating dead zones off-hours.",
            counterfactual:
              "A pre-authorized roster can halt automation without retaliation risk.",
            warning:
              "Small teams can assign a primary/secondary if coverage is explicit.",
          },
        ],
      },
      {
        slug: "appeal-paths",
        title: "MEC-06 Appeal paths inside the UI",
        summary:
          "Give people a built-in channel to dispute outputs, get human review, or learn how a decision was made.",
        filters: ["friction", "governance"],
        glossaryRefs: [
          "contestability",
          "appeal-passage-rate",
          "permission-surface",
        ],
        cues: [
          "Explain who reviews appeals and the expected response time.",
          "Pre-fill context to reduce effort during stressful moments.",
          "Track appeal outcomes to improve signal credibility.",
        ],
        diagnostics: ["burden-modeler", "maintenance-simulator"],
        steps: [
          "Place an appeal entry point near the affected decision with response times.",
          "Pre-fill context so people can submit without rebuilding the story.",
          "Track outcomes and feed them back into product and policy updates.",
        ],
        policyRequirement: `Policy requirement (MEC-06 Appeal paths inside the UI)
- Provide an in-product appeal channel with published response timelines.
- Log appeal outcomes and feed them into governance review cycles.
Reference: https://ethotechnics.org/mechanisms/patterns/appeal-paths`,
        productRequirement: `Product requirement (MEC-06)
- Every appeal submission generates a receipt with response timeline and owner.
- Appeals are accessible from the decision surface without extra navigation.`,
        auditEvidenceChecklist: `Audit evidence checklist (MEC-06)
[ ] Appeal intake form includes pre-filled context.
[ ] Reviewer rota and escalation paths are documented.
[ ] Outcome log tracks response times and resolutions.`,
        postmortemTrigger: `Postmortem trigger (MEC-06)
Trigger review when appeal backlogs breach published response timelines.`,
        artifacts: [
          {
            name: "Appeal intake form",
            purpose:
              "Collects the minimum details with pre-filled context from the UI.",
          },
          {
            name: "Reviewer rota",
            purpose:
              "Lists who reviews appeals, coverage hours, and escalation paths.",
          },
          {
            name: "Outcome log",
            purpose:
              "Keeps decisions, response times, and fixes visible to teams and leadership.",
          },
        ],
        example: {
          title: "Adding appeals to a risk scoring tool",
          description:
            "The team adds an on-screen “Dispute this score” link with expected response times, routes submissions to a staffed rota, and logs turnaround data to improve credibility with regulators.",
        },
        antiPatterns: [
          {
            title: "Appeal link buried",
            failure:
              "Appeals exist but are hidden in help docs or separate portals far from the decision.",
            counterfactual:
              "Appeal entry points sit next to the affected decision with visible timelines.",
            warning:
              "Low-frequency contexts can use a help center if it is still clear and accessible.",
          },
          {
            title: "Appeals without feedback",
            failure:
              "Collects disputes but provides no receipt, timeline, or outcome signal.",
            counterfactual:
              "Every appeal generates a receipt, timeline, and outcome log.",
            warning:
              "Timelines can vary by case complexity if the variance is stated and tracked.",
          },
        ],
      },
      {
        slug: "accountability-latency-tracker",
        title: "MEC-07 Accountability latency tracker",
        summary:
          "Measure how quickly teams can intervene, halt, and restore systems when accountability is on the line.",
        filters: ["governance", "policy"],
        glossaryRefs: ["audit-trail", "design-authority", "time-to-halt"],
        cues: [
          "Instrument veto, halt, and restore events with owner and trigger metadata.",
          "Publish accountability latency targets alongside time-to-halt SLAs.",
          "Tie latency deltas to post-incident repair log entries.",
        ],
        diagnostics: ["maintenance-simulator"],
        steps: [
          "Define the telemetry contract for veto, halt, and restoration events.",
          "Surface a dashboard that shows median latency and breach incidents.",
          "Review latency drift during governance reviews and update runbooks.",
        ],
        policyRequirement: `Policy requirement (MEC-07 Accountability latency tracker)
- Track veto, halt, and restore latencies with owner, trigger, and system context.
- Publish accountability latency targets in incident response runbooks.
Reference: https://ethotechnics.org/mechanisms/patterns/accountability-latency-tracker`,
        productRequirement: `Product requirement (MEC-07)
- Monitoring dashboards show accountability latency alongside time-to-halt metrics.
- Veto events emit receipts linked to the repair log and designated escalation owners.`,
        auditEvidenceChecklist: `Audit evidence checklist (MEC-07)
[ ] Telemetry captures veto, halt, and restore events with timestamps.
[ ] Dashboards report median and worst-case accountability latency.
[ ] Incident reviews include latency deltas and corrective actions.`,
        postmortemTrigger: `Postmortem trigger (MEC-07)
Trigger review when accountability latency breaches published targets or telemetry is missing.`,
        artifacts: [
          {
            name: "Telemetry contract",
            purpose:
              "Defines event names, required fields, and tags for observability tooling.",
          },
          {
            name: "Dashboard snapshot",
            purpose:
              "Shares latency trends and breach annotations for governance reviews.",
          },
          {
            name: "Latency response runbook",
            purpose:
              "Outlines response owners, escalation paths, and remediation steps.",
          },
        ],
        example: {
          title: "Tracking veto response time during an incident",
          description:
            "Operations teams add veto latency tracking to their Datadog dashboards, review weekly deltas, and tie missed targets to repair log updates and training.",
        },
        antiPatterns: [
          {
            title: "Latency tracked without owners",
            failure:
              "Metrics exist, but no one is accountable for acting on latency breaches.",
            counterfactual:
              "Dashboards list named owners and escalation paths for each latency tier.",
            warning:
              "Shared ownership works when escalation paths are explicit and rehearsed.",
          },
          {
            title: "Telemetry without repair links",
            failure:
              "Latency events are logged but never tied to remediation plans.",
            counterfactual:
              "Every breach links to a repair log entry with follow-up actions.",
            warning:
              "If the repair log lives elsewhere, provide a canonical cross-link.",
          },
        ],
      },
    ],
  },
  syllabus: {
    overview:
      "A guided track for teams adopting the mechanisms. Each module links to glossary anchors and specifications you can cite in docs.",
    modules: [
      {
        title: "Orientation",
        duration: "60 minutes",
        topics: [
          "Mechanisms tour and how to use permalinks in specs",
          "Primer on burden, consent, and stewardship",
          "Navigation of governance, design ethics, and policy filters",
        ],
        outcome:
          "Teams can route questions to the right section and cite glossary terms consistently.",
      },
      {
        title: "Field-ready research",
        duration: "90 minutes",
        topics: [
          "Integrating glossary terms into research and field notes",
          "Tagging findings by focus area and diagnostic relevance",
          "Building appeal paths and consent prompts into prototypes",
        ],
        outcome:
          "Practitioners share findings with linked terms and mechanism cues that ship with the work.",
      },
      {
        title: "Governance and maintenance",
        duration: "75 minutes",
        topics: [
          "Decision logs, stewardship windows, and escalation readiness",
          "Pairing diagnostics with mechanism rollout",
          "Designing safety valves for high-burden scenarios",
        ],
        outcome:
          "Leadership aligns on accountable maintenance plans backed by diagnostic evidence.",
      },
    ],
  },
};
