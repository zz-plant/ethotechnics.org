export type PatternBundleEntry = {
  slug: string;
  title: string;
  summary: string;
  filters: string[];
  glossaryRefs: string[];
  cues: string[];
  diagnostics: string[];
  steps: string[];
  artifacts: { name: string; purpose: string }[];
  example: { title: string; description: string };
};
