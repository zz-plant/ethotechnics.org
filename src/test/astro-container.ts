import { experimental_AstroContainer } from 'astro/container';
import { JSDOM } from 'jsdom';

const defaultSite = new URL('https://ethotechnics.org');

export async function createAstroContainer(site = defaultSite) {
  const container = await experimental_AstroContainer.create({
    astroConfig: { site: site.toString() },
  });

  return container;
}

export function parseHtml(html: string): Document {
  return new JSDOM(html).window.document;
}
