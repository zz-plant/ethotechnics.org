import type { EvalLayer, EvalSuite, EvalTestCase } from "../../content/evals";
import { evalTestCases } from "../../content/eval-test-cases";
import { evalsContent } from "../../content/evals";

export const suiteOptions = evalsContent.suites.map((suite) => ({
  id: suite.id,
  slug: suite.slug,
  title: suite.title,
  layer: suite.layer,
  testCount: evalTestCases.filter((tc) => tc.suiteId === suite.id).length,
  estimatedTime: suite.estimatedTime,
}));

/** Layers in stack order, restricted to those a suite actually occupies. */
export const layerOptions: { id: EvalLayer; title: string }[] =
  evalsContent.evaluationStack.layers
    .filter((layer) => evalsContent.suites.some((s) => s.layer === layer.id))
    .map((layer) => ({ id: layer.id, title: layer.title }));

export const getTestCasesForSuite = (suiteSlug: string): EvalTestCase[] =>
  evalTestCases.filter((tc) => tc.suiteId === suiteSlug);

export const getSuiteForSlug = (slug: string): EvalSuite | undefined =>
  evalsContent.suites.find((s) => s.slug === slug);

export const maxScoreForScale = (scale: string): number => {
  switch (scale) {
    case "binary":
      return 1;
    case "0-3":
      return 3;
    case "0-5":
      return 5;
    case "0-10":
      return 10;
    default:
      return 1;
  }
};
