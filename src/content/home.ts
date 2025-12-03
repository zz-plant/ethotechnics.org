export type Metric = {
  label: string;
  value: string;
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
};

export type HomeContent = {
  pageTitle: string;
  pageDescription: string;
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
  pageTitle: 'Lumen — Modern Astro starter',
  pageDescription:
    'A contemporary Astro 5 starter with an interactive navigation island and thoughtful defaults for marketing sites.',
  hero: {
    eyebrow: 'Built with Astro 5',
    heading: 'Launch a polished experience in record time.',
    lede:
      'Lumen pairs a crisp visual language with sensible defaults: responsive layout, accessible navigation, and flexible sections so you can ship confidently.',
    actions: [
      { label: 'Start a workspace', href: '#cta', variant: 'primary' },
      { label: 'Explore the stack', href: '#features', variant: 'ghost' },
    ],
    metrics: [
      { label: 'Performance', value: '99.9%' },
      { label: 'Build time', value: '< 1s' },
      { label: 'Handoff ready', value: 'Yes' },
    ],
    panel: {
      title: 'Realtime insights',
      description:
        'Track adoption, uptime, and product velocity from one place. Alerts use sensible defaults, and you can fine-tune thresholds without code changes.',
      pills: ['Zero-config deploys', 'Secure by default', 'Edge-ready'],
    },
  },
  about: {
    eyebrow: 'Why Lumen',
    heading: 'Modern ergonomics, thoughtful defaults.',
    body:
      'Astro islands keep critical interactions lean while content stays blazing fast. We focus on readability, contrast, and sensible spacing across devices.',
    features: [
      {
        icon: 'tabler:bolt',
        title: 'Performance-first',
        description:
          'Astro 5 ships zero JavaScript by default; we only hydrate what needs to be interactive—like this navigation island.',
      },
      {
        icon: 'tabler:compass',
        title: 'Accessible navigation',
        description: 'Keyboard-friendly controls, logical focus states, and clear landmarks keep visitors oriented and confident.',
      },
      {
        icon: 'tabler:palette',
        title: 'Editorial styling',
        description: 'Calibrated typography and gentle gradients pair well with product shots, dashboards, or case studies.',
      },
    ],
  },
  features: {
    eyebrow: 'Features',
    heading: 'Everything you need to ship confidently.',
    body: 'Opinionated spacing, adaptive grids, and flexible CTAs make it easy to tailor this starter to your story.',
    cards: [
      {
        title: 'Island-based navigation',
        description:
          'The top-level navigation runs as its own React island with hydration only when visible, balancing interactivity and performance.',
        emphasis: true,
        pills: ['Escape key support', 'Responsive layout', 'Intentional motion'],
      },
      {
        title: 'Composable sections',
        description:
          'Hero, feature grid, and CTA sections use semantic HTML and utility classes that can be repurposed for product or marketing stories.',
      },
      {
        title: 'Ready to extend',
        description: 'Add markdown content, CMS data, or API-backed components without reworking the layout foundation.',
      },
      {
        title: 'Typography system',
        description: 'Built on Inter with responsive scales, balanced line lengths, and subtle accent colors for clarity.',
      },
    ],
  },
  highlight: {
    eyebrow: 'Insights',
    heading: 'Practical recommendations baked in.',
    body:
      'Each element is tuned for usability: generous hit areas, high contrast, and content blocks that adapt gracefully to any breakpoint.',
    pills: ['Reusable components', 'Accessible defaults', 'Performance guardrails'],
  },
  cta: {
    eyebrow: 'Ready to move?',
    heading: 'Start faster with a clear design system.',
    body: 'Drop in your product narrative, swap in visuals, and deploy. The navigation island is ready for your brand.',
    actions: [
      { label: 'Back to top', href: '#top', variant: 'primary' },
      { label: 'Read Astro docs', href: 'https://docs.astro.build', variant: 'ghost' },
    ],
  },
} satisfies HomeContent;
