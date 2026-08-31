import { getEndpointsForVariant } from "./endpoint-config";

const formatList = (items: string[]) =>
  items.map((item) => `- ${item}`).join("\n");

const getMissing = (expected: string[], actual: string[]) =>
  expected.filter((entry) => !actual.includes(entry));

export const assertEndpointParity = (options: {
  unversioned: string[];
}) => {
  const expectedUnversioned = getEndpointsForVariant("unversioned");

  const missingUnversioned = getMissing(
    expectedUnversioned,
    options.unversioned,
  );

  if (missingUnversioned.length === 0) {
    return;
  }

  throw new Error(`Missing unversioned endpoints:\n${formatList(missingUnversioned)}`);
};
