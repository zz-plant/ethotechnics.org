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
  artifacts: { name: string; purpose: string }[];
  example: { title: string; description: string };
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
  permalink: "/library",
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
    archiveUrl: "https://web.archive.org/save/https://ethotechnics.org/library",
    changelog: [
      {
        version: "v1.1.0",
        date: "2026-01-09",
        summary:
          "Added citation metadata, library-level authorship details, and structured usage guidance.",
      },
      {
        version: "v1.0.0",
        date: "2025-12-03",
        summary: "Initial public library release.",
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
        href: "/library/patterns/decision-log",
      },
      {
        title: "MEC-02 Progressive consent prompts",
        description:
          "Stage consent requests with clear exits and reversible defaults.",
        href: "/library/patterns/progressive-consent",
      },
      {
        title: "MEC-03 Maintenance windowing",
        description: "Plan downtime and comms so stewardship stays visible.",
        href: "/library/patterns/maintenance-windowing",
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
            href: "/library/patterns/kill-switch",
          },
          {
            title: "MEC-03 Maintenance windowing",
            description:
              "Plan safe downtime, fallback coverage, and stewardship windows.",
            href: "/library/patterns/maintenance-windowing",
          },
          {
            title: "Glossary: Stopability",
            description:
              "Shared language for halts, safety valves, and time-to-halt targets.",
            href: "/glossary#stopability",
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
            href: "/library/patterns/progressive-consent",
          },
          {
            title: "MEC-06 Appeal paths inside the UI",
            description:
              "Bake dispute routes and human review into the experience.",
            href: "/library/patterns/appeal-paths",
          },
          {
            title: "Glossary: Consent journey",
            description:
              "Map how people move through requests, opt-outs, and follow-ups.",
            href: "/glossary#consent-journey",
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
            href: "/library/patterns/decision-log",
          },
          {
            title: "MEC-03 Maintenance windowing",
            description:
              "Operational evidence of stewardship windows and documented fixes.",
            href: "/library/patterns/maintenance-windowing",
          },
          {
            title: "Glossary: Repair log",
            description:
              "Trace fixes, follow-ups, and published commitments over time.",
            href: "/glossary#repair-log",
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
      },
      {
        slug: "kill-switch",
        title: "MEC-05 Kill switch for runaway automation",
        summary:
          "Pre-authorized halt paths with named stewards, thresholds, and restoration drills so harms stop in seconds.",
        filters: ["governance", "friction"],
        glossaryRefs: ["stopability", "ethical-interrupts", "time-to-halt"],
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
          "Practitioners share findings with linked terms and pattern cues that ship with the work.",
      },
      {
        title: "Governance and maintenance",
        duration: "75 minutes",
        topics: [
          "Decision logs, stewardship windows, and escalation readiness",
          "Pairing diagnostics with pattern rollout",
          "Designing safety valves for high-burden scenarios",
        ],
        outcome:
          "Leadership aligns on accountable maintenance plans backed by diagnostic evidence.",
      },
    ],
  },
};
