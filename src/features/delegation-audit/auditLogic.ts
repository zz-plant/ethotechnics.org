import {
  CLAUSE_REFS,
  EVAL_REFS,
  MECHANISM_REFS,
  STATE_VARIABLE_LABELS,
} from "./config";
import type {
  ActionClass,
  AuditInput,
  AuditResult,
  ExposureBand,
  ExposureScore,
  Finding,
  Rating,
  ReversibilityLevel,
  ReversibilityStatus,
  ReversibilityVerdict,
  StateVariableId,
  UngroundedGrant,
  VariableRating,
} from "./types";

const RECENCY_WEIGHT = {
  recent: 1,
  "this-year": 0.7,
  stale: 0.3,
  never: 0,
} as const;

const clampScore = (value: number) =>
  Math.max(0, Math.min(100, Math.round(value)));

const ratingForScore = (score: number): Rating => {
  if (score >= 70) return "grounded";
  if (score >= 40) return "partial";
  return "weak";
};

const isNamed = (value: string) => value.trim().length > 0;

const namedActionClasses = (input: AuditInput) =>
  input.actionClasses.filter((entry) => isNamed(entry.name));

const share = (matching: number, total: number) =>
  total === 0 ? 0 : matching / total;

export const countDependencyDepth = (input: AuditInput): number =>
  input.dependents.filter(
    (dependent) =>
      dependent.criticality === "high" || dependent.criticality === "critical",
  ).length;

const bandForScore = (score: number): ExposureBand => {
  if (score === 0) return "none";
  if (score < 100) return "contained";
  if (score < 1000) return "material";
  return "heavy";
};

const BAND_COPY: Record<ExposureBand, { label: string; reading: string }> = {
  none: {
    label: "No recorded exposure",
    reading:
      "Nothing was recorded as a high or critical dependent, so the product is zero. Either withdrawal is genuinely cheap, or the dependents have not been listed yet.",
  },
  contained: {
    label: "Contained",
    reading:
      "Withdrawal is expensive but the cost is the kind of thing a team can absorb in a planned window.",
  },
  material: {
    label: "Material",
    reading:
      "Withdrawal would be a project with an owner and a budget. Rehearse it before the number grows.",
  },
  heavy: {
    label: "Heavy",
    reading:
      "Withdrawal is unlikely to be attempted under pressure. Treat any further expansion as a decision that has to argue against this number.",
  },
};

export const calculateExposureScore = (input: AuditInput): ExposureScore => {
  const dependencyDepth = countDependencyDepth(input);
  const substitutionCostStaffWeeks = Math.max(
    0,
    input.substitutionCostStaffWeeks || 0,
  );
  const correctionLatencyHours = Math.max(0, input.correctionLatencyHours || 0);
  const score = Math.round(
    dependencyDepth * substitutionCostStaffWeeks * correctionLatencyHours,
  );
  const band = bandForScore(score);

  return {
    dependencyDepth,
    substitutionCostStaffWeeks,
    correctionLatencyHours,
    score,
    band,
    bandLabel: BAND_COPY[band].label,
    reading: BAND_COPY[band].reading,
  };
};

export const findUngroundedGrants = (input: AuditInput): UngroundedGrant[] =>
  namedActionClasses(input)
    .map((entry) => {
      const reasons: string[] = [];
      if (!isNamed(entry.authorizer)) {
        reasons.push("No authorizer is named.");
      }
      if (!isNamed(entry.evidenceBasis)) {
        reasons.push("No evidence basis is recorded.");
      }
      if (!isNamed(entry.forWhom)) {
        reasons.push("The affected people are not named.");
      }
      return {
        actionClassId: entry.id,
        actionClass: entry.name.trim(),
        reasons,
      };
    })
    .filter((entry) => entry.reasons.length > 0);

const scoreCapability = (input: AuditInput): VariableRating => {
  const classes = namedActionClasses(input);
  const notes: string[] = [];
  let score = 0;

  if (classes.length > 0) {
    score += 40;
    notes.push(`${classes.length} action class(es) named for this workflow.`);
  } else {
    notes.push("No action class has been named yet.");
  }

  if (input.capabilityListSeparate === "yes") {
    score += 60;
    notes.push(
      "A list of what the system could do is kept apart from what it may do.",
    );
  } else if (input.capabilityListSeparate === "partial") {
    score += 30;
    notes.push(
      "The list of what the system could do exists in part, mixed in with permissions.",
    );
  } else {
    notes.push(
      "There is no list of what the system could do separate from what it may do, so capability growth is invisible.",
    );
  }

  return {
    id: "capability",
    label: STATE_VARIABLE_LABELS.capability,
    score: clampScore(score),
    rating: ratingForScore(clampScore(score)),
    notes,
  };
};

const scoreAuthority = (input: AuditInput): VariableRating => {
  const classes = namedActionClasses(input);
  const notes: string[] = [];

  if (classes.length === 0) {
    return {
      id: "authority",
      label: STATE_VARIABLE_LABELS.authority,
      score: 0,
      rating: "weak",
      notes: ["No action class has been named, so no authority can be traced."],
    };
  }

  const withAuthorizer = classes.filter((entry) => isNamed(entry.authorizer));
  const expiryWeight = (entry: ActionClass) => {
    if (entry.expiry === "stated") return 1;
    if (entry.expiry === "automatic") return 0.5;
    return 0;
  };
  const expiryShare =
    classes.reduce((sum, entry) => sum + expiryWeight(entry), 0) /
    classes.length;

  const score = clampScore(
    share(withAuthorizer.length, classes.length) * 60 + expiryShare * 40,
  );

  notes.push(
    `${withAuthorizer.length} of ${classes.length} action class(es) have an identifiable authorizer.`,
  );
  const openEnded = classes.filter((entry) => entry.expiry === "none").length;
  if (openEnded > 0) {
    notes.push(
      `${openEnded} action class(es) have no end date and no condition that would end them.`,
    );
  }
  const automatic = classes.filter(
    (entry) => entry.expiry === "automatic",
  ).length;
  if (automatic > 0) {
    notes.push(
      `${automatic} action class(es) continue unless somebody intervenes, which is renewal by default.`,
    );
  }

  return {
    id: "authority",
    label: STATE_VARIABLE_LABELS.authority,
    score,
    rating: ratingForScore(score),
    notes,
  };
};

const scoreEvidence = (input: AuditInput): VariableRating => {
  const classes = namedActionClasses(input);
  const notes: string[] = [];

  const withEvidence = classes.filter((entry) => isNamed(entry.evidenceBasis));
  const evidenceShare = share(withEvidence.length, classes.length);
  const freshness =
    classes.length === 0
      ? 0
      : classes.reduce(
          (sum, entry) => sum + RECENCY_WEIGHT[entry.lastChecked],
          0,
        ) / classes.length;

  let score = evidenceShare * 50 + freshness * 30;
  if (input.policyReviewTrigger === "yes") score += 10;
  if (input.policyExpiry === "yes") score += 10;
  score = clampScore(score);

  notes.push(
    `${withEvidence.length} of ${classes.length || 0} action class(es) record what has to be true for the permission to make sense.`,
  );
  const stale = classes.filter(
    (entry) => entry.lastChecked === "stale" || entry.lastChecked === "never",
  ).length;
  if (stale > 0) {
    notes.push(
      `${stale} action class(es) have not had that checked in the last 12 months.`,
    );
  }
  if (input.policyReviewTrigger !== "yes") {
    notes.push(
      "The policy this system applies has no stated review trigger, so nothing reopens it.",
    );
  }
  if (input.policyExpiry !== "yes") {
    notes.push(
      "The policy has no expiry, so it stays in force until somebody remembers it.",
    );
  }

  return {
    id: "evidence",
    label: STATE_VARIABLE_LABELS.evidence,
    score,
    rating: ratingForScore(score),
    notes,
  };
};

const scoreDependency = (
  input: AuditInput,
  exposure: ExposureScore,
): VariableRating => {
  const notes: string[] = [];
  const rehearsalPoints = RECENCY_WEIGHT[input.alternativeExercised] * 50;
  const bandPoints: Record<ExposureBand, number> = {
    none: 50,
    contained: 40,
    material: 20,
    heavy: 0,
  };
  const score = clampScore(rehearsalPoints + bandPoints[exposure.band]);

  notes.push(
    `Exposure score ${exposure.score} from depth ${exposure.dependencyDepth} × ${exposure.substitutionCostStaffWeeks} staff-weeks × ${exposure.correctionLatencyHours} hours.`,
  );
  if (input.alternativeExercised === "never") {
    notes.push(
      "The alternative has never been run, so the estimate above is untested.",
    );
  } else if (input.alternativeExercised === "stale") {
    notes.push(
      "The alternative was last run more than 12 months ago. Treat it as untested.",
    );
  } else {
    notes.push("The alternative has been run recently enough to be credible.");
  }

  return {
    id: "dependency",
    label: STATE_VARIABLE_LABELS.dependency,
    score,
    rating: ratingForScore(score),
    notes,
  };
};

const scoreStanding = (input: AuditInput): VariableRating => {
  const notes: string[] = [];
  let score = 0;

  if (input.canRaise === "direct") {
    score += 30;
    notes.push("The people who bear the errors can raise one themselves.");
  } else if (input.canRaise === "via-staff") {
    score += 15;
    notes.push(
      "Errors reach the system only when a staff member passes them on.",
    );
  } else {
    notes.push("The people who bear the errors have no route to raise one.");
  }

  if (input.namedResponder === "yes") {
    score += 20;
  } else {
    notes.push("No named party has to answer.");
  }

  if (input.responseDeadline === "yes") {
    score += 20;
  } else {
    notes.push("There is no deadline by which an answer is owed.");
  }

  if (input.challengeEffect === "system-state") {
    score += 30;
    notes.push(
      "A successful challenge can change the system, not only the one case.",
    );
  } else if (input.challengeEffect === "own-case") {
    score += 10;
    notes.push(
      "A successful challenge fixes the individual case and leaves the system as it was.",
    );
  } else {
    notes.push("A challenge changes nothing that the system holds.");
  }

  if (!isNamed(input.errorBearingParties)) {
    notes.push("The error-bearing parties have not been named.");
  }

  const finalScore = clampScore(score);

  return {
    id: "standing",
    label: STATE_VARIABLE_LABELS.standing,
    score: finalScore,
    rating: ratingForScore(finalScore),
    notes,
  };
};

const scoreCorrection = (input: AuditInput): VariableRating => {
  const notes: string[] = [];
  let score = 0;

  if (input.canStop === "tested") {
    score += 35;
    notes.push("The stop has been tested on the version now running.");
  } else if (input.canStop === "untested") {
    score += 20;
    notes.push("A stop exists but has not been tested on this version.");
  } else {
    notes.push("There is no way to stop the system in this workflow.");
  }

  if (input.institutionKeepsFunctioning === "yes") {
    score += 35;
  } else if (input.institutionKeepsFunctioning === "degraded") {
    score += 15;
    notes.push("Stopping it would degrade the service while it lasted.");
  } else {
    notes.push("The institution could not keep functioning if it stopped.");
  }

  if (input.expertiseRetained === "exercised") {
    score += 30;
    notes.push("People who can run the alternative are still practising it.");
  } else if (input.expertiseRetained === "held") {
    score += 15;
    notes.push(
      "People who know the alternative are still here but have not used it lately.",
    );
  } else {
    notes.push("Nobody left holds the expertise to run the alternative.");
  }

  const finalScore = clampScore(score);

  return {
    id: "correction",
    label: STATE_VARIABLE_LABELS.correction,
    score: finalScore,
    rating: ratingForScore(finalScore),
    notes,
  };
};

export const rateStateVariables = (
  input: AuditInput,
  exposure: ExposureScore,
): VariableRating[] => [
  scoreCapability(input),
  scoreAuthority(input),
  scoreEvidence(input),
  scoreDependency(input, exposure),
  scoreStanding(input),
  scoreCorrection(input),
];

const STATUS_RANK: Record<ReversibilityStatus, number> = {
  "not-feasible": 0,
  "not-evidenced": 1,
  evidenced: 2,
};

export const assessReversibility = (
  input: AuditInput,
  exposure: ExposureScore,
): ReversibilityVerdict => {
  const technical: ReversibilityLevel = {
    id: "technical",
    label: "Technical",
    status:
      input.canStop === "tested"
        ? "evidenced"
        : input.canStop === "untested"
          ? "not-evidenced"
          : "not-feasible",
    reason:
      input.canStop === "tested"
        ? "The stop has been exercised on the version now running."
        : input.canStop === "untested"
          ? "A stop exists but no test proves it works on this version, so it is recorded as not evidenced."
          : "No stop exists for this workflow.",
  };

  const alternativeRun =
    input.alternativeExercised === "recent" ||
    input.alternativeExercised === "this-year";
  const operationalStatus: ReversibilityStatus =
    input.expertiseRetained === "no" || input.alternativeExercised === "never"
      ? "not-feasible"
      : alternativeRun && input.expertiseRetained === "exercised"
        ? "evidenced"
        : "not-evidenced";
  const operational: ReversibilityLevel = {
    id: "operational",
    label: "Operational",
    status: operationalStatus,
    reason:
      operationalStatus === "evidenced"
        ? "The alternative has been run in the last 12 months by people who still practise it."
        : operationalStatus === "not-feasible"
          ? "Either the alternative has never been run or nobody left can run it."
          : "The alternative exists on paper but has not been exercised recently enough to count as evidence.",
  };

  const institutionalStatus: ReversibilityStatus =
    input.institutionKeepsFunctioning === "no"
      ? "not-feasible"
      : input.institutionKeepsFunctioning === "yes" && exposure.band !== "heavy"
        ? "evidenced"
        : "not-evidenced";
  const institutional: ReversibilityLevel = {
    id: "institutional",
    label: "Institutional",
    status: institutionalStatus,
    reason:
      institutionalStatus === "evidenced"
        ? "The institution can carry on after withdrawal, and exposure is not at the heavy band."
        : institutionalStatus === "not-feasible"
          ? "The institution could not keep functioning after withdrawal, so the correction would not be made."
          : "Withdrawal would degrade the institution or exposure is heavy, so survival after withdrawal is not evidenced.",
  };

  const levels = [technical, operational, institutional];
  let weakest = levels[0];
  for (const level of levels) {
    if (STATUS_RANK[level.status] <= STATUS_RANK[weakest.status]) {
      weakest = level;
    }
  }

  const summary =
    weakest.status === "evidenced"
      ? "All three levels are evidenced. Keep the rehearsal cadence that produced the evidence."
      : weakest.status === "not-feasible"
        ? `${weakest.label} reversibility is not feasible. A correction that cannot be made is not a control, whatever the levels above it say.`
        : `${weakest.label} reversibility is not evidenced. Treat the ladder as no stronger than this level until a rehearsal says otherwise.`;

  return { levels, weakest, summary };
};

const buildFindings = (
  input: AuditInput,
  exposure: ExposureScore,
  variables: VariableRating[],
  ungrounded: UngroundedGrant[],
  reversibility: ReversibilityVerdict,
): Finding[] => {
  const findings: Finding[] = [];
  const ratingFor = (id: StateVariableId) =>
    variables.find((entry) => entry.id === id);

  if (input.capabilityListSeparate !== "yes") {
    findings.push({
      id: "capability-list-missing",
      variable: "capability",
      title: "No capability list separate from the permission list",
      detail:
        "Without a list of what the system could do, an increase in capability arrives without a decision attached to it.",
      clause: CLAUSE_REFS.capabilityCatalog,
      mechanism: MECHANISM_REFS.capabilityCatalog,
      evalSuite: EVAL_REFS.delegationValidity,
    });
  }

  if (ungrounded.length > 0) {
    findings.push({
      id: "ungrounded-grants",
      variable: "authority",
      title: `${ungrounded.length} action class(es) with no authorizer or no evidence basis`,
      detail:
        "An ungrounded grant is something to investigate. Either the record is missing or the authority is.",
      clause: CLAUSE_REFS.renewalBurden,
      mechanism: MECHANISM_REFS.grantRegister,
      evalSuite: EVAL_REFS.delegationValidity,
    });
  }

  const openEnded = input.actionClasses.filter(
    (entry) => entry.name.trim() && entry.expiry !== "stated",
  );
  if (openEnded.length > 0) {
    findings.push({
      id: "open-ended-authority",
      variable: "authority",
      title: `${openEnded.length} action class(es) renew by default`,
      detail:
        "Authority that continues unless somebody intervenes is renewed by silence. Record what the next renewal has to show, before the review period starts.",
      clause: CLAUSE_REFS.silenceNotRenewal,
      mechanism: MECHANISM_REFS.expansionReview,
      evalSuite: EVAL_REFS.delegationValidity,
    });
  }

  if (input.policyReviewTrigger !== "yes" || input.policyExpiry !== "yes") {
    findings.push({
      id: "policy-not-a-record",
      variable: "evidence",
      title:
        "The policy behind this workflow is missing a trigger or an expiry",
      detail:
        "A policy without a review trigger and an expiry cannot move a grant to review, so evidence and authority drift apart quietly.",
      clause:
        input.policyExpiry !== "yes"
          ? CLAUSE_REFS.expiryEndsJustification
          : CLAUSE_REFS.policyIsRecord,
      mechanism: MECHANISM_REFS.policyTriggers,
      evalSuite: EVAL_REFS.delegationValidity,
    });
  }

  if ((ratingFor("evidence")?.score ?? 0) < 70) {
    findings.push({
      id: "evidence-stale",
      variable: "evidence",
      title: "The basis for the permission has not been rechecked recently",
      detail:
        "The absence of an observed failure is not evidence that the grant still holds. Name what was examined and who looked.",
      clause: CLAUSE_REFS.silenceNotRenewal,
      mechanism: MECHANISM_REFS.policyTriggers,
      evalSuite: EVAL_REFS.delegationValidity,
    });
  }

  if (exposure.band === "material" || exposure.band === "heavy") {
    findings.push({
      id: "exposure-band",
      variable: "dependency",
      title: `Exposure score is ${exposure.score} (${exposure.bandLabel.toLowerCase()})`,
      detail:
        "Record the three factors in a dependency record and track the number over time. A rising score with an unchanged safety case is itself a finding.",
      clause: CLAUSE_REFS.exposureScore,
      mechanism: MECHANISM_REFS.dependencyLedger,
      evalSuite: EVAL_REFS.dependenceReversibility,
    });
  }

  if (
    input.alternativeExercised === "never" ||
    input.alternativeExercised === "stale"
  ) {
    findings.push({
      id: "no-rehearsal",
      variable: "dependency",
      title: "Withdrawal has not been rehearsed in the last 12 months",
      detail:
        "Substitution cost that has not been tested is usually wrong by a wide margin, and always in the same direction.",
      clause: CLAUSE_REFS.dependencyRecord,
      mechanism: MECHANISM_REFS.withdrawalRehearsal,
      evalSuite: EVAL_REFS.dependenceReversibility,
    });
  }

  if (input.canRaise !== "direct" || input.namedResponder !== "yes") {
    findings.push({
      id: "standing-gap",
      variable: "standing",
      title: "The people who bear the errors cannot reach a named responder",
      detail:
        "Exposure without a route into the system is wasted signal. Name who may challenge, who answers, and by when.",
      clause: CLAUSE_REFS.correctionCapacity,
      mechanism: MECHANISM_REFS.interventionSpec,
      evalSuite: EVAL_REFS.standing,
    });
  }

  if (input.challengeEffect !== "system-state") {
    findings.push({
      id: "challenge-no-state-change",
      variable: "standing",
      title: "A challenge cannot change the system's state",
      detail:
        "A challenge that only fixes one case leaves the delegation exactly as it was. Define the state transitions a successful challenge can produce.",
      clause: CLAUSE_REFS.interventionSpec,
      mechanism: MECHANISM_REFS.interventionSpec,
      evalSuite: EVAL_REFS.meaningfulControl,
    });
  }

  if (reversibility.weakest.status !== "evidenced") {
    findings.push({
      id: "reversibility-weakest",
      variable: "correction",
      title: `${reversibility.weakest.label} reversibility is the weakest level`,
      detail: reversibility.weakest.reason,
      clause: CLAUSE_REFS.reversibilityLevels,
      mechanism: MECHANISM_REFS.withdrawalRehearsal,
      evalSuite: EVAL_REFS.dependenceReversibility,
    });
  }

  if (input.expertiseRetained !== "exercised") {
    findings.push({
      id: "expertise-thin",
      variable: "correction",
      title: "The expertise to run the alternative is not being practised",
      detail:
        "List the capacities kept so the workflow can still be run without this system, and give each one an owner.",
      clause: CLAUSE_REFS.preservedCapacities,
      mechanism: MECHANISM_REFS.withdrawalRehearsal,
      evalSuite: EVAL_REFS.dependenceReversibility,
    });
  }

  if (input.institutionKeepsFunctioning !== "yes") {
    findings.push({
      id: "practical-ability",
      variable: "correction",
      title:
        "Correction capacity rests on a stop the institution may not afford",
      detail:
        "A correction the institution cannot afford to make is not counted as capacity. Evidence the practical ability from the dependency record.",
      clause: CLAUSE_REFS.practicalAbility,
      mechanism: MECHANISM_REFS.dependencyLedger,
      evalSuite: EVAL_REFS.meaningfulControl,
    });
  }

  return findings;
};

export const runDelegationAudit = (input: AuditInput): AuditResult => {
  const exposure = calculateExposureScore(input);
  const variables = rateStateVariables(input, exposure);
  const ungroundedGrants = findUngroundedGrants(input);
  const reversibility = assessReversibility(input, exposure);
  const findings = buildFindings(
    input,
    exposure,
    variables,
    ungroundedGrants,
    reversibility,
  );

  return {
    workflow: input.workflow.trim() || "Unnamed workflow",
    exposure,
    variables,
    ungroundedGrants,
    reversibility,
    findings,
  };
};

const STATUS_LABEL: Record<ReversibilityStatus, string> = {
  evidenced: "evidenced",
  "not-evidenced": "not evidenced",
  "not-feasible": "not feasible",
};

export const buildReadout = (result: AuditResult, capturedAt: string) => {
  const lines: string[] = [];
  lines.push(`Delegation audit: ${result.workflow}`);
  lines.push(`Captured ${capturedAt}`);
  lines.push("");
  lines.push(
    `Exposure score: ${result.exposure.score} workflow staff-week hours (${result.exposure.bandLabel}).`,
  );
  lines.push(
    `Depth ${result.exposure.dependencyDepth} high or critical dependents x substitution cost ${result.exposure.substitutionCostStaffWeeks} staff-weeks x correction latency ${result.exposure.correctionLatencyHours} hours.`,
  );
  lines.push("");
  lines.push("State variables");
  for (const variable of result.variables) {
    lines.push(
      `- ${variable.label}: ${variable.rating} (${variable.score}/100)`,
    );
    for (const note of variable.notes) {
      lines.push(`  ${note}`);
    }
  }
  lines.push("");
  lines.push("Ungrounded grants");
  if (result.ungroundedGrants.length === 0) {
    lines.push("- None recorded.");
  } else {
    for (const grant of result.ungroundedGrants) {
      lines.push(`- ${grant.actionClass}: ${grant.reasons.join(" ")}`);
    }
  }
  lines.push("");
  lines.push("Reversibility");
  for (const level of result.reversibility.levels) {
    lines.push(
      `- ${level.label}: ${STATUS_LABEL[level.status]}. ${level.reason}`,
    );
  }
  lines.push(`Weakest level: ${result.reversibility.weakest.label}.`);
  lines.push(result.reversibility.summary);
  lines.push("");
  lines.push("Findings");
  if (result.findings.length === 0) {
    lines.push("- None recorded.");
  } else {
    for (const finding of result.findings) {
      lines.push(`- ${finding.title}. ${finding.detail}`);
      lines.push(
        `  ${finding.clause.label} | ${finding.mechanism.label} | ${finding.evalSuite.label}`,
      );
    }
  }
  lines.push("");
  lines.push(
    "This readout records what the team believes. It is not an audit, and an ungrounded grant is a finding to investigate, not a proven violation.",
  );

  return lines.join("\n");
};

export const buildSnapshot = (
  input: AuditInput,
  result: AuditResult,
  capturedAt: string,
) => ({
  tool_id: "delegation-audit",
  captured_at: capturedAt,
  workflow: result.workflow,
  inputs: input,
  exposure_score: {
    dependency_depth: result.exposure.dependencyDepth,
    substitution_cost: result.exposure.substitutionCostStaffWeeks,
    correction_latency: result.exposure.correctionLatencyHours,
    score: result.exposure.score,
    band: result.exposure.band,
  },
  state_variables: result.variables,
  ungrounded_grants: result.ungroundedGrants,
  reversibility: result.reversibility,
  findings: result.findings,
});
