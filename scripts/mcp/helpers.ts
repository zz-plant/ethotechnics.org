import { realpath } from "node:fs/promises";

// Helper to get project info
export const getProjectRoot = () => process.cwd();
export const textResponse = (text: string) => ({
  content: [
    {
      type: "text" as const,
      text,
    },
  ],
});
export const errorResponse = (message: string) => textResponse(message);

export type CheckClassification = {
  required: string[];
  optional: string[];
  reasons: string[];
};

export const projectRootRealPathPromise = realpath(getProjectRoot());

export const checkCatalog = {
  formatCheck: "bun run format:check",
  validateJson: "bun run validate:json",
  validateGlossary: "bun run validate:glossary",
  fullCheck: "bun run check",
} as const;

export const toPosixPath = (value: string) => value.replaceAll("\\", "/");

export const getRequiredChecksForFiles = (
  files: string[],
): CheckClassification => {
  const required = new Set<string>();
  const optional = new Set<string>();
  const reasons = new Set<string>();

  if (files.length === 0) {
    required.add(checkCatalog.formatCheck);
    optional.add(checkCatalog.fullCheck);
    reasons.add("No files provided; default to formatting guidance.");
    return {
      required: [...required],
      optional: [...optional],
      reasons: [...reasons],
    };
  }

  let docsOnly = true;

  for (const originalFile of files) {
    const file = toPosixPath(originalFile.trim());
    if (!file) continue;

    const isMarkdown = file.endsWith(".md");
    const isDocPath = file.startsWith("docs/") || isMarkdown;
    if (!isDocPath) docsOnly = false;

    if (file.startsWith("src/content/") && file.endsWith(".json")) {
      required.add(checkCatalog.validateJson);
      reasons.add("Content JSON changed; include schema/content validation.");
    }

    if (
      file.includes("glossary") &&
      (file.endsWith(".json") || file.endsWith(".ts"))
    ) {
      required.add(checkCatalog.validateGlossary);
      reasons.add(
        "Glossary data or helpers changed; include glossary validation.",
      );
    }

    if (
      /\.(ts|tsx|astro|js|mjs|cjs)$/.test(file) ||
      file.startsWith("scripts/")
    ) {
      required.add(checkCatalog.fullCheck);
      reasons.add("Code or script files changed; run full project checks.");
    }
  }

  if (docsOnly) {
    required.add(checkCatalog.formatCheck);
    optional.add(checkCatalog.fullCheck);
    reasons.add("Detected docs-only changes.");
  }

  if (required.size === 0) {
    required.add(checkCatalog.fullCheck);
    reasons.add(
      "Could not classify file set confidently; defaulting to full check.",
    );
  }

  return {
    required: [...required],
    optional: [...optional],
    reasons: [...reasons],
  };
};

export const getStatusEmoji = (exitCode: number) => {
  if (exitCode === 0) return "✅";
  if (exitCode === 2) return "⚠️";
  return "❌";
};
