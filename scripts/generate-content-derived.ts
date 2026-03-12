import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

const rootDir = process.cwd();

const derivedFiles = [
  {
    sourceJson: "src/content/home.json",
    targetTs: "src/content/generated/home.generated.ts",
    constName: "homeContentData",
    select: "first",
  },
  {
    sourceJson: "src/content/glossary.json",
    targetTs: "src/content/generated/glossary.generated.ts",
    constName: "glossaryContentData",
    select: "first",
  },
  {
    sourceJson: "src/content/library.json",
    targetTs: "src/content/generated/library.generated.ts",
    constName: "libraryContentData",
    select: "first",
  },
  {
    sourceJson: "src/content/taxonomy.json",
    targetTs: "src/content/generated/taxonomy.generated.ts",
    constName: "taxonomyEntriesData",
    select: "all",
  },
  {
    sourceJson: "src/content/field-notes.json",
    targetTs: "src/content/generated/field-notes.generated.ts",
    constName: "fieldNotesContentData",
    select: "first",
  },
] as const;

const checkMode = process.argv.includes("--check");

const makeRelativeImport = (fromFile: string, toFile: string) => {
  const fromDir = dirname(fromFile);
  const importPath = relative(fromDir, toFile).replace(/\\/g, "/");
  return importPath.startsWith(".") ? importPath : `./${importPath}`;
};

const formatDerivedModule = (config: (typeof derivedFiles)[number]) => {
  const importPath = makeRelativeImport(config.targetTs, config.sourceJson);
  const selection = config.select === "first" ? "sourceData[0]" : "sourceData";

  return [
    "// AUTO-GENERATED FILE. DO NOT EDIT.",
    "// Source of truth lives in the JSON file referenced below.",
    `import sourceData from \"${importPath}\";`,
    "",
    `export const ${config.constName} = ${selection};`,
    "",
  ].join("\n");
};

let hasDrift = false;

for (const config of derivedFiles) {
  const sourcePath = resolve(rootDir, config.sourceJson);
  const targetPath = resolve(rootDir, config.targetTs);

  const sourceContent = await readFile(sourcePath, "utf8");
  JSON.parse(sourceContent);

  const expected = formatDerivedModule(config);
  let existing = "";

  try {
    existing = await readFile(targetPath, "utf8");
  } catch {
    existing = "";
  }

  if (existing === expected) {
    console.log(`✅ Up to date: ${config.targetTs}`);
    continue;
  }

  hasDrift = true;

  if (checkMode) {
    console.error(`❌ Derived content drift: ${config.targetTs}`);
    continue;
  }

  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, expected, "utf8");
  console.log(`✨ Generated: ${config.targetTs}`);
}

if (checkMode && hasDrift) {
  console.error(
    "\nRun `bun run content:generate` to refresh derived content files.",
  );
  process.exit(1);
}
