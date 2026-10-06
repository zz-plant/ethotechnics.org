/**
 * A link that opens the objection form on GitHub with the standard, the
 * clause, and the title already filled in. The query keys are the field ids
 * in .github/ISSUE_TEMPLATE/objection.yml; GitHub prefills a form field from
 * the query parameter named after its id.
 */
export const REPOSITORY_URL = "https://github.com/zz-plant/ethotechnics.org";
export const OBJECTION_TEMPLATE = "objection.yml";
/** The blank objection form, for a page that names no clause. */
export const OBJECTION_FORM_URL = `${REPOSITORY_URL}/issues/new?template=${OBJECTION_TEMPLATE}`;
/** Every objection, open and closed. */
export const OBJECTION_ISSUES_URL = `${REPOSITORY_URL}/issues?q=label%3Aobjection`;

export const objectionTitle = (standardId: string, clauseId: string): string =>
  `Objection: ${standardId} ${clauseId}`;

export const objectionIssueUrl = (
  standardId: string,
  clauseId: string,
): string => {
  const query = [
    ["template", OBJECTION_TEMPLATE],
    ["standard", standardId],
    ["clause", clauseId],
    ["title", objectionTitle(standardId, clauseId)],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `${REPOSITORY_URL}/issues/new?${query}`;
};
