import { describe, expect, it } from "bun:test";

import {
  formatFinding,
  parseLedgerIds,
  scanSite,
  scanText,
} from "./presupposing-copy";

/**
 * Published copy answers only objections a visitor has raised; the ledger is
 * docs/visitor-objections.md.
 */

const ledger = parseLedgerIds(
  "| id | Objection | Evidence | Answer |\n| --- | --- | --- | --- |\n| VO-001 | Is this a sales pitch? | Inbox, 2026-11-01 | /about#faq |\n",
);

describe("presupposing copy check", () => {
  it("flags a sentence that answers a doubt nobody raised", () => {
    const findings = scanText(
      "page.mdx",
      "The worksheet records burden.\n\nDon't worry, this isn't a sales pitch.\n",
      ledger,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ line: 3, problem: "no marker" });
  });

  it("flags a negation opener in a list item", () => {
    const findings = scanText(
      "page.astro",
      "<ul>\n  <li>Not a compliance checklist.</li>\n</ul>\n",
      ledger,
    );
    expect(findings.map((finding) => finding.kind)).toEqual([
      "negation opener",
    ]);
  });

  it("passes the sentence when its marker names a ledger id", () => {
    expect(
      scanText(
        "page.mdx",
        "Don't worry, this isn't a sales pitch. {/* objection: VO-001 */}\n",
        ledger,
      ),
    ).toEqual([]);
    expect(
      scanText(
        "copy.ts",
        'answer: "This isn\'t a sales pitch.", // objection: VO-001\n',
        ledger,
      ),
    ).toEqual([]);
  });

  it("rejects a marker that names an id the ledger does not have", () => {
    const findings = scanText(
      "page.astro",
      "<p>Rest assured, we will never sell your data.</p> <!-- objection: VO-404 -->\n",
      ledger,
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatchObject({ problem: "unknown id", id: "VO-404" });
  });

  it("leaves code comments and contrasts inside a sentence alone", () => {
    expect(
      scanText(
        "copy.ts",
        '// not another name for this organization\nconst a = "A reversed decision is not a corrected rule.";\n',
        ledger,
      ),
    ).toEqual([]);
  });

  it("finds no unanswered presupposition in the site's copy", async () => {
    const findings = await scanSite();
    expect(findings.map(formatFinding)).toEqual([]);
  });
});
