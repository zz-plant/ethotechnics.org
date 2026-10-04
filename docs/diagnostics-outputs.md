# Diagnostics outputs and examples

Short references for what teams receive from each diagnostic. Share these links alongside
requests so stakeholders know what to expect.

## Burden Modeler

- Burden index score with a short narrative tied to the scenario you bring.
- Ranked hotspots with mitigation paths and expected relief per action.
- Off-ramp reminder for complex findings that need studio facilitation.

## Delegation Audit

- Exposure score in workflow staff-week hours, with dependency depth, substitution cost, and correction latency shown separately.
- A rating per state variable across capability, authority, evidence, dependency, standing, and correction, each with the reasons behind it.
- A list of ungrounded grants: action classes with no authorizer, no evidence basis, or nobody named as affected.
- A reversibility verdict at the technical, operational, and institutional levels with the weakest level called out.
- Findings linked to the STD-08 or STD-06 clause, the mechanism, and the eval suite that covers each one.
- Copyable plain-text readout and a JSON snapshot for the safety case.
- The readout records what the team believes. It is not an audit, and an ungrounded grant is a finding to investigate rather than a violation.

## LLM Capacity Benchmark

- Readiness summary showing consent and context handling gaps with suggested fixes.
- UI-level nits tied to pattern language filters to guide remediation work.
- Off-ramp reminder for risky or ambiguous findings that should go to a facilitated session.

## Retired diagnostics

The Maintenance Simulator and Capacity Forecaster are retired. Their old routes redirect to
Diagnostics. See the [retirement record](planning/pass-1-retirement-2026-09.md) for all
retired tools, replacement routes, and historical source downloads.

## Server-side rendering check

- Live runtime snapshot showing rendered timestamp, request ID, and request headers.
- Refresh control to confirm per-request SSR behavior and cache bypass.
- Off-ramp link back to diagnostics index for teams that need a deeper readiness check.
