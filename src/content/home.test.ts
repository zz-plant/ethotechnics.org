import { describe, expect, it, mock } from "bun:test";

import homeEntries from "./home.json";

const mockGetEntry = mock(() => ({
  data: homeEntries[0],
}));

mock.module("astro:content", () => ({
  getEntry: mockGetEntry,
}));

describe("home content", () => {
  it("includes hero heading text", async () => {
    const { getEntry } = await import("astro:content");
    const homeEntry = (await getEntry("home", "home"))!;
    expect(homeEntry.data.hero.heading).toContain(
      "Build technology people can trust.",
    );
  });
});
