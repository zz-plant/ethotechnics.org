import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// Reuse common schemas
const pageCopySchema = z.object({
  pageTitle: z.string(),
  pageDescription: z.string(),
});

const actionSchema = z.object({
  label: z.string(),
  href: z.string(),
  variant: z.enum(['primary', 'ghost']).optional(),
  icon: z.string().optional(),
});

const featureCardSchema = z.object({
  title: z.string(),
  description: z.string(),
  icon: z.string().optional(),
  emphasis: z.boolean().optional(),
  eyebrow: z.string().optional(),
  pills: z.array(z.string()).optional(),
  actions: z.array(z.object({
    label: z.string(),
    href: z.string(),
  })).optional(),
});

const home = defineCollection({
  loader: file('src/content/home.json'),
  schema: pageCopySchema.extend({
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      subheadline: z.string(),
      lede: z.string(),
      map: z.string(),
      actions: z.array(actionSchema),
      quickLinks: z.array(z.object({ href: z.string(), label: z.string() })),
      metrics: z.array(z.object({ label: z.string(), value: z.string(), icon: z.string().optional() })),
      panel: z.object({ title: z.string(), description: z.string(), pills: z.array(z.string()) }),
      media: z.object({ src: z.string(), alt: z.string(), caption: z.string().optional() }),
    }),
    about: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      features: z.array(featureCardSchema),
    }),
    tracks: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      promptTitle: z.string(),
      promptNote: z.string(),
      prompts: z.array(z.object({
        question: z.string(),
        answer: z.string(),
        href: z.string(),
        label: z.string(),
      })),
      cards: z.array(featureCardSchema),
    }),
    features: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      cards: z.array(featureCardSchema),
    }),
    highlight: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      note: z.object({
        title: z.string(),
        description: z.string(),
        published: z.string(),
        updated: z.string().optional(),
        actions: z.array(z.string()),
        link: z.object({
          label: z.string(),
          href: z.string(),
        }),
      }),
      pills: z.array(z.string()),
    }),
    cta: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      body: z.string(),
      actions: z.array(actionSchema),
    }),
  }),
});

const glossaryEntrySchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string().nullable(),
  classes: z.array(z.string()).optional(),
  bodyHtml: z.string(),
  examples: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  resources: z.array(z.object({
    label: z.string(),
    href: z.string(),
    type: z.string(),
  })).optional(),
  relatedPatterns: z.array(z.string()).optional(),
});

const glossary = defineCollection({
  loader: file('src/content/glossary.json'),
  schema: pageCopySchema.extend({
    permalink: z.string(),
    territoryMap: z.array(z.object({
      id: z.string(),
      label: z.string(),
      tooltip: z.string(),
    })),
    categories: z.array(z.object({
      id: z.string(),
      heading: z.string(),
      descriptionHtml: z.string(),
      comingSoon: z.boolean(),
      entries: z.array(glossaryEntrySchema),
    })),
    starterTerms: z.array(z.object({ id: z.string(), label: z.string(), description: z.string() })),
    categoryHighlights: z.array(z.object({ id: z.string(), label: z.string(), description: z.string() })),
  }),
});

const library = defineCollection({
  loader: file('src/content/library.json'),
  schema: pageCopySchema.extend({
    permalink: z.string(),
    published: z.string(),
    quickStart: z.array(z.string()),
    recommended: z.object({
      title: z.string(),
      description: z.string(),
      items: z.array(z.object({ title: z.string(), description: z.string(), href: z.string() })),
    }),
    primer: z.array(z.object({
      title: z.string(),
      summary: z.string(),
      takeaways: z.array(z.string()),
    })),
    patterns: z.object({
      filters: z.array(z.object({
        slug: z.enum(['governance', 'design-ethics', 'policy']),
        label: z.string(),
        description: z.string(),
      })),
      entries: z.array(z.object({
        slug: z.string(),
        title: z.string(),
        summary: z.string(),
        filters: z.array(z.enum(['governance', 'design-ethics', 'policy'])),
        glossaryRefs: z.array(z.string()),
        cues: z.array(z.string()),
        diagnostics: z.array(z.string()),
        steps: z.array(z.string()),
        artifacts: z.array(z.object({ name: z.string(), purpose: z.string() })),
        example: z.object({ title: z.string(), description: z.string() }),
      })),
    }),
    syllabus: z.object({
      overview: z.string(),
      modules: z.array(z.object({
        title: z.string(),
        duration: z.string(),
        topics: z.array(z.string()),
        outcome: z.string(),
      })),
    }),
  }),
});

const startHere = defineCollection({
  loader: file('src/content/start-here.json'),
  schema: pageCopySchema.extend({
    permalink: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      description: z.string(),
      quickNote: z.string(),
      quickSummary: z.string(),
      deliverables: z.array(z.string()),
      panel: z.object({ title: z.string(), description: z.string() }),
      actions: z.array(z.object({
        label: z.string(),
        href: z.string(),
        ariaLabel: z.string().optional(),
        variant: z.enum(['primary', 'ghost']),
      })),
    }),
    anchorLinks: z.array(z.object({ href: z.string(), label: z.string() })),
    routes: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      cards: z.array(z.object({
        title: z.string(),
        description: z.string(),
        bestFor: z.string(),
        href: z.string(),
        tags: z.array(z.string()),
        recommendedTag: z.string().optional(),
        recommendedNote: z.string().optional(),
        time: z.string(),
      })),
    }),
    decisionGuide: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      prompts: z.array(z.object({
        question: z.string(),
        answer: z.string(),
        href: z.string(),
        label: z.string(),
      })),
    }),
    artifacts: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      previews: z.array(z.object({
        title: z.string(),
        description: z.string(),
        label: z.string(),
        href: z.string(),
        note: z.string(),
      })),
    }),
    framing: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      isList: z.array(z.string()),
      isNotList: z.array(z.string()),
    }),
    studio: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      bullets: z.array(z.string()),
      ctaLabel: z.string(),
      ctaHref: z.string(),
      ctaAriaLabel: z.string(),
    }),
    footerCta: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      primaryLabel: z.string(),
      primaryHref: z.string(),
      secondaryLabel: z.string(),
      secondaryHref: z.string(),
    }),
  }),
});

const fieldNotes = defineCollection({
  loader: file('src/content/field-notes.json'),
  schema: pageCopySchema.extend({
    permalink: z.string(),
    published: z.string(),
    latestUpdate: z.string(),
    highlight: z.object({
      title: z.string(),
      summary: z.string(),
      whyItMatters: z.string(),
      href: z.string(),
      ctaLabel: z.string(),
    }),
    sections: z.array(z.object({
      title: z.string(),
      description: z.string(),
      format: z.enum(['dispatch', 'case-study', 'signal']),
    })),
    entries: z.array(z.object({
      slug: z.string(),
      title: z.string(),
      summary: z.string(),
      format: z.enum(['dispatch', 'case-study', 'signal']),
      relatedTerms: z.array(z.string()),
      links: z.array(z.string()).optional(),
      published: z.string(),
    })),
  }),
});

const participation = defineCollection({
  loader: file('src/content/participation.json'),
  schema: pageCopySchema.extend({
    permalink: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      heading: z.string(),
      description: z.string(),
      anchorLinks: z.array(z.object({ href: z.string(), label: z.string() })),
      panel: z.object({
        title: z.string(),
        description: z.string(),
        eyebrow: z.string().optional(),
      }),
    }),
    pathways: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      tags: z.array(z.string()).optional(),
      actions: z.array(z.object({
        label: z.string(),
        href: z.string(),
        ariaLabel: z.string().optional(),
        detail: z.string().optional(),
      })),
      checklist: z.array(z.string()),
    })),
    intake: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      formatNote: z.string(),
      responseNote: z.string(),
      timelineNote: z.string(),
      privacyNote: z.string(),
      form: z.object({
        action: z.string(),
        submitLabel: z.string(),
        fields: z.array(z.object({
          id: z.string(),
          label: z.string(),
          type: z.enum(['text', 'email', 'textarea']),
          placeholder: z.string(),
          required: z.boolean().optional(),
        })),
      }),
    }),
    feedback: z.object({
      eyebrow: z.string(),
      title: z.string(),
      description: z.string(),
      actions: z.array(z.object({
        label: z.string(),
        href: z.string(),
        ariaLabel: z.string().optional(),
        detail: z.string().optional(),
      })),
    }),
  }),
});

export const collections = { home, glossary, library, startHere, fieldNotes, participation };
