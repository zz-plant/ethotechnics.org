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
    highlight: string;
    bullets: string[];
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
  pageTitle: "Finite [Beta] — Stoppability drills for AI-enabled systems",
  pageDescription:
    "Finite is an evaluation and training environment for stoppable systems that can halt, reverse, and recover without exporting harm to people.",
  permalink: "/finite",
  hero: {
    eyebrow: "Finite [Beta]",
    heading: "Finite",
    lede: "An evaluation and training environment for stoppable systems that can halt, reverse, and recover without dumping failure onto humans.",
    summary:
      "Most AI benchmarks reward power. Finite measures how stoppable a system is—and who pays when it fails.",
    highlight: "Scroll to explore",
    bullets: [
      "Run stoppability drills that show whether operators can halt AI-enabled systems quickly and cleanly.",
      "Trace and reverse actions so recovery work does not become heroic, manual cleanup.",
      "See where volatility is exported to people, other services, or users before incidents grow.",
    ],
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
    description: "Stop, reverse, and protect the people around AI systems.",
    body: "Teams are wiring agents into support, operations, finance, civic services, and internal tools. We know how to push them to do more. Finite gives language and drills to stop systems under stress, undo the harm, and see who absorbs the cleanup. The suite turns hidden maintenance work into a first-class signal so stoppability, reversibility, and human impact are visible before launch—not after an incident.",
  },
  useCases: {
    title: "When to use Finite",
    description: "Pick the drills and traces that match your environment.",
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
    eyebrow: "Start Finite",
    title: "Three steps to begin a stoppability drill.",
    description:
      "Use these steps to decide whether Finite fits your system and timeline.",
    steps: [
      "Name the system or workflow you want to test, plus one recent incident or near-miss.",
      "Identify who can halt or roll back the system today—and where that ownership is unclear.",
      "Draft an agent brief with tool permissions, stop signals, and escalation rules.",
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
      "Use the canonical ledger containment drill to align metrics, runs, and explorer fixtures.",
    bullets: [
      "Read the scenario narrative, I/O, tools, stoppability checks, and metrics captured for the baseline task.",
      "Re-run the drill to compare stoppability posture as safeguards and rollback paths evolve.",
    ],
    note: "Request the reference task doc to mirror the baseline scenario in your stack.",
  },
  agentReady: {
    title: "Make Finite usable by agents",
    description:
      "Finite turns drills into agent-ready materials so AI systems can participate safely and consistently.",
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
          "Capture agent actions, operator interventions, and recovery notes in a structured template that feeds the scorecard.",
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
      "Guidance for launch gates, risk review inputs, and architecture comparisons centered on how systems fail.",
    ],
  },
  workflow: {
    title: "How Finite works",
    description:
      "A short loop you can connect to incidents and change management.",
    steps: [
      {
        title: "Define the context",
        detail:
          "Capture what is under test, what can go wrong, who is operator versus end-user, and what harm means in your domain.",
      },
      {
        title: "Run scenarios",
        detail:
          "Exercise shutdown, rollback, and escalation paths—from flaky dependencies and bad-but-plausible configs to long-horizon runs and past incident replays.",
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
      "Teams re-run the same scenarios to see whether their systems are becoming more—or less—stoppable.",
  },
  fit: {
    title: "Where Finite fits",
    description: "Stack-agnostic and designed for people-centered operations.",
    items: [
      "Sits alongside agent frameworks, orchestrators, observability stacks, incident tools, performance evaluations, and security and reliability testing.",
      "Adds “Can we stop it, undo it, and protect the humans around it?” to the usual strength and performance questions.",
      "Turns past incidents into reusable scenarios and aligns teams on stoppability language during onboarding.",
    ],
  },
  practice: {
    title: "Practice, not just a score",
    description:
      "Finite produces ratings, but its main use is a practice loop: onboard new agents with base drills, turn past incidents into reusable scenarios, and re-run tests to catch eroding safeguards as systems evolve.",
  },
  pilot: {
    title: "Join the pilot",
    status: "Piloting Finite with allied teams",
    description:
      "Finite is in development as part of the Ethotechnics project: an open, extensible scenario library, a scoring framework that fits existing pipelines, and a shared language about system mortality across engineering, operations, and governance.",
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
      "Preview the stoppability scorecard structure teams use to document shutdown, reversibility, and volatility export findings.",
    href: "mailto:studio@ethotechnics.org?subject=Finite%20scorecard%20sample",
    label: "Request the sample scorecard",
  },
} satisfies FiniteContent;
