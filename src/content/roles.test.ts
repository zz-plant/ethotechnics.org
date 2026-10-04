import { describe, expect, it } from "bun:test";

import { roles, rolePermalink, getRole, roleMaterial } from "./roles";

/**
 * The registry exists because three role vocabularies drifted apart without
 * anything noticing. These tests are the thing that would notice.
 */

describe("the role registry is the only vocabulary", () => {
  it("gives every role a unique id and a distinct audience", () => {
    const ids = roles.map((role) => role.id);
    expect(new Set(ids).size).toBe(ids.length);

    const who = roles.map((role) => role.who);
    expect(new Set(who).size).toBe(who.length);
  });

  it("gives every role at least one kind of material", () => {
    // The floor, not the goal. A role with nothing written for it is a role
    // that should not be offered on /start, because picking it wastes a click.
    for (const role of roles) {
      const material = roleMaterial(role);
      const kinds = Object.values(material).filter(Boolean).length;
      expect(kinds, `${role.id} has nothing written for it`).toBeGreaterThan(0);
    }
  });

  it("resolves each role by id", () => {
    for (const role of roles) {
      expect(getRole(role.id)?.label).toBe(role.label);
      expect(rolePermalink(role.id)).toBe(`/roles/${role.id}`);
    }
  });

  it("keeps orientation steps numbered in order and pointing somewhere", () => {
    for (const role of roles) {
      role.orientation?.forEach((step, index) => {
        expect(step.number).toBe(index + 1);
        expect(step.ctaHref.startsWith("/")).toBe(true);
      });
    }
  });
});

describe("every audience that used to be addressed still is", () => {
  it("claims no former path twice", () => {
    const former = roles.flatMap((role) => role.formerPaths);
    expect(new Set(former).size).toBe(former.length);
  });

  // The three vocabularies are only reconciled if their old URLs land on the
  // audience they used to address. A formerPath with no redirect is a reader
  // dropped on a 404; a redirect to the wrong role is worse, because it looks
  // like it worked.
  it("redirects every former path to the role that absorbed it", async () => {
    const middleware = await Bun.file("src/middleware.ts").text();
    for (const role of roles) {
      for (const path of role.formerPaths) {
        expect(
          middleware.includes(`"${path}": "${rolePermalink(role.id)}"`),
          `${path} should 301 to ${rolePermalink(role.id)}`,
        ).toBe(true);
      }
    }
  });

  it("covers the vocabularies that existed before the merge", () => {
    const former = roles.flatMap((role) => role.formerPaths);
    for (const path of [
      "/quick-start/engineers",
      "/quick-start/policy-makers",
      "/quick-start/designers",
      "/quick-start/researchers",
      "/adopt/build",
      "/adopt/ops",
      "/adopt/policy",
    ]) {
      expect(former, `${path} lost its audience`).toContain(path);
    }
  });
});
