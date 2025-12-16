import type { PageCopy } from './types';

export type Metric = {
  label: string;
  value: string;
  icon?: string;
  trend?: number[];
  trendLabel?: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  icon?: string;
  emphasis?: boolean;
  pills?: string[];
};

export type Panel = {
  title: string;
  description: string;
  pills: string[];
};

export type HeroAction = {
  label: string;
  href: string;
  variant: 'primary' | 'ghost';
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
    note: {
      title: string;
      description: string;
      actions: string[];
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
  pageTitle: 'Ethotechnics — Build technology people can trust',
  pageDescription:
    'Ethotechnics pairs open guidance with facilitated diagnostics so teams can deliver accountable, human-centered technology.',
  hero: {
    eyebrow: 'Ethics · Delivery · Stewardship',
    heading: 'Build technology people can trust.',
    subheadline: 'The Ethotechnics Institute shares pragmatic guidance for humane products and services.',
    lede:
      'We pair a public library of ethical delivery patterns with diagnostics that map risk, align teams, and protect the people you serve.',
    map:
      'Start with the Institute library and diagnostics. If you need deeper facilitation or delivery support, we can connect you with the <a href="https://ethotechnics.com/studio" rel="noreferrer">Studio</a>.',
    actions: [
      { label: 'Browse the library', href: '/library', variant: 'primary', icon: 'lucide:library' },
      { label: 'Book a diagnostic', href: '/diagnostics', variant: 'ghost', icon: 'lucide:activity-square' },
    ],
    metrics: [
      {
        label: 'Institute library',
        value: 'Open guides, playbooks, and charter',
        icon: 'lucide:book-open-check',
        trend: [12, 16, 18, 22, 27, 31],
        trendLabel: 'Library content growth over the last six releases',
      },
      {
        label: 'Diagnostics',
        value: 'Readiness labs and governance roadmaps',
        icon: 'lucide:stethoscope',
        trend: [8, 9, 11, 12, 15, 17],
        trendLabel: 'Teams completing diagnostics month over month',
      },
      {
        label: 'Partner Studio',
        value: 'Optional embedded support via ethotechnics.com',
        icon: 'lucide:heart-handshake',
        trend: [5, 6, 6, 7, 8, 9],
        trendLabel: 'Partner-led engagements supported by the Studio',
      },
    ],
    panel: {
      title: 'Where we plug in',
      description: 'Pick a track that matches your urgency. We can calibrate, facilitate, or co-lead.',
      pills: ['Readiness review', 'Accountability lab', 'Co-delivery partnership'],
    },
    media: {
      src: '/assets/ethotechnics-hero-map.svg',
      alt: 'An illustrated map showing research, governance, delivery, and stewardship linked together.',
      caption: 'Visualizing how research, governance, and delivery reinforce long-term stewardship.',
    },
  },
  about: {
    eyebrow: 'About the Institute',
    heading: 'Practical guidance for ethical technology.',
    body:
      'Ethotechnics documents the moves that keep digital products accountable—from the first interview to post-launch stewardship.',
    features: [
      {
        icon: 'lucide:bolt',
        title: 'Built for real teams',
        description:
          'Concise playbooks, annotated examples, and facilitation prompts tuned for cross-functional collaboration.',
      },
      {
        icon: 'lucide:compass',
        title: 'Wayfinding you can trust',
        description:
          'Navigation cues explain when to pause, who to involve, and how to make informed trade-offs—without slowing delivery.',
      },
      {
        icon: 'lucide:palette',
        title: 'Accessible by design',
        description: 'Plain-language explanations and visual summaries keep the library readable, inclusive, and easy to share.',
      },
    ],
  },
  features: {
    eyebrow: 'Focus areas',
    heading: 'Frameworks you can put to work.',
    body: 'Each guide is built to be actionable—checklists, prompts, and facilitation steps you can adapt quickly.',
    cards: [
      {
        title: 'Responsible product delivery',
        description:
          'Surface consent, safety, and accountability questions throughout discovery, build, and rollout.',
        emphasis: true,
        pills: ['Respectful defaults', 'Iterative safeguards', 'Accountable metrics'],
      },
      {
        title: 'Research and synthesis',
        description:
          'Field reports translate interviews, participatory sessions, and policy reviews into shareable patterns.',
      },
      {
        title: 'Governance you can explain',
        description: 'Decision records, data stewardship plans, and escalation paths that withstand scrutiny.',
      },
      {
        title: 'Tools and references',
        description: 'Checklists, workshop kits, and curated readings that help you operationalize ethical intent.',
      },
    ],
  },
  highlight: {
    eyebrow: 'Latest notes',
    heading: 'Practical recommendations for accountable systems.',
    body:
      'Bring these prompts to product reviews, governance meetings, or research debriefs to keep the team aligned on what care looks like.',
    note: {
      title: 'Design for consent, not just conversion.',
      description:
        'Pair your primary actions with transparent context: why you are asking, what happens next, and how to opt out without penalty.',
      actions: [
        'Label links and buttons honestly so people know where they are headed.',
        'Give people a reversible path; avoid dead ends or forced funnels.',
        'Show the data you collect and how long you keep it in plain language.',
      ],
    },
    pills: ['Respectful defaults', 'Community input', 'Long-term stewardship'],
  },
  cta: {
    eyebrow: 'Stay connected',
    heading: 'Follow the work at Ethotechnics.',
    body: 'Get notified when new essays, field notes, and facilitation kits go live. No spam—just pragmatic guidance.',
    actions: [
      { label: 'Browse the library', href: '/library', variant: 'primary', icon: 'lucide:library' },
      { label: 'Book a diagnostic', href: '/diagnostics', variant: 'ghost', icon: 'lucide:activity-square' },
    ],
  },
} satisfies HomeContent;
