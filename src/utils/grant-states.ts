/**
 * The grant states the diagram on STD-08 draws, held to the schema by a test.
 *
 * The schema is the authority on which states exist; this list is the subset
 * the diagram lays out and the order it lays them in. If the schema gains a
 * state, the test fails until the diagram places it.
 */
export const DIAGRAM_STATES = [
  "allowed",
  "review_required",
  "suspended",
  "revoked",
] as const;

export type DiagramState = (typeof DIAGRAM_STATES)[number];
