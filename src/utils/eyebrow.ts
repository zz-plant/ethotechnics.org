/**
 * Whether an eyebrow only repeats its heading.
 *
 * An eyebrow earns its place when it says something the heading does not.
 * "Evidence pack" over "STD-01 Evidence Pack", or "Test cases" over "12 test
 * cases", is a second label on the same thing. The test: every word of the
 * eyebrow longer than two letters already appears in the heading.
 */
const words = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);

export function eyebrowRestatesTitle(eyebrow: string, title: string): boolean {
  const eyebrowWords = words(eyebrow);
  if (eyebrowWords.length === 0) return false;
  const titleWords = new Set(words(title));
  return eyebrowWords.every((word) => titleWords.has(word));
}
