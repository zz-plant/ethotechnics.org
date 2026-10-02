import { readdirSync, readFileSync } from "node:fs";

type Finding = { file: string; message: string };

const THEORY_DIR = "src/content/theory";
const OUTPUT_FILE = "src/pages/research";

/**
 * Every theory essay must be bound to the checkable layers it argues for:
 * at least one link into /glossary/, /mechanisms/, /standards/, or /evals/,
 * plus lawRefs in its frontmatter. An essay that argues without binding is
 * the "principles with adjectives" failure the method rejects.
 */
const ARTIFACT_PREFIXES = [
  "/glossary/",
  "/mechanisms/",
  "/standards/",
  "/evals/",
];

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = `${dir}/${e.name}`;
    return e.isDirectory() ? walk(p) : e.name.endsWith(".mdx") ? [p] : [];
  });
}

const findings: Finding[] = [];
const essays = walk(THEORY_DIR);

for (const file of essays) {
  const raw = readFileSync(file, "utf8");
  const frontmatter = raw.split("---")[1] ?? "";

  if (!/^\s*lawRefs:\s*\[/m.test(frontmatter)) {
    findings.push({ file, message: "frontmatter has no lawRefs array" });
  }

  const body = raw.split("---").slice(1).join("---");
  const bound = ARTIFACT_PREFIXES.some(
    (prefix) =>
      body.includes(`href="${prefix}`) || body.includes(`](${prefix}`),
  );
  if (!bound) {
    findings.push({
      file,
      message:
        "no link into a checkable layer (/glossary/, /mechanisms/, /standards/, /evals/); an essay that binds to nothing is not load-bearing",
    });
  }
}

if (findings.length > 0) {
  for (const f of findings) {
    console.error(`✗ ${f.file.replace(THEORY_DIR, "theory")}: ${f.message}`);
  }
  console.error(
    `\n${findings.length} of ${essays.length} theory essays are unbound. See scripts/check-essay-binding.ts.`,
  );
  process.exit(1);
}

console.log(`Essay binding passed for ${essays.length} theory essays.`);
