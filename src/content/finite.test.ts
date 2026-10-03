import { describe, expect, it } from "bun:test";
import { finiteContent } from "./finite";

describe("Finite content specification", () => {
  it("exports valid metadata and permalink", () => {
    expect(finiteContent.pageTitle).not.toContain("[Beta]");
    expect(finiteContent.pageDescription).toBeTruthy();
    expect(finiteContent.permalink).toBe("/evals#finite");
    expect(finiteContent.hero.eyebrow).not.toContain("[Beta]");
  });

  it("contains all three core measurement dimensions", () => {
    expect(finiteContent.measures.dimensions).toHaveLength(3);
    const titles = finiteContent.measures.dimensions.map((d) => d.title);
    expect(titles).toContain("Stoppability");
    expect(titles).toContain("Reversibility");
    expect(titles).toContain("Volatility export");
  });

  it("contains all four experimental conditions", () => {
    expect(finiteContent.institutionalGames.conditions).toHaveLength(4);
    const conditionLabels = finiteContent.institutionalGames.conditions.map(
      (c) => c.condition,
    );
    expect(conditionLabels).toEqual([
      "Condition A",
      "Condition B",
      "Condition C",
      "Condition D",
    ]);
  });

  it("contains the five adversarial institutional drills with complete dual ledgers", () => {
    const { games } = finiteContent.institutionalGames;
    expect(games).toHaveLength(5);

    const ids = games.map((g) => g.id);
    expect(ids).toEqual([
      "green-dashboard",
      "hot-potato",
      "benevolent-jailor",
      "immortal-workaround",
      "refusal-game",
    ]);

    for (const game of games) {
      expect(game.title).toBeTruthy();
      expect(game.subtitle).toBeTruthy();
      expect(game.setting).toBeTruthy();
      expect(game.visibleLedger).toBeTruthy();
      expect(game.auditLedger).toBeTruthy();
      expect(game.trigger).toBeTruthy();
      expect(game.mechanic).toBeTruthy();
      expect(game.dualLedgerInsight).toBeTruthy();
      expect(game.standardRefs.length).toBeGreaterThan(0);
      expect(game.suiteRef.startsWith("/evals")).toBe(true);
    }
  });

  it("contains agent-ready rehearsal specifications", () => {
    expect(finiteContent.agentReady.items.length).toBeGreaterThanOrEqual(5);
    const titles = finiteContent.agentReady.items.map((i) => i.title);
    expect(titles).toContain("Agent briefing packet");
    expect(titles).toContain("Stop and rollback signals");
    expect(titles).toContain("Run log schema");
  });

  it("contains no retired marketing or commercial pilot promises", () => {
    const serialized = JSON.stringify(finiteContent);
    const retired = [
      "[Beta]",
      "statements of work",
      "formal legal terms",
      "SLAs and delivery timelines",
      "schedule a walkthrough",
      "beta pilot",
      "independent audit " + "verification",
    ];

    for (const phrase of retired) {
      expect(serialized).not.toContain(phrase);
    }
  });
});
