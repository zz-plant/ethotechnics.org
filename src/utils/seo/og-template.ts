import { resolveRouteProfile, type OgTemplate } from "./route-type";

const OG_TEMPLATES = [
  "default",
  "home",
  "standards",
  "glossary",
  "mechanisms",
  "editorial",
] as const satisfies readonly OgTemplate[];

const isOgTemplate = (value: string): value is OgTemplate =>
  OG_TEMPLATES.includes(value as OgTemplate);

const inferOgTemplateFromPath = (path?: string): OgTemplate =>
  resolveRouteProfile(path ?? "/").ogTemplate;

const resolveOgTemplate = (template?: string, path?: string): OgTemplate => {
  const normalizedTemplate = template?.trim().toLowerCase();
  if (normalizedTemplate && isOgTemplate(normalizedTemplate)) {
    return normalizedTemplate;
  }

  return inferOgTemplateFromPath(path);
};

export {
  OG_TEMPLATES,
  inferOgTemplateFromPath,
  isOgTemplate,
  resolveOgTemplate,
};
export type { OgTemplate };
