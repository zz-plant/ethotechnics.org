import { describe, expect, it } from 'vitest';

import { homeContent } from '@/content/home';

describe('home content', () => {
  it('includes hero heading text', () => {
    expect(homeContent.hero.heading).toContain('Ethotechnics Institute');
  });
});
