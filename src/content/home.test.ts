import { readFile } from "node:fs/promises";

import { describe, expect, it, mock } from "bun:test";

const mockGetEntry = mock(async () => {
  const data = await readFile(new URL("./home.json", import.meta.url), "utf-8");
  const entries = JSON.parse(data) as Array<{
    id: string;
    hero?: { heading?: string };
  }>;

  const entry = entries.find((homeEntry) => homeEntry.id === "home");

  return entry ? { data: entry } : undefined;
});

mock.module("astro:content", () => ({
  getEntry: mockGetEntry,
}));

const loadHomeEntry = async () => {
  const { getEntry } = await import("astro:content");

  return getEntry("home", "home");
};

describe("home content", () => {
  it("includes hero heading text", async () => {
    const homeEntry = await loadHomeEntry();

    expect(homeEntry?.data.hero?.heading).toBe(
      "Build technology people can trust.",
    );
  });
});
