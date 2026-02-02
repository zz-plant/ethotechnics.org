import type { PatternBundleEntry } from "./types";

export const composePatternBundle = (entries: PatternBundleEntry[]) => {
  const lines = [
    "# Mechanism bundle",
    `Generated from ethotechnics.org/mechanisms on ${new Date().toISOString().slice(0, 10)}`,
    "",
  ];

  entries.forEach((entry) => {
    lines.push(`## ${entry.title}`, entry.summary, "");

    if (entry.cues.length) {
      lines.push("### Cues", ...entry.cues.map((cue) => `- ${cue}`), "");
    }

    if (entry.steps.length) {
      lines.push(
        "### Steps",
        ...entry.steps.map((step, index) => `${index + 1}. ${step}`),
        "",
      );
    }

    if (entry.artifacts.length) {
      lines.push("### Artifacts");
      entry.artifacts.forEach((artifact) => {
        lines.push(`- **${artifact.name}** — ${artifact.purpose}`);
      });
      lines.push("");
    }

    lines.push(
      "### Example",
      `- ${entry.example.title}`,
      "",
      entry.example.description,
      "",
    );

    if (entry.glossaryRefs?.length) {
      lines.push(
        "### Glossary anchors",
        ...entry.glossaryRefs.map((ref) => `- ${ref}`),
        "",
      );
    }

    if (entry.diagnostics.length) {
      lines.push(
        "### Diagnostics",
        ...entry.diagnostics.map((diagnostic) => `- ${diagnostic}`),
        "",
      );
    }
  });

  return lines.join("\n");
};
