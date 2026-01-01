export interface NavLink {
  href: string;
  label: string;
  description?: string;
  primary?: boolean;
}

export interface NavSection {
  heading: string;
  description: string;
  links: NavLink[];
}

export interface NavAction {
  href: string;
  label: string;
  variant: 'primary' | 'ghost' | 'ghost-compact';
  icon?: string;
  rel?: string;
  target?: string;
}

export const navSections: NavSection[] = [
  {
    heading: 'Start here',
    description: 'Pick the right entry point for diagnostics, the library, or the Studio.',
    links: [
      {
        href: '/start-here',
        label: 'Start here',
        description: 'Orientation for diagnostics, library routes, and Studio off-ramps.',
      },
    ],
  },
  {
    heading: 'Explore',
    description: 'Reference materials tuned for fast sharing and reuse.',
    links: [
      {
        href: '/library',
        label: 'Library',
        description: 'Primers, patterns, and syllabus modules with stable permalinks.',
      },
      {
        href: '/syllabus',
        label: 'Syllabus hub',
        description: 'Track module completion, knowledge checks, and shareable certificates.',
      },
      {
        href: '/glossary',
        label: 'Glossary',
        description: 'Shared vocabulary for moral system design and governance.',
      },
      {
        href: '/field-notes',
        label: 'Field notes',
        description: 'Applied notes and walkthroughs from ongoing research.',
      },
    ],
  },
  {
    heading: 'Programs',
    description: 'Initiatives led by the Institute and collaborators.',
    links: [
      {
        href: '/institute',
        label: 'Institute',
        description: 'Training cohorts, facilitation kits, and stewardship guidance.',
      },
      {
        href: '/research',
        label: 'Research',
        description: 'Agenda, collaborations, and studies shaping the library.',
      },
      {
        href: '/finite',
        label: 'Finite [Beta]',
        description: 'Stoppability drills and evaluations for AI-enabled systems.',
      },
    ],
  },
  {
    heading: 'Diagnostics',
    description: 'Benchmarks, measurements, and system health checks.',
    links: [
      {
        href: '/diagnostics',
        label: 'Diagnostics',
        description: 'Reliability and burden modeling tools you can run today.',
      },
    ],
  },
];

export const navActions: NavAction[] = [
  {
    href: '/start-here',
    label: 'Start here',
    variant: 'primary',
  },
  {
    href: '/institute',
    label: 'Join the Institute',
    variant: 'ghost',
  },
  {
    href: '/field-notes',
    label: 'Read field notes',
    variant: 'ghost',
  },
  {
    href: 'https://signals.ethotechnics.org',
    label: 'Signals newsletter',
    variant: 'ghost-compact',
    icon: 'lucide:arrow-up-right',
    rel: 'noreferrer',
    target: '_blank',
  },
];

const selectPrimaryLink = (section: NavSection) =>
  section.links.find((link) => link.primary) ?? section.links[0];

export const navPrimaryLinks: NavLink[] = navSections
  .map(selectPrimaryLink)
  .filter((link): link is NavLink => Boolean(link));
