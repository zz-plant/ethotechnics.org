import { describe, expect, it } from "bun:test";

const extractCollectionFiles = (configText: string) => {
  const matches = Array.from(
    configText.matchAll(/file\("(?<path>src\/content\/[^\"]+\.json)"\)/g),
  );

  return matches
    .map((match) => match.groups?.path)
    .filter((path): path is string => Boolean(path))
    .sort();
};

const loadJsonFiles = async () => {
  const glob = new Bun.Glob("src/content/*.json");
  const files: string[] = [];

  for await (const file of glob.scan({ cwd: process.cwd() })) {
    files.push(file);
  }

  return files.sort();
};

describe("content collections", () => {
  it("tracks every JSON content file in src/content.config.ts", async () => {
    const configText = await Bun.file("src/content.config.ts").text();
    const configuredFiles = extractCollectionFiles(configText);
    const jsonFiles = await loadJsonFiles();

    expect(configuredFiles).toEqual(jsonFiles);
  });
});
