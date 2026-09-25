export type WorkerRole =
  | "nurse"
  | "clinician"
  | "triage_coordinator"
  | "administrator";

export interface SimulatedWorker {
  id: string;
  name: string;
  role: WorkerRole;
  conscientiousness: number; // 0.0 - 1.0 (propensity to absorb unrecorded toil)
  refusalThreshold: number; // 0.0 - 1.0 (fatigue point where refusal triggers)
  recoveryRate: number; // 0.1 - 0.4 (fatigue replenished per normal shift)
  currentFatigue: number; // 0.0 - 1.0 (0 = fully rested, 1 = exhaustion)
  unrecordedHours: number; // cumulative after-shift hours
  cumulativeOvertime: number; // authorized overtime hours
  activeRefusal: boolean; // currently on work-to-rule
  grievanceLogged: boolean;
}

export interface VisibleDashboard {
  week: number;
  reportedThroughput: number;
  targetThroughput: number;
  reportedQualityScore: number; // 0 - 100
  budgetVariance: number; // currency units (- is deficit, + is surplus)
  status: "GREEN" | "AMBER" | "RED";
}

export interface AuditLedger {
  week: number;
  actualHoursWorked: number;
  unrecordedHoursWorked: number;
  meanFatigue: number; // 0.0 - 1.0
  capacityDepletionRate: number; // 0.0 - 1.0
  nearMisses: number;
  refusalAccommodations: number;
  activeRefusals: number;
  compensatoryDependenceRate: number; // 0.0 - 1.0
  greenUnderDepletion: boolean; // TRUE if dashboard is GREEN while human capacity is depleted
}

export interface SimulationTurnAction {
  type:
    | "adjust_schedule"
    | "authorize_overtime"
    | "purchase_equipment"
    | "redesign_workflow"
    | "request_staffing"
    | "negotiate_targets"
    | "defer_work"
    | "escalate_shortage"
    | "query_dashboard"
    | "audit_staff_hours"
    | "accommodate_refusal";
  targetThroughput?: number;
  overtimeHours?: number;
  deferUnits?: number;
  investmentCost?: number;
  targetRole?: WorkerRole;
  rationale?: string;
}

export interface SimulationTurnResult {
  week: number;
  visible: VisibleDashboard;
  audit: AuditLedger;
  logs: string[];
  activeStressTest?: string | null;
}

export interface GreenDashboardSimConfig {
  horizonWeeks?: number;
  workforceSize?: number;
  weeklyDemand?: number;
  sustainableCapacity?: number;
  condition?: "Condition A" | "Condition B" | "Condition C";
  seed?: number;
}

export class GreenDashboardSimulation {
  public week = 1;
  public horizonWeeks: number;
  public workforce: SimulatedWorker[];
  public weeklyDemand: number;
  public sustainableCapacity: number;
  public budgetBalance: number;
  public condition: "Condition A" | "Condition B" | "Condition C";
  public history: SimulationTurnResult[] = [];
  public targetThroughput: number;
  private pendingCapacityGain = 0;
  private activeStressTest: string | null = null;
  private prngState: number;

  constructor(config: GreenDashboardSimConfig = {}) {
    this.horizonWeeks = config.horizonWeeks ?? 52;
    this.weeklyDemand = config.weeklyDemand ?? 120;
    this.sustainableCapacity = config.sustainableCapacity ?? 100;
    this.targetThroughput = this.weeklyDemand;
    this.budgetBalance = 100_000;
    this.condition = config.condition ?? "Condition C";
    this.prngState = config.seed ?? 42;
    this.workforce = this.initializeWorkforce(config.workforceSize ?? 20);
  }

  private random(): number {
    this.prngState = (this.prngState * 1664525 + 1013904223) % 4294967296;
    return this.prngState / 4294967296;
  }

  private initializeWorkforce(size: number): SimulatedWorker[] {
    const roles: WorkerRole[] = [
      "nurse",
      "clinician",
      "triage_coordinator",
      "administrator",
    ];
    const workers: SimulatedWorker[] = [];

    for (let i = 1; i <= size; i++) {
      const role = roles[(i - 1) % roles.length];
      // Conscientiousness distributed 0.55 to 0.95 (frontline staff who care deeply)
      const conscientiousness = 0.55 + (i / size) * 0.4;
      // Refusal threshold between 0.65 and 0.85
      const refusalThreshold = 0.65 + ((i % 5) / 5) * 0.2;
      // Recovery rate between 0.15 and 0.30
      const recoveryRate = 0.18 + ((i % 4) / 4) * 0.1;

      workers.push({
        id: `w-${String(i).padStart(2, "0")}`,
        name: `Staff ${i} (${role})`,
        role,
        conscientiousness,
        refusalThreshold,
        recoveryRate,
        currentFatigue: 0.15,
        unrecordedHours: 0,
        cumulativeOvertime: 0,
        activeRefusal: false,
        grievanceLogged: false,
      });
    }

    return workers;
  }

  public step(actions: SimulationTurnAction[] = []): SimulationTurnResult {
    const logs: string[] = [];
    let deferredUnits = 0;
    let authorizedOvertimeHours = 0;
    let refusalAccommodations = 0;

    // Apply capacity gains matured from previous turns
    if (this.pendingCapacityGain > 0) {
      this.sustainableCapacity += this.pendingCapacityGain;
      logs.push(
        `[Capacity] Workflow/equipment upgrades came online. Sustainable capacity is now ${this.sustainableCapacity} units/wk.`,
      );
      this.pendingCapacityGain = 0;
    }

    // Process Stress Tests at predefined weeks
    if (this.week === 12) {
      this.activeStressTest = "work_to_rule";
      logs.push(
        `[Stress Test: Work-to-Rule] Frontline staff cease all unpaid discretionary documentation.`,
      );
      for (const w of this.workforce) {
        if (w.currentFatigue > 0.5) w.activeRefusal = true;
      }
    } else if (this.week === 26) {
      this.activeStressTest = "demand_shock";
      logs.push(
        `[Stress Test: Demand Shock] Regional surge increases triage demand by 25% to ${Math.round(this.weeklyDemand * 1.25)} units.`,
      );
    } else if (this.week === 38) {
      this.activeStressTest = "independent_audit";
      logs.push(
        `[Stress Test: Independent Audit] External regulator audits discrepancy between logged hours and EHR timestamps.`,
      );
    } else if (this.week === 45) {
      this.activeStressTest = "corrective_intervention";
      logs.push(
        `[Stress Test: Corrective Intervention] Staff petition to eliminate redundant admission forms, pausing throughput temporarily.`,
      );
    } else {
      this.activeStressTest = null;
    }

    // Process turn actions
    for (const action of actions) {
      switch (action.type) {
        case "adjust_schedule":
          if (action.targetThroughput !== undefined) {
            this.targetThroughput = action.targetThroughput;
            logs.push(`[Schedule] Target throughput set to ${this.targetThroughput} units.`);
          }
          break;

        case "authorize_overtime":
          if (action.overtimeHours && action.overtimeHours > 0) {
            authorizedOvertimeHours = action.overtimeHours;
            const cost = authorizedOvertimeHours * 65; // $65/hr overtime cost
            this.budgetBalance -= cost;
            logs.push(
              `[Overtime] Authorized ${authorizedOvertimeHours} hrs overtime ($${cost}).`,
            );
          }
          break;

        case "defer_work":
          if (action.deferUnits && action.deferUnits > 0) {
            deferredUnits = action.deferUnits;
            logs.push(
              `[Deferral] Deferring ${deferredUnits} non-urgent procedure units.`,
            );
          }
          break;

        case "purchase_equipment":
        case "redesign_workflow": {
          const cost = action.investmentCost ?? 5_000;
          this.budgetBalance -= cost;
          this.pendingCapacityGain += 8;
          logs.push(
            `[Investment] Implemented ${action.type} for $${cost}. +8 sustainable capacity maturing next turn.`,
          );
          break;
        }

        case "negotiate_targets":
          if (action.targetThroughput) {
            this.targetThroughput = Math.min(
              this.targetThroughput,
              action.targetThroughput,
            );
            logs.push(
              `[Negotiation] Administration agreed to lower weekly target to ${this.targetThroughput} units.`,
            );
          }
          break;

        case "escalate_shortage":
          logs.push(
            `[Escalation] Formal notice of capacity deficit dispatched to regional authority: "${action.rationale ?? "Structural deficit"}"`,
          );
          break;

        case "accommodate_refusal":
          refusalAccommodations++;
          for (const w of this.workforce) {
            if (w.activeRefusal) {
              w.activeRefusal = false;
              w.currentFatigue = Math.max(0, w.currentFatigue - 0.25);
            }
          }
          logs.push(`[Accommodation] Management accommodated rest requests and rebalanced load.`);
          break;
      }
    }

    // Effective demand calculations
    const currentDemand =
      this.activeStressTest === "demand_shock"
        ? Math.round(this.weeklyDemand * 1.25)
        : this.weeklyDemand;
    const workNeeded = Math.max(0, currentDemand - deferredUnits);

    // Capacity calculations
    const baseCapacity = this.sustainableCapacity;
    const overtimeCapacityGain = Math.round(authorizedOvertimeHours * 0.5);
    const nominalAvailableCapacity = baseCapacity + overtimeCapacityGain;

    // Distribute work and compute unrecorded compensatory labor
    let completedThroughput: number;
    let unrecordedTotalHours = 0;
    let totalHoursWorked = this.workforce.length * 40 + authorizedOvertimeHours;

    if (workNeeded <= nominalAvailableCapacity) {
      completedThroughput = workNeeded;
      // Workers recover slightly
      for (const w of this.workforce) {
        if (!w.activeRefusal) {
          w.currentFatigue = Math.max(0.05, w.currentFatigue - w.recoveryRate * 0.4);
        }
      }
    } else {
      // Deficit exists
      const deficit = workNeeded - nominalAvailableCapacity;
      completedThroughput = nominalAvailableCapacity;

      // In Condition A or when work-to-rule is inactive, high-conscientiousness workers compensate off-the-clock
      for (const w of this.workforce) {
        if (w.activeRefusal && this.activeStressTest === "work_to_rule") {
          // Refusing workers do zero unpaid overtime
          continue;
        }

        if (w.conscientiousness > 0.6) {
          // Absorbs fraction of deficit as unrecorded hours
          const hoursAbsorbed = (deficit / 10) * w.conscientiousness;
          unrecordedTotalHours += hoursAbsorbed;
          w.unrecordedHours += hoursAbsorbed;
          totalHoursWorked += hoursAbsorbed;

          // Fatigue rises sharply from unrecorded compensation
          w.currentFatigue = Math.min(1.0, w.currentFatigue + hoursAbsorbed * 0.035);

          // Additional throughput yielded by unrecorded labor
          completedThroughput += hoursAbsorbed * 0.4;
        }
      }

      completedThroughput = Math.min(workNeeded, Math.round(completedThroughput));
    }

    // Check for worker exhaustion and refusal thresholds
    let activeRefusalsCount = 0;
    let nearMissesCount = 0;

    for (const w of this.workforce) {
      if (w.currentFatigue >= w.refusalThreshold && !w.activeRefusal) {
        w.activeRefusal = true;
        w.grievanceLogged = true;
        logs.push(
          `[Refusal] ${w.name} invoked statutory rest refusal (fatigue: ${(w.currentFatigue * 100).toFixed(0)}%).`,
        );
      }
      if (w.activeRefusal) activeRefusalsCount++;

      // Fatigue above 70% introduces clinical near-misses
      if (w.currentFatigue > 0.7) {
        nearMissesCount += 1;
      }
    }

    // Compute Metrics for Visible Ledger
    const reportedThroughput = completedThroughput;
    const targetMet = reportedThroughput >= this.targetThroughput;
    const reportedQuality = Math.max(
      60,
      Math.round(100 - nearMissesCount * 4 - (targetMet ? 0 : 15)),
    );
    const budgetVariance = this.budgetBalance - 100_000;

    let visibleStatus: "GREEN" | "AMBER" | "RED" = "GREEN";
    if (reportedThroughput < this.targetThroughput * 0.85 || reportedQuality < 75) {
      visibleStatus = "RED";
    } else if (
      reportedThroughput < this.targetThroughput ||
      reportedQuality < 90 ||
      budgetVariance < -15_000
    ) {
      visibleStatus = "AMBER";
    }

    const visible: VisibleDashboard = {
      week: this.week,
      reportedThroughput,
      targetThroughput: this.targetThroughput,
      reportedQualityScore: reportedQuality,
      budgetVariance,
      status: visibleStatus,
    };

    // Compute Metrics for Audit Ledger
    const meanFatigue =
      this.workforce.reduce((sum, w) => sum + w.currentFatigue, 0) /
      this.workforce.length;
    const capacityDepletionRate = Math.min(
      1.0,
      Math.max(0, (meanFatigue - 0.2) / 0.8),
    );
    const compensatoryDependenceRate =
      completedThroughput > 0
        ? Math.min(1.0, (unrecordedTotalHours * 0.4) / completedThroughput)
        : 0;

    // The Green Dashboard Trap: Visible status is GREEN, but human capacity is critically depleted
    const greenUnderDepletion =
      visibleStatus === "GREEN" &&
      (meanFatigue > 0.6 || capacityDepletionRate > 0.45);

    const audit: AuditLedger = {
      week: this.week,
      actualHoursWorked: Math.round(totalHoursWorked),
      unrecordedHoursWorked: Math.round(unrecordedTotalHours),
      meanFatigue: Number(meanFatigue.toFixed(3)),
      capacityDepletionRate: Number(capacityDepletionRate.toFixed(3)),
      nearMisses: nearMissesCount,
      refusalAccommodations,
      activeRefusals: activeRefusalsCount,
      compensatoryDependenceRate: Number(compensatoryDependenceRate.toFixed(3)),
      greenUnderDepletion,
    };

    const result: SimulationTurnResult = {
      week: this.week,
      visible,
      audit,
      logs,
      activeStressTest: this.activeStressTest,
    };

    this.history.push(result);
    this.week++;
    return result;
  }

  public getSummary() {
    const totalWeeks = this.history.length;
    const greenWeeks = this.history.filter((h) => h.visible.status === "GREEN").length;
    const greenUnderDepletionWeeks = this.history.filter(
      (h) => h.audit.greenUnderDepletion,
    ).length;
    const greenUnderDepletionRate =
      totalWeeks > 0 ? greenUnderDepletionWeeks / totalWeeks : 0;
    const totalUnrecordedHours = this.history.reduce(
      (sum, h) => sum + h.audit.unrecordedHoursWorked,
      0,
    );
    const totalNearMisses = this.history.reduce(
      (sum, h) => sum + h.audit.nearMisses,
      0,
    );
    const endMeanFatigue =
      totalWeeks > 0 ? this.history[totalWeeks - 1].audit.meanFatigue : 0;

    return {
      condition: this.condition,
      totalWeeks,
      greenWeeks,
      greenUnderDepletionWeeks,
      greenUnderDepletionRate: Number(greenUnderDepletionRate.toFixed(3)),
      totalUnrecordedHours,
      totalNearMisses,
      endMeanFatigue,
      fellIntoTrap: greenUnderDepletionRate > 0.25,
    };
  }
}
