import type { PageCopy } from './types';

export type Metric = {
  label: string;
  value: string;
  icon?: string;
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

export type HomeContent = PageCopy & {
  hero: {
    eyebrow: string;
    heading: string;
    lede: string;
    actions: HeroAction[];
    metrics: Metric[];
    panel: Panel;
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
  pageTitle: 'Ethotechnics — Ethical technology in practice',
  pageDescription:
    'Ethotechnics.org shares essays, field notes, and frameworks for building technology that keeps people at the center.',
  hero: {
    eyebrow: 'Ethics · Design · Governance',
    heading: 'Technology should serve people — not the other way around.',
    lede:
      'Ethotechnics explores practical ways to align digital products with human dignity, informed consent, and accountable systems.',
    actions: [
      { label: 'Browse the library', href: '/library', variant: 'primary', icon: 'lucide:library' },
      {
        label: 'Bring diagnostics into your org',
        href: '/diagnostics',
        variant: 'ghost',
        icon: 'lucide:activity-square',
      },
    ],
    metrics: [
      { label: 'Perspective', value: 'Interdisciplinary', icon: 'lucide:globe-2' },
      { label: 'Formats', value: 'Essays & frameworks', icon: 'lucide:scroll-text' },
      { label: 'Focus', value: 'Human outcomes', icon: 'lucide:heart-handshake' },
    ],
    panel: {
      title: 'Field notes for responsible teams',
      description:
        'Short, actionable takeaways from research, design practice, and governance work you can adapt to your context.',
      pills: ['Consent-aware defaults', 'Accountability by design', 'Resilient infrastructure'],
    },
  },
  about: {
    eyebrow: 'About Ethotechnics',
    heading: 'Practical guidance for ethical technology.',
    body:
      'We document how teams can balance innovation with responsibility, blending research, design strategy, and policy thinking.',
    features: [
      {
        icon: 'lucide:bolt',
        title: 'Grounded in practice',
        description:
          'Case studies, heuristics, and debriefs from real-world services—not abstract ideals—so you can see how principles land.',
      },
      {
        icon: 'lucide:compass',
        title: 'Wayfinding for teams',
        description:
          'Navigation cues, facilitation prompts, and decision trees to help cross-functional groups move responsibly together.',
      },
      {
        icon: 'lucide:palette',
        title: 'Readable and humane',
        description: 'Plain-language explainers, annotated references, and visuals tuned for accessibility and shared understanding.',
      },
    ],
  },
  features: {
    eyebrow: 'Focus areas',
    heading: 'Frameworks you can put to work.',
    body: 'Each piece is built to be actionable—checklists, prompts, and facilitation steps you can adapt quickly.',
    cards: [
      {
        title: 'Responsible product delivery',
        description:
          'From discovery to rollout, we surface ethical questions, risk patterns, and mitigations that keep people safe.',
        emphasis: true,
        pills: ['Informed consent', 'Iterative safeguards', 'Accountable metrics'],
      },
      {
        title: 'Research and synthesis',
        description:
          'Field reports translate interviews, participatory sessions, and policy reviews into patterns anyone can reuse.',
      },
      {
        title: 'Governance you can explain',
        description: 'Templates for decision records, data stewardship plans, and escalation paths that earn trust.',
      },
      {
        title: 'Tools and references',
        description: 'Curated resources, workshop kits, and checklists to help teams operationalize ethical intent.',
      },
    ],
  },
  highlight: {
    eyebrow: 'Latest notes',
    heading: 'Practical recommendations for accountable systems.',
    body:
      'Tactics, prompts, and checklists you can bring to product reviews, governance meetings, or research debriefs.',
    pills: ['Respectful defaults', 'Community input', 'Long-term stewardship'],
  },
  cta: {
    eyebrow: 'Stay connected',
    heading: 'Follow the work at Ethotechnics.',
    body: 'Get notified when new essays, field notes, and facilitation kits go live. No spam—just pragmatic guidance.',
    actions: [
      { label: 'Browse the library', href: '/library', variant: 'primary', icon: 'lucide:library' },
      {
        label: 'Bring diagnostics into your org',
        href: '/diagnostics',
        variant: 'ghost',
        icon: 'lucide:activity-square',
      },
    ],
  },
} satisfies HomeContent;
