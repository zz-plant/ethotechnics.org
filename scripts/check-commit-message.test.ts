import { describe, expect, it } from "bun:test";

import { checkCommitMessage, stripGitComments } from "./check-commit-message";

describe("checkCommitMessage", () => {
  it("passes one area and a short summary", () => {
    expect(checkCommitMessage("presence: close every open report")).toEqual([]);
  });

  it("passes a subject with a body after a blank line", () => {
    expect(
      checkCommitMessage(
        "deps: move to bun 1.4.4\n\nThe scoped override needs 1.4.\n",
      ),
    ).toEqual([]);
  });

  it("ignores the PR number GitHub appends on squash", () => {
    const subject = `docs: ${"a".repeat(64)} (#1068)`;
    expect(checkCommitMessage(subject)).toEqual([]);
  });

  it("leaves subjects Git writes alone", () => {
    expect(checkCommitMessage("Merge pull request #1046 from x/y")).toEqual([]);
    expect(checkCommitMessage('Revert "seo: bump og version"')).toEqual([]);
    expect(checkCommitMessage("fixup! seo: bump og version")).toEqual([]);
  });

  it("checks a hand-written subject that starts with Merge", () => {
    expect(
      checkCommitMessage("Merge the halt pass and settle the seams"),
    ).toHaveLength(1);
  });

  it("asks for an area", () => {
    expect(checkCommitMessage("Make the repository readable")).toHaveLength(1);
  });

  it("rejects a type and scope in place of an area", () => {
    const [problem] = checkCommitMessage("fix(seo): resolve #1049");
    expect(problem).toContain('"seo: ..."');
  });

  it("rejects two areas", () => {
    expect(checkCommitMessage("seo + copy: plainer cards")).toHaveLength(1);
    expect(checkCommitMessage("seo, docs: plainer cards")).toHaveLength(1);
  });

  it("rejects an uppercase area", () => {
    expect(checkCommitMessage("Docs: fix a link")).toHaveLength(1);
  });

  it("rejects a semicolon-joined list of changes", () => {
    expect(
      checkCommitMessage("deps: patch the audit; green check"),
    ).toHaveLength(1);
  });

  it("rejects a subject over 72 characters", () => {
    const [problem] = checkCommitMessage(`docs: ${"a".repeat(70)}`);
    expect(problem).toContain("76 characters");
  });

  it("rejects a trailing period and a missing blank line", () => {
    expect(checkCommitMessage("docs: fix a link.\nMore")).toHaveLength(2);
  });

  it("reports an empty message", () => {
    expect(checkCommitMessage("# only a comment\n")).toEqual([
      "The message is empty.",
    ]);
  });
});

describe("stripGitComments", () => {
  it("drops comment lines and everything below the scissors", () => {
    const raw = [
      "docs: fix a link",
      "# Please enter the commit message",
      "# ------------------------ >8 ------------------------",
      "diff --git a/x b/x",
    ].join("\n");
    expect(stripGitComments(raw)).toBe("docs: fix a link");
  });
});
