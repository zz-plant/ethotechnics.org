# Mini-PRDs: accountability tools series

Developer-facing draft to align copy, UX, and implementation planning for the four feature narratives
requested for the site. Keep tone in "the workshop" and avoid moralizing. Each PRD includes a
positioning line, core hooks, and concrete delivery steps.

## Guiding tone

- "You have the principles; here are the tools to make them actually work."
- Frame features as reliability, readiness, or UX quality, not compliance guilt.
- Use phrases like "Operationalizing Trust" and "Engineering Agency" when helpful.

## Homepage welcome blurb

Welcome to Ethotechnics — where AI ethics becomes operational. We bridge principle and practice
with tools that help teams measure, test, and ship accountability in real systems. If traditional
AI ethics explains why care matters, Ethotechnics delivers the how: diagnostics, mechanisms, and
workflows that operationalize trust and help teams engineer agency at speed.

## Priority order

1. MRT Dashboard — "The SRE of Ethics."
2. Maintenance Debt Calculator — "The Business Case for Safety."
3. Friction API — "Better UX / Dignity in Design."
4. Stoppability Sandbox — "Advanced Training / Flight Sim."

## MRT Dashboard (The "Heartbeat" of Accountability)

**Hook**: "Stop guessing if your AI is aligned. Start measuring how fast you can protect it."

**User goal**: A lead engineer or compliance officer wants proof they can control a live system.

**Key feature**: Veto Latency Tracker — telemetry dashboard that integrates with Datadog/New Relic.

**Non-alienating framing**: System reliability. "We help you minimize Accountability Latency during
an incident."

**Positioning line**: "The SRE view of ethics: measure, alert, and reduce response time to safety
actions."

**Implementation plan**

- Define the telemetry contract: event names, timestamps, and tags needed to calculate veto
  latency.
- Draft example integrations for Datadog/New Relic dashboards (screenshots optional).
- Add a mechanism page entry + homepage feature highlight.
- Provide a sample incident readout that demonstrates accountability latency reduction.

**Open questions**

- Which baseline latency target should we recommend (or make configurable)?
- Should integrations ship as exportable JSON dashboards or step-by-step setup guides?

## Maintenance Debt Calculator (The "Value" Bridge)

**Hook**: "Translate your values into a business case."

**User goal**: An ethics lead or CEO needs to justify safety engineering budget.

**Key feature**: Risk-to-Revenue Mapper — calculator that maps decision speed to potential cost of
uncontrolled vs. stoppable actions.

**Non-alienating framing**: Insurance + risk mitigation language, CFO-friendly outputs.

**Positioning line**: "Put a price on risk and make safety a CFO-clear investment."

**Implementation plan**

- Define inputs (decision speed, incident severity, governance readiness, intervention cost).
- Draft the formula and output tiers (low / medium / high maintenance debt risk).
- Write UI copy for the flow and downloadable readout.
- Place in diagnostics section with a "shareable output" pattern.

**Open questions**

- Are input defaults grounded in existing field data or heuristic ranges?
- Should the calculator output include remediation steps or only the financial delta?

## Friction API (The "Quality Control" Layer)

**Hook**: "Give your users the gift of time."

**User goal**: UX designers and developers want to prevent automation bias without heavy-handed
throttling.

**Key feature**: Entropy-Based UI Throttle — adds ~500ms when model confidence is low.

**Non-alienating framing**: UX premium and mindful design, not regulatory delay.

**Positioning line**: "Slow down only when it matters; boost attention when the system is
uncertain."

**Implementation plan**

- Define the confidence signal and entropy threshold that triggers the delay.
- Provide API interface and sample pseudo-code for clients.
- Add an integration checklist for design and engineering teams.
- Capture UX copy that positions the pause as intentional, not a failure.

**Open questions**

- Which models will expose the confidence signal reliably (and how do we normalize it)?
- Do we need a UI token to explain the pause to end users in high-risk contexts?

## Stoppability Sandbox (The "Flight Simulator")

**Hook**: "The safest place to fail is here."

**User goal**: Product managers want to test "what-if" scenarios without production risk.

**Key feature**: Scenario Shunting — simulate "Legal Override" or "Community Veto" and observe
system response.

**Non-alienating framing**: Fire drills and readiness, not accusations.

**Positioning line**: "A flight sim for accountable systems — practice the hard stops before the
real emergency."

**Implementation plan**

- List canonical scenarios and expected system behaviors.
- Define sandbox flow: setup → scenario selection → simulation → readout.
- Add readiness metrics (time to halt, time to recover, audit trail completeness).
- Position in mechanisms or diagnostics as an advanced readiness tool.

**Open questions**

- Should the sandbox surface as a guided workshop or self-serve tool?
- Do we need a library of system archetypes for faster onboarding?
