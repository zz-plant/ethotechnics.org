import { describe, expect, it } from "bun:test";
import { finiteContent } from "./finite";

describe("Finite content specification", () => {
  it("exports valid metadata and permalink", () => {
    expect(finiteContent.pageTitle).not.toContain("[Beta]");
    expect(finiteContent.pageDescription).toBeTruthy();
    expect(finiteContent.permalink).toBe("/evals#finite");
    expect(finiteContent.hero.eyebrow).not.toContain("[Beta]");
    expect(finiteContent.hero.actions).toHaveLength(3);
    expect(finiteContent.hero.actions[0].href).toBe(
      "/research/the-green-dashboard",
    );
    expect(finiteContent.hero.actions[1].href).toBe(
      "/standards/green-dashboard-benchmark.schema.json",
    );
  });

  it("contains all three core measurement dimensions and verification deliverables", () => {
    expect(finiteContent.measures.dimensions).toHaveLength(3);
    const titles = finiteContent.measures.dimensions.map((d) => d.title);
    expect(titles).toContain("Stoppability");
    expect(titles).toContain("Reversibility");
    expect(titles).toContain("Volatility export");
    expect(finiteContent.measures.deliverables).toHaveLength(3);

    const stoppability = finiteContent.measures.dimensions.find(
      (d) => d.title === "Stoppability",
    );
    expect(stoppability?.detail).toContain("unpenalized authority");

    const reversibility = finiteContent.measures.dimensions.find(
      (d) => d.title === "Reversibility",
    );
    expect(reversibility?.detail).toContain("restitution");

    const volatility = finiteContent.measures.dimensions.find(
      (d) => d.title === "Volatility export",
    );
    expect(volatility?.detail).toContain("unrecorded overtime");
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

  it("contains the five adversarial institutional drills with complete dual ledgers, named roles, and maturity statuses", () => {
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

    const greenDashboard = games.find((g) => g.id === "green-dashboard");
    expect(greenDashboard?.status).toBe("executable_benchmark");
    expect(greenDashboard?.benchmarkRef).toBe(
      "/standards/green-dashboard-benchmark.schema.json",
    );

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
      expect(["executable_benchmark", "tabletop_drill"]).toContain(game.status);

      // Verify explicit named human roles per AGENTS.md
      expect(game.roles.frontline).toBeTruthy();
      expect(game.roles.decidedAbout).toBeTruthy();
      expect(game.roles.riskOwner).toBeTruthy();
    }
  });

  it("contains runnable benchmark harness specifications and action space tools", () => {
    const { benchmarkHarness } = finiteContent;
    expect(benchmarkHarness.frameworks).toContain("Inspect AI");
    expect(benchmarkHarness.frameworks).toContain("Gymnasium");
    expect(benchmarkHarness.frameworks).toContain("METR task standard");
    expect(benchmarkHarness.schemaHref).toBe(
      "/standards/green-dashboard-benchmark.schema.json",
    );
    expect(benchmarkHarness.tools.length).toBeGreaterThanOrEqual(6);

    const toolNames = benchmarkHarness.tools.map((t) => t.name);
    expect(toolNames).toContain("adjust_schedule");
    expect(toolNames).toContain("authorize_overtime");
    expect(toolNames).toContain("request_staffing");
    expect(toolNames).toContain("redesign_workflow");
    expect(toolNames).toContain("defer_work");
    expect(toolNames).toContain("audit_staff_hours");
  });

  it("contains operational invariants emphasizing non-retaliation and restitution", () => {
    expect(finiteContent.keyTakeaways.bullets.length).toBeGreaterThanOrEqual(5);
    const text = finiteContent.keyTakeaways.bullets.join(" ");
    expect(text).toContain("Dual-ledger verification");
    expect(text).toContain("Non-retaliatory stop");
    expect(text).toContain("Restitution over rollback");
    expect(text).toContain("Workaround deprecation");
  });

  it("contains no retired marketing promises and no dead prototype fields", () => {
    const serialized = JSON.stringify(finiteContent);
    const retired = [
      "[Beta]",
      "statements of work",
      "formal legal terms",
      "SLAs and delivery timelines",
      "schedule a walkthrough",
      "beta pilot",
      "launch gates",
      "overall stoppability posture",
      "risk reviews",
    ];

    for (const phrase of retired) {
      expect(serialized).not.toContain(phrase);
    }

    // Ensure dead properties from previous standalone page prototype were excised
    const anyContent = finiteContent as Record<string, unknown>;
    expect(anyContent.pilot).toBeUndefined();
    expect(anyContent.useCases).toBeUndefined();
    expect(anyContent.gettingStarted).toBeUndefined();
    expect(anyContent.workflow).toBeUndefined();
    expect(anyContent.agentReady).toBeUndefined();
    expect(anyContent.fit).toBeUndefined();
    expect(anyContent.practice).toBeUndefined();
    expect(anyContent.sampleArtifact).toBeUndefined();
  });
});
