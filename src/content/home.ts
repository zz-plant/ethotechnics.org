import type { PageCopy, PublishedContent } from './types';

export type Metric = {
  label: string;
  value: string;
  icon?: string;
  trend?: number[];
  trendLabel?: string;
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
  pageTitle: 'Ethotechnics — Build technology people can trust',
  pageDescription:
    'Ethotechnics pairs open guidance with facilitated diagnostics so teams can deliver accountable, human-centered technology.',
  hero: {
    eyebrow: 'Practical ethics for product teams',
    heading: 'Build technology people can trust.',
    subheadline: 'Clear guidance and programs for respectful, explainable choices.',
    lede:
      'Ethotechnics pairs an open library with guided diagnostics. Use the playbooks yourself or bring in facilitators when you need speed.',
    map:
      'See the <a href="/start-here">orientation page</a> for a quick map of the library and diagnostics. Everything is CC BY, and the <a href="https://ethotechnics.com/studio" rel="noreferrer">Studio</a> can step in when you need support.',
    actions: [
      { label: 'Start here', href: '/start-here', variant: 'primary', icon: 'lucide:map-pin' },
      { label: 'Browse the library', href: '/library', variant: 'ghost', icon: 'lucide:library' },
      { label: 'Book a diagnostic', href: '/diagnostics', variant: 'ghost', icon: 'lucide:activity-square' },
      {
        label: 'Join the Signals community',
        href: 'https://signals.ethotechnics.org',
        variant: 'ghost',
        icon: 'lucide:messages-square',
      },
    ],
    metrics: [
      {
        label: 'Open library',
        value: 'Guides, playbooks, and worksheets',
        icon: 'lucide:book-open-check',
        trend: [12, 16, 18, 22, 27, 31],
        trendLabel: 'Library content growth over the last six releases',
      },
      {
        label: 'Team diagnostics',
        value: 'Readiness reviews and governance roadmaps',
        icon: 'lucide:stethoscope',
        trend: [8, 9, 11, 12, 15, 17],
        trendLabel: 'Teams completing diagnostics month over month',
      },
      {
        label: 'Partner Studio',
        value: 'Optional embedded support with our partners',
        icon: 'lucide:heart-handshake',
        trend: [5, 6, 6, 7, 8, 9],
        trendLabel: 'Partner-led engagements supported by the Studio',
      },
    ],
    panel: {
      title: 'Where to start',
      description: 'Pick the track that fits your team today: self-serve guidance, diagnostics, or delivery support.',
      pills: ['Orientation', 'Guided diagnostic', 'Partner delivery'],
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
    body: 'Ethotechnics documents the steps that keep digital products respectful, accessible, and explainable.',
    features: [
      {
        icon: 'lucide:bolt',
        title: 'Built for real teams',
        description: 'Concise playbooks, annotated examples, and prompts that fit into day-to-day delivery.',
      },
      {
        icon: 'lucide:compass',
        title: 'Wayfinding you can trust',
        description: 'Clear cues for when to pause, who to involve, and how to make informed trade-offs without slowing delivery.',
      },
      {
        icon: 'lucide:palette',
        title: 'Accessible by design',
        description: 'Plain-language explanations and visuals keep the library easy to read and share.',
      },
      {
        icon: 'lucide:users',
        title: 'Built with the community',
        description: 'Peer feedback and practitioner evidence keep the library grounded in real-world delivery.',
        actions: [
          { label: 'Submit a field report', href: '/participate#field-reports' },
          { label: 'Host a peer review', href: '/participate#peer-review' },
          { label: 'Join monthly clinics', href: '/participate#clinics' },
        ],
      },
    ],
  },
  features: {
    eyebrow: 'Focus areas',
    heading: 'Frameworks you can put to work.',
    body: 'Each guide includes checklists, prompts, and facilitation steps you can adapt quickly.',
    cards: [
      {
        title: 'Responsible product delivery',
        description:
          'Keep consent, safety, and accountability visible throughout discovery, build, and rollout.',
        emphasis: true,
        pills: ['Respectful defaults', 'Iterative safeguards', 'Accountable metrics'],
      },
      {
        title: 'Research and synthesis',
        description:
          'Field reports translate interviews, participatory sessions, and policy reviews into shareable patterns.',
        actions: [
          { label: 'Share a case study', href: '/participate#field-reports' },
          { label: 'Contribute evidence', href: '/participate#peer-review' },
        ],
      },
      {
        title: 'Governance you can explain',
        description: 'Decision records, data stewardship plans, and escalation paths you can share with stakeholders.',
      },
      {
        title: 'Tools and references',
        description: 'Checklists, workshop kits, and curated readings that make ethical intent actionable.',
        actions: [
          { label: 'Join monthly clinics', href: '/participate#clinics' },
          { label: 'Send feedback', href: '/participate#feedback' },
        ],
      },
    ],
  },
  highlight: {
    eyebrow: 'Latest notes',
    heading: 'Practical recommendations for accountable systems.',
    body: 'Use these prompts in reviews or debriefs to keep everyone aligned on what care looks like.',
    note: {
      title: 'Design for consent, not just conversion.',
      description:
        'Pair every major action with clear context: why you are asking, what happens next, and how to opt out without penalty.',
      published: '2024-10-01T00:00:00Z',
      actions: [
        'Label links and buttons honestly so people know where they are headed.',
        'Give people a reversible path—avoid dead ends or forced funnels.',
        'Show the data you collect and how long you keep it in plain language.',
      ],
      link: {
        label: 'Read all Field Notes',
        href: '/field-notes',
      },
    },
    pills: ['Respectful defaults', 'Community input', 'Long-term stewardship'],
  },
  cta: {
    eyebrow: 'Stay connected',
    heading: 'Follow the work at Ethotechnics.',
    body: 'Get notified when new essays, field notes, and facilitation kits go live. No spam—just practical guidance.',
    actions: [
      { label: 'Start here', href: '/start-here', variant: 'primary', icon: 'lucide:map-pin' },
      { label: 'Browse the library', href: '/library', variant: 'ghost', icon: 'lucide:library' },
      { label: 'Book a diagnostic', href: '/diagnostics', variant: 'ghost', icon: 'lucide:activity-square' },
    ],
  },
} satisfies HomeContent;
