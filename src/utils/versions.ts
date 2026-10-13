/**
 * A version number as readers see it: "v1.0.2", wherever it appears. Data
 * keeps the form it stores ("1.0.2" or "v1.0.2"); only the display gains the
 * prefix, so the word "Version" is not needed in front of it.
 */
export const formatVersion = (version: string): string =>
  `v${version.trim().replace(/^v/i, "")}`;
