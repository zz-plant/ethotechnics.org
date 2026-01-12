import type { APIRoute } from "astro";

import { validatorsContent } from "../../content/validators";

export const GET: APIRoute = () => {
  const validators = validatorsContent.validators.map((validator) => ({
    id: validator.id,
    title: validator.title,
    description: validator.description,
    standardRef: validator.standardRef,
    href: `${validatorsContent.permalink}/${validator.slug}`,
    inputs: validator.inputs,
    thresholds: validator.thresholds,
    clauseRefs: validator.clauseRefs,
    mechanismRefs: validator.mechanismRefs,
    outputSchema: validator.outputSchema,
  }));

  const payload = {
    meta: {
      generatedAt: new Date().toISOString(),
      count: validators.length,
      permalink: validatorsContent.permalink,
    },
    validators,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
};
