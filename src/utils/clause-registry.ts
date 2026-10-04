/**
 * The clause registry in src/content/standards.ts and the normative MDX are
 * two hands writing the same clauses, and they drift: a registry row can
 * outlive the clause it described, and a document can grow clauses the
 * registry never learned. Anything that presents the registry as "the
 * clauses of this standard" — the register above the text, the count in the
 * catalogue — has to check the two agree first, and count from the document
 * when they do not.
 */
import { standardClauses } from "../content/standards";

const CLAUSE_MARK = /standard-clause-id">(§\d+\.\d+)</g;

/** Clause ids as the document itself marks them, in document order. */
export const documentClauseIds = (body: string): string[] =>
  Array.from(body.matchAll(CLAUSE_MARK), (match) => match[1]);

export interface RegistryComparison {
  /** Registry rows with no marked clause in the document. */
  registryOnly: string[];
  /** Marked clauses the registry has no row for. */
  documentOnly: string[];
  matches: boolean;
}

export const compareRegistryToDocument = (
  standardId: string,
  body: string,
): RegistryComparison => {
  const registry = (standardClauses[standardId] ?? []).map(
    (clause) => clause.displayId,
  );
  const document = new Set(documentClauseIds(body));
  const registrySet = new Set(registry);
  const registryOnly = registry.filter((id) => !document.has(id));
  const documentOnly = [...document].filter((id) => !registrySet.has(id));
  return {
    registryOnly,
    documentOnly,
    matches:
      registry.length > 0 &&
      registryOnly.length === 0 &&
      documentOnly.length === 0,
  };
};
