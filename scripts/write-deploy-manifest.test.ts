import { describe, expect, test } from "bun:test";
import { deployCommit } from "./write-deploy-manifest";

const SHA = "f01e71996fe18cf69f2cdf1a8b422c36b11812ce";

describe("deployCommit", () => {
  test("uses the commit Workers Builds names", () => {
    const head = () => "0".repeat(40);
    expect(deployCommit({ WORKERS_CI_COMMIT_SHA: ` ${SHA}\n` }, head)).toBe(
      SHA,
    );
  });

  test("falls back to the checkout's HEAD outside Workers Builds", () => {
    expect(deployCommit({}, () => SHA.toUpperCase())).toBe(SHA);
    expect(deployCommit({ WORKERS_CI_COMMIT_SHA: "" }, () => SHA)).toBe(SHA);
  });

  test("refuses anything that is not a full SHA", () => {
    expect(() =>
      deployCommit({ WORKERS_CI_COMMIT_SHA: "f01e719" }, () => SHA),
    ).toThrow("Not a full commit SHA");
    expect(() => deployCommit({}, () => "")).toThrow("Not a full commit SHA");
  });
});
