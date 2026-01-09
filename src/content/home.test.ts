import { describe, expect, it } from "bun:test";

import { homeContent } from "@/content/home";

describe("home content", () => {
  it("includes hero heading text", () => {
    expect(homeContent.hero.heading).toContain(
      "open-source library for accountable AI",
    );
  });
});
