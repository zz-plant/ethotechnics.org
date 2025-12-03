export type FieldNoteEntry = {
  slug: string;
  title: string;
  summary: string;
  format: 'dispatch' | 'case-study' | 'signal';
  relatedTerms: string[];
  links?: string[];
};

export type FieldNotesContent = {
  pageTitle: string;
  pageDescription: string;
  permalink: string;
  sections: {
    title: string;
    description: string;
    format: FieldNoteEntry['format'];
  }[];
  entries: FieldNoteEntry[];
};

export const fieldNotesContent: FieldNotesContent = {
  pageTitle: 'Field Notes — Ethotechnics',
  pageDescription: 'Dispatches, reflections, and signals from ongoing practice in ethical technology.',
  permalink: '/field-notes',
  sections: [
    {
      title: 'Dispatches',
      description: 'Short updates from the field with direct links to glossary terms for reuse.',
      format: 'dispatch',
    },
    {
      title: 'Case studies',
      description: 'Long-form walkthroughs of service changes and what shifted for people.',
      format: 'case-study',
    },
    {
      title: 'Signals',
      description: 'Indicators and weak signals to monitor as systems evolve.',
      format: 'signal',
    },
  ],
  entries: [
    {
      slug: 'consent-refresh',
      title: 'Refreshing consent after policy shifts',
      summary:
        'Design sprint notes on re-requesting consent with clear exits and translated summaries.',
      format: 'dispatch',
      relatedTerms: ['consent-journey', 'safety-valve'],
      links: ['/library#progressive-consent'],
    },
    {
      slug: 'appeals-in-production',
      title: 'Appeal paths when the clock is ticking',
      summary: 'How a support team added in-product appeal flows without derailing delivery.',
      format: 'case-study',
      relatedTerms: ['safety-valve', 'burden-index'],
      links: ['/diagnostics#burden-modeler'],
    },
    {
      slug: 'maintenance-drift',
      title: 'Spotting maintenance drift early',
      summary: 'Lessons learned from simulating service degradation and renegotiating stewardship windows.',
      format: 'signal',
      relatedTerms: ['stewardship-window'],
      links: ['/diagnostics#maintenance-simulator'],
    },
  ],
};
