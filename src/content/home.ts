import type { PageCopy, PublishedContent } from "./types";

export type Metric = {
  label: string;
  value: string;
  icon?: string;
};

export type FeatureAction = {
  label: string;
  href: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon?: string;
  emphasis?: boolean;
  eyebrow?: string;
  pills?: string[];
  actions?: FeatureAction[];
};

export type Panel = {
  title: string;
  description: string;
  pills: string[];
};

export type HeroAction = {
  label: string;
  href: string;
  variant: "primary" | "ghost";
  icon?: string;
};

export type HeroMedia = {
  src: string;
  alt: string;
  caption?: string;
};

export type HomeContent = PageCopy & {
  hero: {
    eyebrow: string;
    heading: string;
    subheadline: string;
    lede: string;
    map: string;
    actions: HeroAction[];
    quickLinks: {
      href: string;
      label: string;
    }[];
    metrics: Metric[];
    panel: Panel;
    media: HeroMedia;
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string;
    features: FeatureCard[];
  };
  tracks: {
    eyebrow: string;
    heading: string;
    body: string;
    promptTitle: string;
    promptNote: string;
    prompts: {
      question: string;
      answer: string;
      href: string;
      label: string;
    }[];
    cards: FeatureCard[];
  };
  features: {
    eyebrow: string;
    heading: string;
    body: string;
    cards: FeatureCard[];
  };
  highlight: {
    eyebrow: string;
    heading: string;
    body: string;
    note: PublishedContent & {
      title: string;
      description: string;
      actions: string[];
      link: {
        label: string;
        href: string;
      };
    };
    pills: string[];
  };
  cta: {
    eyebrow: string;
    heading: string;
    body: string;
    actions: HeroAction[];
  };
};

export const homeContent = {
  pageTitle: "Ethotechnics — Build technology people can trust",
  pageDescription:
    "Ethotechnics pairs open guidance with facilitated diagnostics so teams can deliver accountable, human-centered technology.",
  hero: {
    eyebrow: "Practical ethics for product teams",
    heading: "Build technology people can trust.",
    subheadline:
      "Start with the orientation for respectful, explainable choices.",
    lede: "Use the Start Here map to choose your first step, then go deeper with the library or diagnostics as needed.",
    map: 'Start with the <a href="/start-here">orientation page</a> for the fastest path through the library and diagnostics. Everything is CC BY, and the <a href="https://ethotechnics.com/studio" rel="noreferrer">Studio</a> can step in when you need hands-on support.',
    actions: [
      {
        label: "Start here",
        href: "/start-here",
        variant: "primary",
        icon: "lucide:map-pin",
      },
      {
        label: "Explore the library",
        href: "/library",
        variant: "ghost",
        icon: "lucide:library",
      },
    ],
    quickLinks: [
      { href: "#pathways", label: "Pathways" },
      { href: "#about", label: "About" },
      { href: "#features", label: "Focus areas" },
      { href: "#insights", label: "Insights" },
    ],
    metrics: [
      {
        label: "Open library",
        value: "Guides, playbooks, and worksheets",
        icon: "lucide:book-open-check",
      },
      {
        label: "Team diagnostics",
        value: "Readiness reviews and governance roadmaps",
        icon: "lucide:stethoscope",
      },
      {
        label: "Partner Studio",
        value: "Optional embedded support with our partners",
        icon: "lucide:heart-handshake",
      },
    ],
    panel: {
      title: "Where to start",
      description:
        "Pick the track that fits your team today: self-serve guidance, diagnostics, or delivery support.",
      pills: ["Orientation", "Guided diagnostic", "Partner delivery"],
    },
    media: {
      src: "/assets/ethotechnics-hero-map.svg",
      alt: "An illustrated map showing research, governance, delivery, and stewardship linked together.",
      caption:
        "Visualizing how research, governance, and delivery reinforce long-term stewardship.",
    },
  },
  about: {
    eyebrow: "About the Institute",
    heading: "Practical guidance for ethical technology.",
    body: "Ethotechnics documents the steps that keep digital products respectful, accessible, and explainable.",
    features: [
      {
        icon: "lucide:bolt",
        title: "Built for real teams",
        description:
          "Concise playbooks and prompts that fit day-to-day delivery.",
      },
      {
        icon: "lucide:compass",
        title: "Wayfinding you can trust",
        description:
          "Clear cues on when to pause, who to involve, and how to make informed trade-offs.",
      },
      {
        icon: "lucide:palette",
        title: "Accessible by design",
        description:
          "Plain-language explanations and visuals keep the library easy to share.",
      },
      {
        icon: "lucide:users",
        title: "Built with the community",
        description:
          "Peer feedback and practitioner evidence keep the library grounded in real-world work.",
        actions: [
          {
            label: "Submit a field report",
            href: "/participate#field-reports",
          },
          { label: "Host a peer review", href: "/participate#peer-review" },
          { label: "Join monthly clinics", href: "/participate#clinics" },
        ],
      },
    ],
  },
  tracks: {
    eyebrow: "Choose your path",
    heading: "Pick the right entry point for your team.",
    body: "Start with the track that matches your urgency, then deepen into research and diagnostics as needed.",
    promptTitle: "Not sure where to begin?",
    promptNote: "Choose the prompt that matches your current decision, then explore related playbooks and tools.",
    prompts: [
      {
        question: "Need a fast answer for a live decision?",
        answer: "Start with a diagnostic and leave with a shareable readout.",
        href: "/diagnostics",
        label: "Run a diagnostic",
      },
      {
        question: "Looking for reusable guidance or language?",
        answer:
          "Browse the library for primers, glossary anchors, and patterns.",
        href: "/library",
        label: "Open the library",
      },
      {
        question: "Need facilitation or a partner to execute?",
        answer: "Bring in the Studio for co-delivery and mediation support.",
        href: "https://ethotechnics.com/studio",
        label: "Visit the Studio",
      },
    ],
    cards: [
      {
        icon: "lucide:map",
        eyebrow: "I need a fast orientation",
        title: "Navigate the library",
        description:
          "Quick orientation and reusable playbooks for teams that need a clear, low-friction start.",
        pills: ["Start here", "Library map"],
        actions: [
          { label: "Orientation page", href: "/start-here" },
          { label: "Browse the library", href: "/library" },
        ],
      },
      {
        icon: "lucide:activity-square",
        eyebrow: "I need a decision fast",
        title: "Run a diagnostic",
        description:
          "Structured reviews that turn risk into a decision-ready readout you can share.",
        pills: ["Readiness reviews", "Governance roadmaps"],
        actions: [
          { label: "Book a diagnostic", href: "/diagnostics" },
          { label: "See Institute vs. Studio", href: "/institute" },
        ],
      },
      {
        icon: "lucide:users",
        eyebrow: "I want to contribute",
        title: "Collaborate and contribute",
        description:
          "Contribute evidence, join peer review, and stay connected to new releases.",
        pills: ["Field reports", "Peer review", "Signals newsletter"],
        actions: [
          {
            label: "Submit a field report",
            href: "/participate#field-reports",
          },
          { label: "Join peer review", href: "/participate#peer-review" },
          {
            label: "Follow the Signals feed",
            href: "https://signals.ethotechnics.org",
          },
        ],
      },
    ],
  },
  features: {
    eyebrow: "Focus areas",
    heading: "Frameworks you can put to work.",
    body: "Each guide includes checklists, prompts, and facilitation steps you can adapt quickly.",
    cards: [
      {
        title: "Responsible product delivery",
        description:
          "Keep consent, safety, and accountability visible throughout discovery, build, and rollout.",
        emphasis: true,
        pills: [
          "Respectful defaults",
          "Iterative safeguards",
          "Accountable metrics",
        ],
      },
      {
        title: "Research and synthesis",
        description:
          "Field reports translate interviews, participatory sessions, and policy reviews into shareable patterns.",
        actions: [
          { label: "Share a case study", href: "/participate#field-reports" },
          { label: "Contribute evidence", href: "/participate#peer-review" },
        ],
      },
      {
        title: "Governance you can explain",
        description:
          "Decision records, data stewardship plans, and escalation paths you can share with stakeholders.",
      },
      {
        title: "Tools and references",
        description:
          "Checklists, workshop kits, and curated readings that make ethical intent actionable.",
        actions: [
          { label: "Join monthly clinics", href: "/participate#clinics" },
          { label: "Send feedback", href: "/participate#feedback" },
        ],
      },
    ],
  },
  highlight: {
    eyebrow: "Latest notes",
    heading: "Practical recommendations for accountable systems.",
    body: "Use these prompts in reviews or debriefs to keep everyone aligned on what care looks like.",
    note: {
      title: "Design for consent, not just conversion.",
      description:
        "Pair every major action with clear context: why you are asking, what happens next, and how to opt out without penalty.",
      published: "2024-10-01T00:00:00Z",
      actions: [
        "Label links and buttons honestly so people know where they are headed.",
        "Give people a reversible path—avoid dead ends or forced funnels.",
        "Show the data you collect and how long you keep it in plain language.",
      ],
      link: {
        label: "Read all Field Notes",
        href: "/field-notes",
      },
    },
    pills: ["Respectful defaults", "Community input", "Long-term stewardship"],
  },
  cta: {
    eyebrow: "Stay connected",
    heading: "Start with the orientation.",
    body: "Use the Start Here map to choose your next step, then explore the library or diagnostics when you need more depth.",
    actions: [
      {
        label: "Start here",
        href: "/start-here",
        variant: "primary",
        icon: "lucide:map-pin",
      },
      {
        label: "Explore the library",
        href: "/library",
        variant: "ghost",
        icon: "lucide:library",
      },
      {
        label: "Explore diagnostics",
        href: "/diagnostics",
        variant: "ghost",
        icon: "lucide:activity-square",
      },
    ],
  },
} satisfies HomeContent;
