import { describe, expect, it } from "bun:test";

import { readFile } from "node:fs/promises";

const loadHomeEntry = async () => {
  const data = await readFile(new URL("./home.json", import.meta.url), "utf-8");
  const entries = JSON.parse(data) as Array<{
    id: string;
    hero?: { heading?: string };
  }>;

  return entries.find((entry) => entry.id === "home");
};

describe("home content", () => {
  it("includes hero heading text", async () => {
    const homeEntry = await loadHomeEntry();

    expect(homeEntry?.hero?.heading).toBe(
      "Make accountability the fastest path to launch.",
    );
  });
});
