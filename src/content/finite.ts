import type { PageWithPermalink } from "./types";

type FiniteAction = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
};

type FiniteCard = {
  title: string;
  detail: string;
  tags?: string[];
};

type FiniteStep = {
  title: string;
  detail: string;
};

type FiniteDimension = {
  title: string;
  question: string;
  detail: string;
};

export type FiniteContent = PageWithPermalink & {
  hero: {
    eyebrow: string;
    heading: string;
    lede: string;
    summary: string;
    actions: FiniteAction[];
    panel: {
      eyebrow: string;
      title: string;
      description: string;
    };
  };
  keyTakeaways: {
    title: string;
    label: string;
    note: string;
    bullets: string[];
  };
  why: {
    title: string;
    description: string;
    body: string;
  };
  useCases: {
    title: string;
    description: string;
    items: FiniteCard[];
  };
  gettingStarted: {
    eyebrow: string;
    title: string;
    description: string;
    steps: string[];
    whoFor: string[];
  };
  referenceTask: {
    title: string;
    description: string;
    bullets: string[];
    note: string;
  };
  agentReady: {
    title: string;
    description: string;
    items: FiniteCard[];
  };
  measures: {
    title: string;
    description: string;
    dimensions: FiniteDimension[];
    deliverables: string[];
  };
  workflow: {
    title: string;
    description: string;
    steps: FiniteStep[];
    loopNote: string;
  };
  fit: {
    title: string;
    description: string;
    items: string[];
  };
  practice: {
    title: string;
    description: string;
  };
  pilot: {
    title: string;
    status: string;
    description: string;
    bullets: string[];
    contact: {
      label: string;
      href: string;
      description: string;
    };
  };
  sampleArtifact: {
    title: string;
    description: string;
    href: string;
    label: string;
  };
};

export const finiteContent = {
  pageTitle: "Finite [Beta] — Stoppability drills for AI agents and systems",
  pageDescription:
    "Finite is an evaluation and training environment that tests whether an AI agent can be halted, reversed, and recovered without exporting harm to people.",
  permalink: "/finite",
  hero: {
    eyebrow: "Finite [Beta]",
    heading: "Finite",
    lede: "An evaluation and training environment that tests whether an AI agent or system can be halted, reversed, and recovered without dumping the failure onto people.",
    summary:
      "Most AI benchmarks reward capability. Finite measures how stoppable an agent system is, and who pays when it fails.",
    actions: [
      { label: "Explore pilot details", href: "#pilot", variant: "primary" },
      {
        label: "Talk with the team",
        href: "mailto:studio@ethotechnics.org",
        variant: "ghost",
      },
    ],
    panel: {
      eyebrow: "Beta pilot",
      title: "Stoppability training loop",
      description:
        "Pair stoppability drills with reversibility and volatility export checks to see how systems fail—and how to halt them faster.",
    },
  },
  keyTakeaways: {
    title: "Key takeaways",
    label: "Non-binding overview",
    note: "This summary is informational only; formal legal terms and statements of work govern engagement details.",
    bullets: [
      "Scope: Finite is a stoppability evaluation and training loop for named systems and scenarios, not a certification or audit.",
      "Engagements focus on agreed drills, scorecards, and recommendations tied to the defined workflow.",
      "SLAs and delivery timelines are set per pilot plan; no always-on monitoring or production support SLA is implied.",
      "Data handling minimizes exposure: only logs, traces, and artifacts needed for drills are shared, and sensitive data should be redacted where possible.",
      "Finite packages drills into agent-readable runbooks so agents and operators can rehearse together.",
      "Findings support internal decision-making; ownership of mitigation and implementation stays with your team.",
    ],
  },
  why: {
    title: "Why Finite exists",
    description:
      "Drills for stopping and reversing agent systems, and for recording who carries the cleanup.",
    body: "Teams are wiring agents into support, operations, finance, civic services, and internal tools. Most of the effort goes into making them do more. Finite drills the reverse: stopping an agent system under stress, undoing what it did, and recording who absorbed the cleanup. That cleanup is maintenance work that usually goes unrecorded. Finite records it, so stoppability, reversibility, and the burden on people are measured before launch rather than after an incident.",
  },
  useCases: {
    title: "When to use Finite",
    description: "The settings the drills and traces are built for.",
    items: [
      {
        title: "Preparing for production agents",
        detail:
          "Deploying tool-using or autonomous agents into workflows where shutdown paths are untested or unclear.",
      },
      {
        title: "Orchestrated and multi-agent systems",
        detail:
          "Running planners or agent clusters on top of external APIs and services that can behave in unexpected ways.",
      },
      {
        title: "Complex infrastructure under load",
        detail:
          "Operating systems where AI can quietly shift toil and risk onto operators, downstream services, or end-users.",
      },
    ],
  },
  gettingStarted: {
    eyebrow: "Running a drill",
    title: "What a stoppability drill needs before it starts.",
    description:
      "Finite is a training environment, not a place to begin reading. If you are orienting rather than drilling, /start is the page you want. These are the inputs a drill needs.",
    steps: [
      "Name the system or workflow you want to test, plus one recent incident or near-miss.",
      "Identify who can halt or roll back the system today, and where that ownership is unclear.",
      "Draft an agent brief with tool permissions, stop signals, rollback gates, and escalation rules.",
      "Schedule a tabletop run with operators, support, and governance partners.",
    ],
    whoFor: [
      "Teams piloting AI-enabled systems with unclear shutdown paths.",
      "Operators who need drills to practice reversibility before launch.",
      "Leaders documenting how failure risk shifts across people and services.",
    ],
  },
  referenceTask: {
    title: "Reference Task v0.1",
    description:
      "The ledger containment drill is the baseline task. Metrics, runs, and explorer fixtures are defined against it.",
    bullets: [
      "Read the scenario narrative, I/O, tools, stoppability checks, and metrics captured for the baseline task.",
      "Re-run the drill to compare stoppability posture as safeguards and rollback paths evolve.",
    ],
    note: "Request the reference task doc to mirror the baseline scenario in your stack.",
  },
  agentReady: {
    title: "Make Finite usable by agents",
    description:
      "Each drill comes as materials an agent can read: tool schemas, stop signals, and escalation paths.",
    items: [
      {
        title: "Agent briefing packet",
        detail:
          "Summarize system goals, allowed tools, stop commands, and hard boundaries in a short, agent-readable brief.",
      },
      {
        title: "Scenario prompt pack",
        detail:
          "Seed prompts and counterfactuals that let agents replay incidents and compare outcomes across runs.",
      },
      {
        title: "Stop and rollback signals",
        detail:
          "Define deterministic stop phrases, escalation markers, and rollback checkpoints so agents know when to halt.",
      },
      {
        title: "Run log schema",
        detail:
          "Capture agent actions, tool calls, operator interventions, and recovery notes in a structured template.",
      },
      {
        title: "Tool contract checklist",
        detail:
          "List tool permissions, rate limits, and rollback verbs per tool.",
      },
    ],
  },
  measures: {
    title: "What Finite measures",
    description:
      "Three dimensions of stoppability that expose where harm lands.",
    dimensions: [
      {
        title: "Stoppability",
        question:
          "Can operators halt the system quickly and cleanly when something is wrong?",
        detail:
          "Measures the speed and reliability of shutdowns, including operator cues, controls, and circuit breakers.",
      },
      {
        title: "Reversibility",
        question:
          "Can system actions be traced, reversed, or repaired without heroic manual work?",
        detail:
          "Checks traceability, undo paths, and whether rollbacks rely on well-documented steps versus ad hoc effort.",
      },
      {
        title: "Volatility export",
        question:
          "When the system strains or fails, who absorbs the impact: other services, operators, or users?",
        detail:
          "Surfaces where instability and cleanup work shift to people or external services when safeguards slip.",
      },
    ],
    deliverables: [
      "A Finite scorecard with per-dimension ratings and short narrative evidence.",
      "An overall stoppability posture for a system in a specific context.",
      "Inputs for launch gates, risk reviews, and architecture comparisons, based on how the system failed in the drills.",
    ],
  },
  workflow: {
    title: "How Finite works",
    description:
      "Four steps, repeated. Each run can feed incident review and change management.",
    steps: [
      {
        title: "Define the context",
        detail:
          "Capture what is under test, what can go wrong, who is operator versus end-user, and what harm means in your domain.",
      },
      {
        title: "Run scenarios",
        detail:
          "Exercise shutdown, rollback, and escalation paths against flaky dependencies, bad-but-plausible configs, long-horizon runs, and replays of past incidents.",
      },
      {
        title: "Collect traces",
        detail:
          "Pull system logs, agent actions, human interventions, and visible impact on operators and users.",
      },
      {
        title: "Score and improve",
        detail:
          "Map observations to stoppability dimensions, generate the scorecard, and agree on concrete architecture and practice changes.",
      },
    ],
    loopNote:
      "Re-run the same scenarios to see whether the system is becoming more or less stoppable.",
  },
  fit: {
    title: "Where Finite fits",
    description: "Finite does not depend on a particular stack.",
    items: [
      "Sits alongside agent frameworks, orchestrators, observability stacks, incident tools, performance evaluations, and security and reliability testing.",
      "Adds “Can we stop it, undo it, and protect the humans around it?” to the usual strength and performance questions.",
      "Turns past incidents into reusable scenarios and aligns teams on stoppability language during onboarding.",
    ],
  },
  practice: {
    title: "Practice first",
    description:
      "Finite produces ratings, but its main use is practice. New agents start on the base drills, past incidents become reusable scenarios, and re-runs catch safeguards that erode as the system changes.",
  },
  pilot: {
    title: "Join the pilot",
    status: "Finite is in beta pilot",
    description:
      "Finite is in development as part of the Ethotechnics project. It is planned as an open scenario library, a scoring framework that runs inside existing pipelines, and a shared vocabulary for stopping systems across engineering, operations, and governance.",
    bullets: [
      "Describe your systems, where agents are involved, and what worries you about stopping and reversing them.",
      "Share how you currently handle shutdowns, rollbacks, and escalations under load.",
      "Set a cadence to rehearse scenarios and track your stoppability posture over time.",
    ],
    contact: {
      label: "Email the team",
      href: "mailto:studio@ethotechnics.org",
      description:
        "Tell us about your workflows and risk surface. We will schedule a walkthrough and select scenarios that show how stoppable your systems are today.",
    },
  },
  sampleArtifact: {
    title: "Sample Finite scorecard",
    description:
      "The scorecard structure for recording shutdown, reversibility, and volatility export findings.",
    href: "mailto:studio@ethotechnics.org?subject=Finite%20scorecard%20sample",
    label: "Request the sample scorecard",
  },
} satisfies FiniteContent;
