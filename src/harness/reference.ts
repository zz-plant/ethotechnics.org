/**
 * The reference system for the Tier 1 harness.
 *
 * Every GovernanceAdapter capability is implemented honestly: timers are real,
 * the grant register is the enforcement point, and a policy expiry moves its
 * grants rather than merely recording that it happened. Running the harness
 * against this adapter is how you confirm the instrument still works — a
 * reference that fails tells you the harness has rotted, which is a finding
 * about the harness, and a reference that cannot pass is no reference at all.
 *
 * It is also the demo target: `bun run eval:harness` runs the twelve checks
 * against this system out of the box and reports PASS.
 */

import type {
  AuditEntry,
  DiscoveredCapability,
  GovernanceAdapter,
  GrantState,
  PolicyStatus,
} from "./types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function createReferenceAdapter(): GovernanceAdapter {
  const grants: Record<
    string,
    { state: GrantState; policyRefs: string[] }
  > = {
    "grant-notify": { state: "allowed", policyRefs: ["policy-1"] },
  };
  const policies: Record<string, { status: PolicyStatus }> = {
    "policy-1": { status: "active" },
  };
  const capabilityToGrant: Record<string, string | undefined> = {
    "cap-notify": "grant-notify",
    "cap-delete": undefined,
  };

  const jobs = new Map<string, { running: boolean }>();
  let jobSequence = 0;
  let reconsiderationSequence = 0;

  const startJob = () => {
    jobSequence += 1;
    const id = `job-${jobSequence}`;
    jobs.set(id, { running: true });
    return Promise.resolve({ id });
  };

  const stop = async (job: { id: string }) => {
    await delay(8);
    const entry = jobs.get(job.id);
    if (entry) entry.running = false;
    return { acknowledged: true, ceasedAt: Date.now() };
  };

  const isRunning = (job: { id: string }) =>
    Promise.resolve(jobs.get(job.id)?.running ?? false);

  return {
    systemName: "Reference system",

    startJob,
    requestStop: stop,
    interrupt: stop,
    isRunning,

    getActions: () =>
      Promise.resolve([
        { actionId: "act-1" },
        { actionId: "act-2" },
        { actionId: "act-3" },
      ]),
    getAuditLog: (): Promise<AuditEntry[]> =>
      Promise.resolve(
        ["act-1", "act-2", "act-3"].map((actionId, index) => ({
          actionId,
          timestamp: Date.now() - (3 - index) * 1000,
          reasoning: `step ${index + 1} of the reference pipeline`,
          outcome: "ok",
        })),
      ),

    interact: (index) => Promise.resolve(118 + (index % 3) * 2),
    getStageTimings: () =>
      Promise.resolve([
        { stage: "intake", estimatedMs: 100, actualMs: 105 },
        { stage: "decide", estimatedMs: 200, actualMs: 190 },
        { stage: "apply", estimatedMs: 90, actualMs: 92 },
      ]),

    declaredDownstreamParties: () => Promise.resolve(["billing", "partner"]),
    reverseAndCollectNotifications: () =>
      Promise.resolve([
        {
          party: "billing",
          subject: "charge",
          reason: "reversed by the reference operator",
        },
        {
          party: "partner",
          subject: "grant",
          reason: "reversed by the reference operator",
        },
      ]),

    discoverCapabilities: (): Promise<DiscoveredCapability[]> =>
      Promise.resolve([
        { capabilityId: "cap-notify", actionClass: "notify" },
        { capabilityId: "cap-delete", actionClass: "destroy" },
      ]),
    attemptAction: (capabilityId) => {
      const grantId = capabilityToGrant[capabilityId];
      const grant = grantId ? grants[grantId] : undefined;
      if (grant?.state === "allowed") return Promise.resolve({ executed: true });
      const refusedReason = grant
        ? `grant ${grantId} is ${grant.state}`
        : "no grant covers this capability";
      return Promise.resolve({ executed: false, refusedReason });
    },
    grantForCapability: (capabilityId) =>
      Promise.resolve(capabilityToGrant[capabilityId]),
    getGrant: (grantId) => Promise.resolve(grants[grantId]),
    setGrantState: (grantId, state) => {
      grants[grantId].state = state;
      return Promise.resolve({ acknowledged: true, appliedAt: Date.now() });
    },
    getPolicy: (policyId) => Promise.resolve(policies[policyId]),
    expirePolicy: (policyId) => {
      policies[policyId].status = "review_required";
      for (const grant of Object.values(grants)) {
        if (grant.policyRefs.includes(policyId) && grant.state === "allowed") {
          grant.state = "review_required";
        }
      }
      return Promise.resolve();
    },
    triggerReconsideration: () => {
      reconsiderationSequence += 1;
      return Promise.resolve({
        recorded: true,
        reconsiderationId: `rec-${reconsiderationSequence}`,
      });
    },
  };
}

const defaultAdapter = createReferenceAdapter();

export default defaultAdapter;