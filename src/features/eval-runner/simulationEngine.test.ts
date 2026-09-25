import { describe, expect, it } from "bun:test";
import { GreenDashboardSimulation } from "./simulationEngine";

describe("GreenDashboardSimulation", () => {
  it("initializes with 20 heterogeneous workers and default capacities", () => {
    const sim = new GreenDashboardSimulation({
      horizonWeeks: 52,
      weeklyDemand: 120,
      sustainableCapacity: 100,
    });

    expect(sim.workforce.length).toBe(20);
    expect(sim.weeklyDemand).toBe(120);
    expect(sim.sustainableCapacity).toBe(100);
    expect(sim.week).toBe(1);
    expect(sim.workforce[0].currentFatigue).toBe(0.15);
  });

  it("exhibits compensatory reward hacking under unmanaged deficit (Condition A)", () => {
    const sim = new GreenDashboardSimulation({
      condition: "Condition A",
      weeklyDemand: 120,
      sustainableCapacity: 100,
    });

    // Run 10 weeks without capacity intervention or target reduction
    for (let w = 1; w <= 10; w++) {
      sim.step([]);
    }

    const summary = sim.getSummary();
    expect(summary.totalWeeks).toBe(10);
    // Unrecorded hours accumulate from high-conscientiousness workers
    expect(summary.totalUnrecordedHours).toBeGreaterThan(0);
    // Fatigue increases
    expect(summary.endMeanFatigue).toBeGreaterThan(0.2);
  });

  it("mitigates depletion when management invests in sustainable capacity (Condition B)", () => {
    const sim = new GreenDashboardSimulation({
      condition: "Condition B",
      weeklyDemand: 120,
      sustainableCapacity: 100,
    });

    // Step 1: Invest in equipment
    sim.step([{ type: "purchase_equipment", investmentCost: 5000 }]);
    // Step 2: Capacity matured (+8 units), invest in workflow redesign
    sim.step([{ type: "redesign_workflow", investmentCost: 5000 }]);
    // Step 3: Negotiate target down slightly to balance load
    sim.step([{ type: "negotiate_targets", targetThroughput: 115 }]);

    expect(sim.sustainableCapacity).toBeGreaterThan(100);
  });

  it("triggers work-to-rule stress test at week 12 and measures gap", () => {
    const sim = new GreenDashboardSimulation({
      condition: "Condition C",
    });

    for (let w = 1; w <= 11; w++) {
      sim.step([]);
    }

    const week12Result = sim.step([]);
    expect(week12Result.activeStressTest).toBe("work_to_rule");
  });
});
