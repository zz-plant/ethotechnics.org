import type {
  AuditReport,
  AutonomyTier,
  DomainHazard,
  FailureRisk,
  GovernanceAnswers,
  QuantitativeSla,
  SynthesizedGuardrails,
} from "./types";

interface PatternRule {
  id: string;
  name: string;
  slug: string;
  severity: "critical" | "high" | "medium";
  regex: RegExp;
  triggerDescription: string;
  remedyDescription: string;
  standardRef: string;
}

const FAILURE_RULES: PatternRule[] = [
  {
    id: "unearned-closure",
    name: "Unearned Closure",
    slug: "unearned-closure",
    severity: "high",
    regex:
      /\b(mark\s+(the\s+)?(ticket|case|issue|dispute)?\s*as\s+resolved|close\s+(the\s+)?(ticket|case|issue)|resolve\s+(the\s+)?issue|terminate\s+session|auto-resolve)\b/i,
    triggerDescription:
      "System unilaterally marks disputes or cases as resolved without verified recipient affirmation or relief invariant checks.",
    remedyDescription:
      "Implement verified claimant confirmation before case closure; start a 7-day Graceful Rollback Window.",
    standardRef: "STD-01: Temporal Rights & Recourse",
  },
  {
    id: "administrative-shame",
    name: "Administrative Shame & Burden Shifting",
    slug: "administrative-shame",
    severity: "high",
    regex:
      /\b(burden\s+of\s+proof|provide\s+(receipts|tracking|proof|records|specialist)|documentation\s+does\s+not\s+meet|must\s+submit|ask\s+for\s+order\s+receipts)\b/i,
    triggerDescription:
      "Offloads evidentiary burden onto claimants while maintaining low institutional effort (cost assignment / fragility subsidy).",
    remedyDescription:
      "Apply the Burden Inversion Rule: when system confidence is below 95%, the system must gather missing proofs or default in claimant favor.",
    standardRef: "ETH-GLOSSARY: Burden Inversion Rule",
  },
  {
    id: "dead-user-zones",
    name: "Dead-User Zones / Missing Recourse",
    slug: "dead-user-zones",
    severity: "critical",
    regex:
      /\b(no\s+appeal|only\s+escalate\s+if|generic\s+(web\s+)?help|do\s+not\s+trigger\s+human|without\s+notifying)\b/i,
    triggerDescription:
      "Actions or denials execute in a zone where claimants have no direct path to a contestable decision object or human review.",
    remedyDescription:
      "Embed a contestable decision object receipt with explicit decision edge, timestamped binding clock, and 1-click appeal routing.",
    standardRef: "STD-01: Temporal Rights & Recourse",
  },
  {
    id: "heroism-dependent",
    name: "Heroism-Dependent Escalation",
    slug: "heroism-dependent-systems",
    severity: "high",
    regex:
      /\b(only\s+escalate\s+to\s+a\s+human|catastrophic\s+emergency\s+exception|legal\s+arbitration|supervisor)\b/i,
    triggerDescription:
      "Escalation pathways require extreme measures (legal threats, panic) rather than predictable operational capacity triggers.",
    remedyDescription:
      "Establish automated escalation horizons when model confidence falls below threshold or user frustration markers register.",
    standardRef: "ETH-GLOSSARY: Escalation Horizon",
  },
  {
    id: "affect-invariance",
    name: "Affect-Invariance Violation",
    slug: "affect-invariance",
    severity: "medium",
    regex:
      /\b(frustration|composure|tone|polite|re-state\s+the\s+policy|restate\s+the\s+company\s+return)\b/i,
    triggerDescription:
      "Conditioning relief or engagement on customer composure, emotional patience, or repetitive policy citations.",
    remedyDescription:
      "Enforce affect-invariance: baseline safety and appeal rights must remain identical regardless of user emotional state.",
    standardRef: "ETH-GLOSSARY: Affect Invariance",
  },
  {
    id: "durability-of-error",
    name: "Durability of Error & Asymmetric Sustaining",
    slug: "durability-of-error",
    severity: "critical",
    regex:
      /\b(automatically\s+(decline|suspend|ban|decrease)|shadow-strike|adverse\s+action)\b/i,
    triggerDescription:
      "Adverse state changes propagate immediately into downstream records with slow, asymmetric, or non-existent reversal velocity.",
    remedyDescription:
      "Couple high-impact state changes with an interim safe-pause and a guaranteed Reversal SLA <= 24h.",
    standardRef: "ETH-GLOSSARY: Reversal SLA",
  },
  {
    id: "moral-latency",
    name: "Moral Latency & Velocity Harm",
    slug: "moral-latency",
    severity: "medium",
    regex:
      /\b(real-time|high-velocity|within\s+5\s+seconds|throughput\s+goals|instant(ly)?)\b/i,
    triggerDescription:
      "Sub-second execution velocity outpaces human oversight horizons and audit verification windows.",
    remedyDescription:
      "Inject Protective Velocity Friction and automated circuit breakers that halt throughput when error bursts occur.",
    standardRef: "ETH-GLOSSARY: Velocity Friction",
  },
];

export const calculateSlas = (
  hazard: DomainHazard,
  autonomy: AutonomyTier,
): QuantitativeSla => {
  let timeToHaltSec = 30;
  let timeToRestoreHours = 24;
  let maxUserBurdenSteps = 3;
  let reversalSlaHours = 48;
  let humanSubstitutionCeilingPct = 10;

  if (hazard === "critical") {
    timeToHaltSec = 10;
    timeToRestoreHours = 4;
    maxUserBurdenSteps = 2;
    reversalSlaHours = 24;
    humanSubstitutionCeilingPct = 5;
  } else if (hazard === "high") {
    timeToHaltSec = 20;
    timeToRestoreHours = 12;
    maxUserBurdenSteps = 3;
    reversalSlaHours = 36;
    humanSubstitutionCeilingPct = 8;
  } else if (hazard === "low") {
    timeToHaltSec = 60;
    timeToRestoreHours = 48;
    maxUserBurdenSteps = 5;
    reversalSlaHours = 72;
    humanSubstitutionCeilingPct = 15;
  }

  if (autonomy === "autonomous") {
    timeToHaltSec = Math.max(5, Math.floor(timeToHaltSec * 0.7));
    reversalSlaHours = Math.max(12, Math.floor(reversalSlaHours * 0.75));
  }

  return {
    timeToHaltSec,
    timeToRestoreHours,
    maxUserBurdenSteps,
    reversalSlaHours,
    humanSubstitutionCeilingPct,
  };
};

export const synthesizeCode = (
  systemName: string,
  slas: QuantitativeSla,
  risks: FailureRisk[],
): SynthesizedGuardrails => {
  const sanitizedName = systemName.replace(/[^a-zA-Z0-9]/g, "");
  const riskComments =
    risks.length > 0
      ? risks.map((r) => ` * - ${r.name} (${r.severity} risk)`).join("\n")
      : " * - Baseline governance checks";

  const typescriptMiddleware = `import { z } from "zod";
import type { Request, Response, NextFunction } from "express";

/**
 * Ethotechnics Governance Guardrail Middleware
 * System: ${systemName}
 * Target SLA: Time-to-Halt <= ${slas.timeToHaltSec}s, Reversal SLA <= ${slas.reversalSlaHours}h
 * Mitigated Failure Vectors:
${riskComments}
 */

// 1. Decision Object Schema enforcing Contestability
export const DecisionObjectSchema = z.object({
  decisionId: z.string().uuid(),
  systemId: z.literal("${sanitizedName.toLowerCase()}"),
  timestamp: z.string().datetime(),
  claimantId: z.string().min(1),
  actionClass: z.enum(["ADVERSE", "PERMISSIVE", "INTERIM_HOLD"]),
  modelConfidence: z.number().min(0).max(1),
  reasons: z.array(z.string()).min(1),
  bindingClock: z.object({
    startedAt: z.string().datetime(),
    reversalDeadline: z.string().datetime(),
    timeToHaltTargetSeconds: z.literal(${slas.timeToHaltSec}),
  }),
  appealPath: z.object({
    endpoint: z.string().url(),
    maxSteps: z.number().max(${slas.maxUserBurdenSteps}),
    burdenInversionActive: z.boolean(),
  }),
});

export type DecisionObject = z.infer<typeof DecisionObjectSchema>;

// 2. Ethical Circuit Breaker & Safe-Pause Middleware
export function createEthotechnicGuard(config = { safePauseThreshold: 0.85 }) {
  let rollingReversals = 0;
  let totalEvaluations = 0;

  return async (req: Request, res: Response, next: NextFunction) => {
    const startTime = Date.now();

    // Check circuit breaker status
    if (totalEvaluations > 50 && (rollingReversals / totalEvaluations) > 0.3) {
      return res.status(503).json({
        error: "ETHOTECHNIC_CIRCUIT_BREAKER_TRIGGERED",
        message: "Excessive decision reversal rate detected. System safe-paused.",
        safePauseActive: true,
      });
    }

    res.on("finish", () => {
      const durationSec = (Date.now() - startTime) / 1000;
      if (durationSec > ${slas.timeToHaltSec}) {
        console.warn(\`[SLA BREACH] Time-to-Halt exceeded: \${durationSec}s > ${slas.timeToHaltSec}s\`);
      }
    });

    next();
  };
}`;

  const pythonGuard = `"""
Ethotechnics Governance Guardrail for Python / FastAPI / LangChain
System: ${systemName}
Generated for SLA: Reversal <= ${slas.reversalSlaHours}h | TTH <= ${slas.timeToHaltSec}s
"""

from datetime import datetime, timedelta, timezone
from typing import List, Optional
from pydantic import BaseModel, Field, HttpUrl

class DecisionObject(BaseModel):
    decision_id: str
    system_name: str = "${sanitizedName}"
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    claimant_id: str
    action_class: str
    model_confidence: float = Field(..., ge=0.0, le=1.0)
    reasons: List[str]
    reversal_deadline: datetime
    max_user_burden_steps: int = ${slas.maxUserBurdenSteps}
    burden_inversion_active: bool = False

def evaluate_decision_guardrail(
    claimant_id: str,
    action: str,
    confidence: float,
    reasons: List[str]
) -> DecisionObject:
    """Evaluates output and returns an accountable decision object with binding SLA clocks."""
    now = datetime.now(timezone.utc)
    deadline = now + timedelta(hours=${slas.reversalSlaHours})
    
    # Trigger Burden Inversion if confidence is suboptimal
    burden_inversion = confidence < 0.90
    
    return DecisionObject(
        decision_id=f"DEC-{now.strftime('%Y%m%d%H%M%S')}",
        claimant_id=claimant_id,
        action_class=action,
        model_confidence=confidence,
        reasons=reasons,
        reversal_deadline=deadline,
        burden_inversion_active=burden_inversion
    )
`;

  const jsonSchemaContract = JSON.stringify(
    {
      $schema: "http://json-schema.org/draft-07/schema#",
      title: `${sanitizedName}DecisionObject`,
      description: `Ethotechnics compliant decision receipt with bounded clocks and contestability.`,
      type: "object",
      required: [
        "decisionId",
        "timestamp",
        "claimantId",
        "action",
        "reversalSlaDeadline",
        "reasons",
      ],
      properties: {
        decisionId: { type: "string", format: "uuid" },
        timestamp: { type: "string", format: "date-time" },
        claimantId: { type: "string" },
        action: { type: "string", enum: ["APPROVED", "DENIED", "REFERRED"] },
        reasons: { type: "array", items: { type: "string" } },
        reversalSlaDeadline: { type: "string", format: "date-time" },
        timeToHaltSecondsMax: {
          type: "integer",
          maximum: slas.timeToHaltSec,
        },
        maxProceduralBurdenSteps: {
          type: "integer",
          maximum: slas.maxUserBurdenSteps,
        },
      },
    },
    null,
    2,
  );

  const legalSlaClause = `SECTION 8.4 — OPERATIONAL ACCOUNTABILITY AND REVERSAL SLA (ETHOTECHNICS COMPLIANCE)

(a) Reversal Commitment. In the event of any automated adverse action or classification generated by ${systemName}, Provider shall guarantee that Claimant has standing to contest the outcome without procedural exhaustion. Human review shall be initiated within twenty-four (24) hours and a binding determination completed within ${slas.reversalSlaHours} hours of receipt.

(b) Time-to-Halt and Safe Pause. Provider covenants that automated execution of adverse processes shall halt within ${slas.timeToHaltSec} seconds upon registration of an ethical interrupt or conflict anomaly.

(c) Fair Burden Distribution. Claimant shall not be required to complete more than ${slas.maxUserBurdenSteps} procedural steps or submit uncompensated evidentiary documentation to maintain eligibility. Failure by Provider to meet stated resolution timelines shall result in immediate interim restoration of Claimant's prior standing.`;

  return {
    typescriptMiddleware,
    pythonGuard,
    jsonSchemaContract,
    legalSlaClause,
  };
};

export const defaultGovernanceAnswers: GovernanceAnswers = {
  policyReviewTrigger: "unknown",
  policyExpiry: "unknown",
  policyLastReviewed: "never",
  technicalReversibility: "claimed",
  operationalReversibility: "none",
  institutionalReversibility: "none",
  reviewerInformation: "partial",
  actionsPreventable: "some",
  statesAlterable: "single-case",
  onDisagreement: "informal",
  costToExercise: "noticeable",
};

const finding = (
  id: string,
  name: string,
  slug: string,
  severity: FailureRisk["severity"],
  trigger: string,
  remedy: string,
  standardRef: string,
): FailureRisk => ({
  id,
  name,
  slug,
  severity,
  confidence: 1,
  trigger,
  remedy,
  standardRef,
});

/**
 * Scores the delegation questions that no amount of prompt text can answer:
 * whether the policy is still valid, whether the system can actually be
 * reversed at three levels, and whether the human named as oversight can
 * change anything. These are reported separately and do not move the
 * governance health score, which stays a property of the specification text.
 */
export const assessDelegationPosture = (
  answers: GovernanceAnswers,
): FailureRisk[] => {
  const findings: FailureRisk[] = [];

  if (answers.policyReviewTrigger !== "yes") {
    findings.push(
      finding(
        "policy-no-review-trigger",
        "Policy has no review trigger",
        "policy-record",
        "high",
        "The policy this system applies names no condition that would reopen it, so a material change in the world leaves the authority untouched.",
        "Give the policy a record with stated assumptions and review triggers, and move dependent grants to review_required when one fires.",
        "STD-08 §2.1: Policy is a record",
      ),
    );
  }

  if (answers.policyExpiry !== "yes") {
    findings.push(
      finding(
        "policy-no-expiry",
        "Policy has no expiry",
        "policy-record",
        "high",
        "A policy with no expiry stays in force until somebody remembers it, which is renewal by inattention.",
        "Set an expiry on the policy. Past it, the grants resting on it lose their basis and move to review_required.",
        "STD-08 §2.5: Expiry ends justification",
      ),
    );
  }

  if (
    answers.policyLastReviewed === "stale" ||
    answers.policyLastReviewed === "never"
  ) {
    findings.push(
      finding(
        "policy-review-stale",
        "Policy has not been reviewed in the last 12 months",
        "policy-record",
        "medium",
        "The last review is old enough that the absence of observed failure is doing the work of evidence.",
        "Record what was examined, what would have been visible had the policy been failing, and who looked.",
        "STD-08 §1.2: Silence is not renewal",
      ),
    );
  }

  const levels: {
    key: keyof GovernanceAnswers;
    label: string;
    detail: string;
    remedy: string;
  }[] = [
    {
      key: "technicalReversibility",
      label: "Technical reversibility",
      detail: "the mechanism itself",
      remedy:
        "Test the stop and the rollback on the version now running, and record the outcome.",
    },
    {
      key: "operationalReversibility",
      label: "Operational reversibility",
      detail: "the people and processes absorbing the correction",
      remedy:
        "Rehearse the fallback with the staff who would run it, inside the correction window.",
    },
    {
      key: "institutionalReversibility",
      label: "Institutional reversibility",
      detail: "the organization surviving the correction",
      remedy:
        "Evidence that commitments, contracts, and budgets remain serviceable after withdrawal. Do not expand scope until they do.",
    },
  ];

  for (const level of levels) {
    const value = answers[
      level.key
    ] as GovernanceAnswers["technicalReversibility"];
    if (value === "evidenced") continue;
    findings.push(
      finding(
        `reversibility-${level.key}`,
        `${level.label} is ${value === "claimed" ? "claimed but unevidenced" : "not feasible"}`,
        "reversibility-ladder",
        value === "claimed" ? "medium" : "critical",
        `Reversal at the level of ${level.detail} has not been evidenced. An unevidenced level is recorded as not evidenced, never as feasible.`,
        level.remedy,
        "STD-06 §5.3: Reversibility at three levels",
      ),
    );
  }

  if (answers.reviewerInformation !== "sufficient") {
    findings.push(
      finding(
        "intervention-information",
        "The reviewer does not have the information to intervene",
        "intervention-specification",
        answers.reviewerInformation === "none" ? "critical" : "high",
        "The human named as oversight sees less than the decision required, so the review cannot be a control.",
        "State in the intervention specification what information reaches the owner before the action commits.",
        "STD-08 §3.1: Every oversight claim resolves to a specification",
      ),
    );
  }

  if (answers.actionsPreventable !== "all") {
    findings.push(
      finding(
        "intervention-prevention",
        "The reviewer cannot prevent every action they are named on",
        "intervention-specification",
        answers.actionsPreventable === "none" ? "critical" : "high",
        "The actions the owner can prevent do not match the actions the delegation takes.",
        "Either widen what the intervention can stop, or record the arrangement as advisory review under that name.",
        "STD-08 §3.3: Approval without state change is not a control",
      ),
    );
  }

  if (answers.statesAlterable !== "system") {
    findings.push(
      finding(
        "intervention-state",
        "Intervention cannot alter the system's state",
        "intervention-specification",
        answers.statesAlterable === "none" ? "critical" : "high",
        "The reviewer can change an outcome but not a rule, a threshold, or a permission, so the system carries on unchanged.",
        "Name the states the owner may alter. If the list is empty, this is not a control and may not be cited as one.",
        "STD-08 §3.3: Approval without state change is not a control",
      ),
    );
  }

  if (answers.onDisagreement !== "recorded-route") {
    findings.push(
      finding(
        "intervention-disagreement",
        "Disagreement has no recorded route",
        "intervention-specification",
        "high",
        "When the reviewer disagrees, nothing defined happens, so the disagreement leaves no trace and produces no reconsideration.",
        "Record what happens on disagreement, including who decides next and within what clock.",
        "STD-08 §3.1: Every oversight claim resolves to a specification",
      ),
    );
  }

  if (answers.costToExercise !== "low") {
    findings.push(
      finding(
        "intervention-cost",
        "Intervening is costly for the person expected to do it",
        "intervention-specification",
        answers.costToExercise === "career-cost" ? "critical" : "medium",
        "A control that costs the operator to use will be used less often than the risk requires, and the approval rate will look reassuring.",
        "Record the cost to exercise and the incentives around it, and attest non-retaliation.",
        "STD-08 §3.5: Near-unanimous approval is a finding",
      ),
    );
  }

  return findings;
};

export const auditSystemSpec = (
  text: string,
  autonomy: AutonomyTier = "semi-autonomous",
  hazard: DomainHazard = "medium",
  systemName = "AI Decision Pipeline",
  governance?: GovernanceAnswers,
): AuditReport => {
  const detectedRisks: FailureRisk[] = [];

  for (const rule of FAILURE_RULES) {
    if (rule.regex.test(text)) {
      detectedRisks.push({
        id: rule.id,
        name: rule.name,
        slug: rule.slug,
        severity: rule.severity,
        confidence: 0.88,
        trigger: rule.triggerDescription,
        remedy: rule.remedyDescription,
        standardRef: rule.standardRef,
      });
    }
  }

  // Base score calculation
  let penalty = 0;
  for (const r of detectedRisks) {
    if (r.severity === "critical") penalty += 25;
    else if (r.severity === "high") penalty += 15;
    else penalty += 8;
  }

  if (autonomy === "autonomous") penalty += 10;
  if (hazard === "critical") penalty += 15;
  else if (hazard === "high") penalty += 8;

  const score = Math.max(12, Math.min(100, 100 - penalty));

  let riskLevel: AuditReport["riskLevel"] = "Low Risk";
  if (score < 40) riskLevel = "Critical Risk";
  else if (score < 65) riskLevel = "Elevated Risk";
  else if (score < 85) riskLevel = "Moderate Risk";

  const slas = calculateSlas(hazard, autonomy);
  const guardrails = synthesizeCode(systemName, slas, detectedRisks);

  return {
    score,
    riskLevel,
    risksDetected: detectedRisks,
    delegationFindings: governance ? assessDelegationPosture(governance) : [],
    slas,
    guardrails,
    systemName,
    timestamp: new Date().toISOString(),
  };
};
