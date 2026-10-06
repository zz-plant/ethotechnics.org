/**
 * Prints a Markdown submission brief for a consultation response: the
 * clauses that match a topic, with their ids, obligations, and permalinks.
 *
 *   bun run presence:brief -- appeal deadline
 *   bun run presence:brief -- --limit 15 automated benefit decisions
 *
 * The same keyword matcher the weekly watch uses (src/utils/clause-match.ts).
 */
import { standardClauses, standardsContent } from "../../src/content/standards";
import {
  matchClauses,
  renderSubmissionBrief,
} from "../../src/utils/clause-match";

const args = process.argv.slice(2);
const limitIndex = args.indexOf("--limit");
const limit = limitIndex > -1 ? Number(args[limitIndex + 1]) : 10;
const words = args.filter(
  (arg, index) =>
    arg !== "--limit" && (limitIndex === -1 || index !== limitIndex + 1),
);

if (words.length === 0 || !Number.isInteger(limit) || limit < 1) {
  console.error("Usage: bun run presence:brief -- [--limit N] <keywords...>");
  process.exit(2);
}

const topic = words.join(" ");
process.stdout.write(
  renderSubmissionBrief({
    topic,
    matches: matchClauses(topic, Object.values(standardClauses).flat(), limit),
    standards: standardsContent.standards,
    site: new URL("https://ethotechnics.org"),
  }),
);
