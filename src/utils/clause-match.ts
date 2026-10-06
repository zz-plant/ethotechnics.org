/**
 * Keyword matching of text against the clause register: which clauses share
 * the most distinctive words with a consultation, or with a topic someone
 * is writing a response on. It reads words, not meaning, so every result is
 * labeled as keyword-matched and has to be checked against the clause text.
 *
 * Deterministic: the same text and register always give the same clauses in
 * the same order. A word scores more the fewer clauses use it, so "appeal"
 * outweighs "system".
 */
import type { StandardClause, StandardEntry } from "../content/standards";

const STOPWORDS = new Set(
  (
    "about above after again against all also among and any are because been before being below between both but can cannot could does doing down during each either few for from further had has have having her here hers him his how include includes including into its itself just may might more most must new not now off once only other our ours out over own same shall she should some such than that the their theirs them then there these they this those through too under until upon use used uses using very was were what when where which while who whom why will with within without would you your " +
    // Words every consultation uses, which say nothing about its subject.
    "act acts agency agencies artificial commission comment comments consultation consultations department federal government intelligence notice notices office proposal proposals proposed propose public regulation regulations rule rules rulemaking section"
  ).split(" "),
);

/** A crude stem, so "appeals", "appealed", and "appealing" meet at "appeal". */
export const stem = (word: string): string => {
  let value = word.toLowerCase().replace(/'s$/, "");
  if (value.length > 4 && value.endsWith("ies"))
    value = `${value.slice(0, -3)}y`;
  else if (value.length > 5 && value.endsWith("ing"))
    value = value.slice(0, -3);
  else if (value.length > 4 && value.endsWith("ed")) value = value.slice(0, -2);
  else if (/(ss|x|z|ch|sh)es$/.test(value)) value = value.slice(0, -2);
  else if (value.length > 3 && value.endsWith("s") && !value.endsWith("ss"))
    value = value.slice(0, -1);
  if (value.length > 4 && value.endsWith("e")) value = value.slice(0, -1);
  return value;
};

/** The distinct stems of a text's content words, in first-seen order. */
export const keywordStems = (text: string): string[] => {
  const stems = new Set<string>();
  for (const word of text.toLowerCase().split(/[^a-z]+/)) {
    if (word.length < 3 || STOPWORDS.has(word)) continue;
    const value = stem(word);
    if (value.length >= 3 && !STOPWORDS.has(value)) stems.add(value);
  }
  return [...stems];
};

/** Everything a clause says, as one string: when, what, evidence, failure. */
export const clauseText = (clause: StandardClause): string =>
  [
    clause.condition,
    clause.obligation,
    clause.timeBound,
    ...clause.evidenceRequired.map((item) => item.replace(/[._]/g, " ")),
    ...(clause.failureModes ?? []),
  ].join(" ");

export interface ClauseMatch {
  clause: StandardClause;
  score: number;
  /** The shared stems, most distinctive first. */
  matched: string[];
}

/** The clauses that share the most distinctive words with `text`. */
export const matchClauses = (
  text: string,
  clauses: StandardClause[],
  limit = 5,
): ClauseMatch[] => {
  const indexed = clauses.map(
    (clause) => new Set(keywordStems(clauseText(clause))),
  );
  const documentFrequency = new Map<string, number>();
  for (const stems of indexed) {
    for (const value of stems) {
      documentFrequency.set(value, (documentFrequency.get(value) ?? 0) + 1);
    }
  }
  // Positive for any word a clause uses, however common: a word in every
  // clause still counts, if barely.
  const weight = (value: string) =>
    Math.log(
      (clauses.length + 1) / Math.max(1, documentFrequency.get(value) ?? 0),
    );

  const query = keywordStems(text);
  return clauses
    .map((clause, index) => {
      const matched = query
        .filter((value) => indexed[index].has(value))
        .sort((a, b) => weight(b) - weight(a) || a.localeCompare(b));
      const score = matched.reduce((sum, value) => sum + weight(value), 0);
      return { clause, score: Math.round(score * 1000) / 1000, matched, index };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ clause, score, matched }) => ({ clause, score, matched }));
};

/** "STD-02 §2.3", as the register and the objection record name a clause. */
export const clauseLabel = (clause: StandardClause): string =>
  `${clause.standardId} ${clause.displayId}`;

/**
 * A Markdown brief for a consultation response: the clauses that match the
 * topic, grouped by standard in order of their best match, each with its
 * obligation in one line and a permalink to the standard's clause register.
 */
export const renderSubmissionBrief = ({
  topic,
  matches,
  standards,
  site,
}: {
  topic: string;
  matches: ClauseMatch[];
  standards: Pick<
    StandardEntry,
    "id" | "slug" | "title" | "version" | "status"
  >[];
  site: URL;
}): string => {
  const lines = [
    `# Submission brief: ${topic}`,
    "",
    `Clauses from the Ethotechnics standards that share words with "${topic}", ranked by keyword match against the clause register. Read each in its standard before citing it. The standards are drafts; none binds anyone until adopted.`,
    "",
  ];
  if (matches.length === 0) {
    return [...lines, "No clause matched these keywords.", ""].join("\n");
  }

  const byStandard = new Map<string, ClauseMatch[]>();
  for (const match of matches) {
    const id = match.clause.standardId;
    byStandard.set(id, [...(byStandard.get(id) ?? []), match]);
  }
  for (const [id, group] of byStandard) {
    const standard = standards.find((entry) => entry.id === id);
    const page = standard
      ? new URL(`/standards/${standard.slug}`, site).toString()
      : new URL("/standards", site).toString();
    lines.push(
      standard
        ? `## ${id}: ${standard.title} (v${standard.version}, ${standard.status})`
        : `## ${id}`,
      "",
      page,
      "",
      ...group.map(
        ({ clause }) =>
          `- **${clauseLabel(clause)}** (${clause.requirementLevel}). When ${clause.condition}: ${clause.obligation}. ${page}#clause-register`,
      ),
      "",
    );
  }
  return lines.join("\n");
};
