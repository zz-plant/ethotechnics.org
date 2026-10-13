import decisionModelGateRecord from "../../public/standards/worked-examples/decision-model-gate/decision-record.json";

/**
 * The clocks each worked example under /use-cases/examples runs on.
 *
 * A page's receipt payload, its description, and its ClockTimeline figure all
 * read the hours from here, so the three cannot disagree. Every clock starts
 * at the decision. `ifMissed` follows STD-02 §3.2: when a clock runs out
 * without a resolution, the case escalates to a higher authority or the
 * decision defaults to reversal.
 */

/** The keys a receipt's `clocks` block carries. */
export type ReceiptClockKey = "ack" | "review" | "remedy" | "appeal";

export type Clock = {
  /** Receipt key, or "notice" for a deadline the receipt records apart. */
  key: ReceiptClockKey | "notice";
  /** Sentence-case stage name. */
  label: string;
  /** Hours from the decision to the deadline. */
  hours: number;
  /** What has to have happened by the deadline. */
  due: string;
  /** What happens when the deadline passes without it. */
  ifMissed: string;
};

export type ClockSet = {
  /** The decision that starts every clock, in a few words. */
  start: string;
  /** In deadline order. */
  clocks: Clock[];
};

export type UseCaseClockSlug =
  | "automated-account-lock"
  | "automated-eligibility-denial"
  | "content-moderation-takedown"
  | "decision-model-gate"
  | "fraud-hold-delayed-notice"
  | "irreversible-payment-compensation";

const dmg = decisionModelGateRecord.clocks;

export const useCaseClocks: Record<UseCaseClockSlug, ClockSet> = {
  "automated-account-lock": {
    start: "The fraud model locks the account and a receipt is issued.",
    clocks: [
      {
        key: "ack",
        label: "Acknowledge",
        hours: 2,
        due: "Risk Operations confirms it owns the case and tells the account holder when review will finish.",
        ifMissed:
          "The case goes to the on-call fraud steward, who can reverse the lock alone.",
      },
      {
        key: "review",
        label: "Review",
        hours: 24,
        due: "A person keeps the lock, records an exception, or reverses it.",
        ifMissed:
          "The lock lifts by default, unless a logged security exception has extended the clock.",
      },
      {
        key: "remedy",
        label: "Remedy",
        hours: 72,
        due: "The account is unlocked, the holder is compensated, or a fallback keeps essential access open.",
        ifMissed:
          "The breach is logged against Risk Operations, and credits for the locked time keep running.",
      },
    ],
  },
  "irreversible-payment-compensation": {
    start: "The receipt is issued and the payout is released.",
    clocks: [
      {
        key: "ack",
        label: "Acknowledge",
        hours: 1,
        due: "Payments Risk acknowledges the payout and names the reviewer.",
        ifMissed: "The case goes to the steward on call.",
      },
      {
        key: "review",
        label: "Review",
        hours: 8,
        due: "A person checks the payout for fraud, sanctions, or errors.",
        ifMissed:
          "Further payouts cleared by the same rule wait for a person until the review is done.",
      },
      {
        key: "remedy",
        label: "Remedy",
        hours: 48,
        due: "Compensation is paid, or a dispute starts to recover the money.",
        ifMissed:
          "Compensation is paid by default, without waiting on the dispute.",
      },
    ],
  },
  "fraud-hold-delayed-notice": {
    start: "The hold is placed and the receipt is written.",
    clocks: [
      {
        key: "ack",
        label: "Acknowledge",
        hours: 1,
        due: "Fraud Operations acknowledges the hold and assigns a reviewer.",
        ifMissed: "The case goes to a steward.",
      },
      {
        key: "review",
        label: "Review",
        hours: 12,
        due: "A person keeps the hold, narrows it, or removes it.",
        ifMissed:
          "The case escalates above Fraud Operations, and the account holder gets limited access while it waits.",
      },
      {
        key: "notice",
        label: "Notice",
        hours: 24,
        due: "The account holder is told of the hold and shown the remedy, whether or not the investigation is open.",
        ifMissed:
          "No further delay is allowed. Notice goes out at once and the miss is logged against the exception.",
      },
      {
        key: "remedy",
        label: "Remedy",
        hours: 48,
        due: "The hold is released, or the account holder is told and given limited access.",
        ifMissed: "The hold is released.",
      },
    ],
  },
  "automated-eligibility-denial": {
    start: "The denial is issued with its receipt.",
    clocks: [
      {
        key: "ack",
        label: "Acknowledge",
        hours: 4,
        due: "Eligibility Operations confirms it has the case and tells the applicant when review will finish.",
        ifMissed: "The case goes to a steward.",
      },
      {
        key: "review",
        label: "Review",
        hours: 48,
        due: "A person upholds the denial, reverses it, or records an exception.",
        ifMissed:
          "The applicant keeps support as if eligible until a person decides.",
      },
      {
        key: "remedy",
        label: "Remedy",
        hours: 120,
        due: "The applicant gets a reversal, compensation, or a fallback that keeps essential support in place.",
        ifMissed:
          "Essential support continues, and the breach is logged against Eligibility Operations.",
      },
    ],
  },
  "content-moderation-takedown": {
    start: "The content is removed and a receipt is issued.",
    clocks: [
      {
        key: "ack",
        label: "Acknowledge",
        hours: 2,
        due: "Trust & Safety confirms who has the case and tells the poster when review will finish.",
        ifMissed: "The case goes to a senior reviewer.",
      },
      {
        key: "review",
        label: "Review",
        hours: 24,
        due: "A person keeps the content down or restores it.",
        ifMissed:
          "The content is restored by default, unless a logged safety escalation holds it.",
      },
      {
        key: "remedy",
        label: "Remedy",
        hours: 72,
        due: "The poster gets the content restored, an explanation, or another remedy.",
        ifMissed: "The breach is logged against Trust & Safety.",
      },
    ],
  },
  "decision-model-gate": {
    start: "The gate decides the refund and the decision record is issued.",
    clocks: [
      {
        key: "ack",
        label: "Acknowledge",
        hours: dmg.ack.hours,
        due: "The refund reviewer on shift has the case.",
        ifMissed:
          "The case goes to the Refund Review lead, who can reverse the refund without escalation.",
      },
      {
        key: "review",
        label: "Review",
        hours: dmg.review.hours,
        due: "The reviewer keeps the refund or reverses it.",
        ifMissed:
          "The grant assumes any refund can be reversed in this window, so a miss puts the grant up for review.",
      },
      {
        key: "appeal",
        label: "Appeal",
        hours: dmg.appeal.hours,
        due: "The Refund Review lead answers the customer's challenge.",
        ifMissed:
          "The miss counts against the lead's stated capacity of 150 answers a week. Expected errors above that capacity revoke the grant.",
      },
      {
        key: "remedy",
        label: "Remedy",
        hours: dmg.remedy.hours,
        due: "A refund found wrong is reversed or reissued.",
        ifMissed: "The breach is logged against the Refund Review lead.",
      },
    ],
  },
};

/** The `clocks` block of a receipt payload, in the receipt schema's shape. */
export const receiptClocks = (set: ClockSet) =>
  Object.fromEntries(
    set.clocks
      .filter((clock) => clock.key !== "notice")
      .map((clock) => [clock.key, { hours: clock.hours }]),
  ) as Partial<Record<ReceiptClockKey, { hours: number }>>;

/** Hours of one clock in the set. Throws if the page asks for one it lacks. */
export const clockHours = (set: ClockSet, key: Clock["key"]) => {
  const clock = set.clocks.find((entry) => entry.key === key);
  if (!clock) throw new Error(`No ${key} clock in this set`);
  return clock.hours;
};

/** "2-, 24-, and 72-hour" for the receipt clocks, for page descriptions. */
export const clockHoursPhrase = (set: ClockSet) => {
  const hours = set.clocks
    .filter((clock) => clock.key !== "notice")
    .map((clock) => clock.hours);
  const unique = [...new Set(hours)];
  const parts = unique.map((value, index) =>
    index === unique.length - 1 ? `${value}-hour` : `${value}-`,
  );
  if (parts.length < 3) return parts.join(" and ");
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
};

/**
 * The receipt's `clocks` block as payload text. With `indent`, pretty-printed
 * for a payload nested that many spaces deep; without, on one line in the
 * `{ "ack": { "hours": 1 } }` style the compact receipts use.
 */
export const receiptClocksText = (set: ClockSet, indent?: number) => {
  const block = receiptClocks(set);
  if (indent !== undefined) {
    return JSON.stringify(block, null, 2).replace(
      /\n/g,
      `\n${" ".repeat(indent)}`,
    );
  }
  const entries = Object.entries(block).map(
    ([key, value]) => `"${key}": { "hours": ${value?.hours} }`,
  );
  return `{ ${entries.join(", ")} }`;
};
