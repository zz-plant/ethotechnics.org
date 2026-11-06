/**
 * Checks a commit message or a pull request title against
 * docs/agents/version-control.md.
 *
 * Pull requests are squash-merged, so the PR title becomes the subject line
 * on main. The same rules apply to both.
 *
 *   bun run check:commit-message .git/COMMIT_EDITMSG   (the commit-msg hook)
 *   bun run check:commit-message --message "seo: ..."  (a PR title in CI)
 */
import { readFileSync } from "node:fs";

export const MAX_SUBJECT_LENGTH = 72;

// Subjects Git writes itself. They are left as Git writes them.
const GIT_GENERATED = [
  /^Merge (pull request #|branch '|remote-tracking branch '|tag '|commit ')/,
  /^Revert "/,
  /^(fixup|squash|amend)! /,
];

// GitHub appends " (#123)" to a squash-merged subject. It does not count.
const PR_SUFFIX = / \(#\d+\)$/;

const SCISSORS = "# ------------------------ >8 ------------------------";

/** Drops the comment lines and the diff Git puts below the scissors line. */
export const stripGitComments = (raw: string): string => {
  const scissors = raw.indexOf(SCISSORS);
  const kept = scissors === -1 ? raw : raw.slice(0, scissors);
  return kept
    .split("\n")
    .filter((line) => !line.startsWith("#"))
    .join("\n")
    .trim();
};

/** Returns one sentence per problem. An empty list means the message passes. */
export const checkCommitMessage = (raw: string): string[] => {
  const message = stripGitComments(raw);
  if (message === "") return ["The message is empty."];

  const [subjectLine = "", secondLine] = message.split("\n");
  const subject = subjectLine.trimEnd();

  if (GIT_GENERATED.some((pattern) => pattern.test(subject))) return [];

  const problems: string[] = [];
  const counted = subject.replace(PR_SUFFIX, "");

  const match = /^([^:]+): (.*)$/.exec(counted);
  if (!match) {
    problems.push(
      'Start the subject with one area and a colon, e.g. "casebook: add the Dutch childcare case".',
    );
  } else {
    const [, area = "", summary = ""] = match;
    if (/[()]/.test(area)) {
      problems.push(
        `Name the area once, without a type in front: "${area.replace(/^.*\(|\).*$/g, "")}: ...", not "${area}: ...".`,
      );
    } else if (/[\s,+&/]/.test(area)) {
      problems.push(
        `"${area}" names more than one area. Split the change, or pick the area a reader would look under.`,
      );
    } else if (!/^[a-z0-9][a-z0-9-]*$/.test(area)) {
      problems.push(
        `Write the area in lowercase letters, digits, and hyphens: "${area.toLowerCase()}".`,
      );
    }

    if (summary.trim() === "") {
      problems.push("Say what changed after the area.");
    }
    if (summary.includes(";")) {
      problems.push(
        "A semicolon joins two changes. Give each its own commit, or put the second in the body.",
      );
    }
  }

  if (counted.length > MAX_SUBJECT_LENGTH) {
    problems.push(
      `The subject is ${counted.length} characters. Keep it to ${MAX_SUBJECT_LENGTH}; put the rest in the body.`,
    );
  }
  if (/\.$/.test(counted)) {
    problems.push("Drop the period at the end of the subject.");
  }
  if (secondLine !== undefined && secondLine.trim() !== "") {
    problems.push("Leave a blank line between the subject and the body.");
  }

  return problems;
};

if (import.meta.main) {
  const args = process.argv.slice(2);
  const flag = args.indexOf("--message");
  let raw: string;
  if (flag !== -1) {
    raw = args[flag + 1] ?? "";
  } else if (args[0]) {
    raw = readFileSync(args[0], "utf8");
  } else {
    console.error(
      "Usage: check-commit-message.ts <message-file> | --message <text>",
    );
    process.exit(2);
  }

  const problems = checkCommitMessage(raw);
  if (problems.length > 0) {
    const subject = stripGitComments(raw).split("\n")[0] ?? "";
    console.error(`Subject: ${subject}`);
    for (const problem of problems) console.error(`- ${problem}`);
    console.error("See docs/agents/version-control.md.");
    process.exit(1);
  }
}
