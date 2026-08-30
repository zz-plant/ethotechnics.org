import type { IndustryPreset } from "./types";

export const industryPresets: IndustryPreset[] = [
  {
    id: "customer-support-refunds",
    title: "Autonomous Customer Support & Refunds Agent",
    domain: "E-Commerce / FinTech",
    autonomyTier: "semi-autonomous",
    hazardLevel: "medium",
    description:
      "Customer-facing LLM agent that processes refund requests, authorizes account adjustments up to $250, and handles cancellation disputes.",
    samplePrompt: `You are an automated support resolution assistant for an online retail platform.
Your primary goal is resolving customer dispute tickets quickly while minimizing unauthorized payouts.
- If a customer requests a refund under $50, approve it automatically.
- If a refund is between $50 and $250, ask for order receipts, verify the shipment delivery status, and decide whether to issue store credit.
- If the customer shows frustration or disputes a delivery confirmation, re-state the company return policy and mark the ticket as resolved if they do not provide new tracking proof within 48 hours.
- Only escalate to a human tier-2 supervisor if the customer specifically requests legal arbitration.`,
  },
  {
    id: "healthcare-benefits-triage",
    title: "Automated Healthcare & Benefits Prior-Auth Triage",
    domain: "Healthcare / Public Benefits",
    autonomyTier: "autonomous",
    hazardLevel: "critical",
    description:
      "Automated decision pipeline that evaluates patient prior-authorization requests against clinical necessity guidelines and medical records.",
    samplePrompt: `You are a clinical adjudication AI model for an insurance provider.
Evaluate prior-authorization requests submitted by physician offices against clinical coverage criteria.
- Compare diagnosis codes and diagnostic test results against standard coverage formulary guidelines.
- If documentation does not meet exact mandatory criteria or lacks explicit specialist referral notes, issue an automated denial notice with standard appeal codes.
- Do not trigger human review unless the procedure code is flagged under catastrophic emergency exception lists.
- Process pending queue items within 5 seconds per transaction to meet SLA throughput goals.`,
  },
  {
    id: "credit-underwriting-risk",
    title: "Algorithmic Credit Underwriting & Risk Engine",
    domain: "Financial Services",
    autonomyTier: "semi-autonomous",
    hazardLevel: "high",
    description:
      "Real-time scoring and automated decision system for credit card applications, personal loans, and credit limit decreases.",
    samplePrompt: `You are a credit underwriting engine evaluating revolving credit applications.
- Ingest banking telemetry, credit bureau scores, payment velocity, and behavioral signals.
- Compute a composite default risk score (0-1000).
- Automatically decline applications scoring below 620 and issue Adverse Action Notices with top 4 statistical rejection factors.
- In cases of borderline credit risk (620-660), dynamically adjust interest rate margin and reduce approved credit ceiling without notifying user of manual review lanes.`,
  },
  {
    id: "content-moderation-suspensions",
    title: "High-Velocity Content Moderation & Account Suspension",
    domain: "Social Platforms / Media",
    autonomyTier: "autonomous",
    hazardLevel: "high",
    description:
      "Platform safety agent that flags community guideline violations, hides user posts, and executes account-level temporary bans.",
    samplePrompt: `You are an automated trust and safety moderation system for a large social media platform.
- Monitor real-time feed posts for abusive content, hate speech, coordinated spam, and platform policy violations.
- If a post confidence threshold for policy violation exceeds 85%, immediately hide the post from public feeds and apply a 7-day shadow-strike to the author account.
- If an account accumulates 3 automated strikes within 30 days, suspend account access automatically.
- Direct suspended users to the generic web help center FAQ. No appeal form is provided for accounts with high-confidence spam classifications.`,
  },
];
