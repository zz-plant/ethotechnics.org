/**
 * Whether a stated review window is still open.
 *
 * /institute/governance listed two RFCs under "active review windows" whose
 * windows had closed seven months earlier, with the dates printed as though
 * they were current. The site's own Law II says a grant that nobody renewed
 * has lapsed, and silence is not renewal; a review clock is the same object.
 * The dates are already in the data, so the page can apply that test to
 * itself rather than asking the reader to do the subtraction.
 */
export type ReviewWindowState = {
  closesOn: string | null;
  lapsed: boolean;
};

const WINDOW = /(\d{4}-\d{2}-\d{2})\s*(?:→|->|–|—)\s*(\d{4}-\d{2}-\d{2})/;

export const readReviewWindow = (
  window: string,
  today: string,
): ReviewWindowState => {
  const match = WINDOW.exec(window);
  if (!match) return { closesOn: null, lapsed: false };

  const closesOn = match[2];
  return { closesOn, lapsed: closesOn < today };
};

/** Today as YYYY-MM-DD in UTC, so a build is not sensitive to the runner. */
export const todayIso = (now: Date = new Date()): string =>
  now.toISOString().slice(0, 10);
