import { getEndpointsForVariant } from "./endpoint-config";

const formatList = (items: string[]) =>
  items.map((item) => `- ${item}`).join("\n");

const getMissing = (expected: string[], actual: string[]) =>
  expected.filter((entry) => !actual.includes(entry));

export const assertEndpointParity = (options: {
  unversioned: string[];
  versioned: string[];
}) => {
  const expectedUnversioned = getEndpointsForVariant("unversioned");
  const expectedVersioned = getEndpointsForVariant("versioned");

  const missingUnversioned = getMissing(
    expectedUnversioned,
    options.unversioned,
  );
  const missingVersioned = getMissing(expectedVersioned, options.versioned);

  if (missingUnversioned.length === 0 && missingVersioned.length === 0) {
    return;
  }

  const sections = [
    missingUnversioned.length
      ? `Missing unversioned endpoints:\n${formatList(missingUnversioned)}`
      : undefined,
    missingVersioned.length
      ? `Missing versioned endpoints:\n${formatList(missingVersioned)}`
      : undefined,
  ].filter(Boolean);

  throw new Error(sections.join("\n\n"));
};
