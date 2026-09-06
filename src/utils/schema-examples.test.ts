import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "bun:test";

import { formatErrors, validate, type JsonSchema } from "./json-schema-lite";

const standardsDir = join(import.meta.dir, "..", "..", "public", "standards");
const examplesDir = join(standardsDir, "examples");

const readJson = <T = Record<string, any>>(path: string): T =>
  JSON.parse(readFileSync(path, "utf8")) as T;

const exampleFiles = readdirSync(examplesDir)
  .filter((file) => file.endsWith(".example.json"))
  .sort();

const loadExample = (name: string) =>
  readJson(join(examplesDir, `${name}.example.json`));

const exampleForSchema = (file: string) => file.replace(/\.example\.json$/, "");

describe("standards schemas", () => {
  test("every example has a schema of the same name", () => {
    for (const file of exampleFiles) {
      const schemaPath = join(
        standardsDir,
        `${exampleForSchema(file)}.schema.json`,
      );
      expect(() => readFileSync(schemaPath)).not.toThrow();
    }
  });

  test("every delegation schema declares draft 2020-12, an $id, a title, and a description", () => {
    const schemaFiles = readdirSync(standardsDir).filter((file) =>
      file.endsWith(".schema.json"),
    );
    expect(schemaFiles.length).toBeGreaterThan(0);

    for (const file of schemaFiles) {
      const schema = readJson<JsonSchema>(join(standardsDir, file));
      expect(schema.$schema).toBe(
        "https://json-schema.org/draft/2020-12/schema",
      );
      expect(schema.$id).toBe(`https://ethotechnics.org/standards/${file}`);
      expect(typeof schema.title).toBe("string");
      expect(typeof schema.description).toBe("string");
    }
  });

  test("every property in the v2 schemas carries a title and description", () => {
    const v2Schemas = exampleFiles.map(exampleForSchema);
    const walk = (schema: JsonSchema, path: string) => {
      for (const [key, child] of Object.entries(schema.properties ?? {})) {
        const childPath = `${path}.${key}`;
        expect(typeof child.title, `${childPath} title`).toBe("string");
        expect(typeof child.description, `${childPath} description`).toBe(
          "string",
        );
        walk(child, childPath);
        if (child.items) walk(child.items, `${childPath}[]`);
      }
      for (const [key, def] of Object.entries(
        (schema.$defs as Record<string, JsonSchema> | undefined) ?? {},
      )) {
        walk(def, `${path}.$defs.${key}`);
      }
    };
    for (const name of v2Schemas) {
      walk(
        readJson<JsonSchema>(join(standardsDir, `${name}.schema.json`)),
        name,
      );
    }
  });

  for (const file of exampleFiles) {
    test(`${file} validates against its schema`, () => {
      const name = exampleForSchema(file);
      const schema = readJson<JsonSchema>(
        join(standardsDir, `${name}.schema.json`),
      );
      const example = readJson(join(examplesDir, file));
      const errors = validate(schema, example);
      expect(errors, formatErrors(errors)).toEqual([]);
    });
  }
});

describe("json-schema-lite", () => {
  const schema = readJson<JsonSchema>(
    join(standardsDir, "authority-grant.schema.json"),
  );
  const grant = loadExample("authority-grant");

  test("rejects an invalid state", () => {
    const errors = validate(schema, { ...grant, state: "granted" });
    expect(errors.map((error) => error.path)).toContain("state");
  });

  test("rejects unknown properties where additionalProperties is false", () => {
    const errors = validate(schema, { ...grant, approval_required: true });
    expect(errors.map((error) => error.path)).toContain("approval_required");
  });

  test("rejects a malformed timestamp", () => {
    const errors = validate(schema, {
      ...grant,
      provenance: { ...grant.provenance, issued_at: "yesterday" },
    });
    expect(errors.map((error) => error.path)).toContain("provenance.issued_at");
  });

  test("accepts a condition string or a timestamp for until", () => {
    expect(
      validate(schema, { ...grant, until: "until the Q4 backtest is re-run" }),
    ).toEqual([]);
    expect(
      validate(schema, { ...grant, until: "2026-12-01T00:00:00Z" }),
    ).toEqual([]);
    expect(validate(schema, { ...grant, until: 42 }).length).toBeGreaterThan(0);
  });
});

describe("delegation examples form one coherent scenario", () => {
  const catalog = loadExample("capability-catalog");
  const grant = loadExample("authority-grant");
  const policy = loadExample("policy-record");
  const dependency = loadExample("dependency-record");
  const register = loadExample("standing-register");
  const challenge = loadExample("challenge");
  const intervention = loadExample("intervention-spec");
  const reconsideration = loadExample("reconsideration");
  const substrate = loadExample("substrate-profile");
  const objectModel = loadExample("agent-safety-object-model");
  const decision = loadExample("decision-record");

  const agentId = "agent-risk-ops-v2";

  test("every record refers to the same agent", () => {
    expect(catalog.grantee.id).toBe(agentId);
    expect(grant.grantee.id).toBe(agentId);
    expect(dependency.system_ref).toBe(agentId);
    expect(register.system_ref).toBe(agentId);
    expect(intervention.system_ref).toBe(agentId);
    expect(substrate.system_ref).toBe(agentId);
    expect(objectModel.agent_id).toBe(agentId);
  });

  test("the grant references the catalog, policy, dependency, and intervention", () => {
    expect(grant.capability_catalog_ref).toBe(catalog.catalog_id);
    expect(grant.policy_refs).toContain(policy.policy_id);
    expect(
      grant.evidence_basis.map((item: { ref: string }) => item.ref),
    ).toContain(policy.policy_id);
    expect(grant.dependency_ref).toBe(dependency.dependency_id);
    expect(grant.intervention_ref).toBe(intervention.spec_id);
  });

  test("the grant only authorizes classes the catalog can reach", () => {
    const catalogClasses = new Set(
      catalog.capabilities.map(
        (item: { action_class: string }) => item.action_class,
      ),
    );
    for (const actionClass of grant.action_classes) {
      expect(catalogClasses.has(actionClass)).toBe(true);
      expect(grant.scope.action_classes).toContain(actionClass);
    }
    // Capability outruns authority: TRANSFER is discoverable but not granted.
    expect(catalogClasses.has("TRANSFER")).toBe(true);
    expect(grant.action_classes).not.toContain("TRANSFER");
  });

  test("the decision record was made under the grant and its policy", () => {
    expect(decision.grant_ref).toBe(grant.grant_id);
    expect(decision.policy_refs).toEqual(grant.policy_refs);
    expect(grant.action_classes).toContain(decision.action.class);
    expect(decision.standing_register_ref).toBe(register.register_id);
    expect(grant.state).toBe("allowed");
    expect(new Date(decision.issued_at).getTime()).toBeGreaterThan(
      new Date(grant.state_history.at(-1).at).getTime(),
    );
  });

  test("the challenge, reconsideration, and grant history agree", () => {
    expect(challenge.register_ref).toBe(register.register_id);
    expect(
      register.decision_classes.map(
        (entry: { decision_class: string }) => entry.decision_class,
      ),
    ).toContain(challenge.decision_class);
    expect(challenge.subject).toEqual({ kind: "grant", ref: grant.grant_id });
    expect(challenge.reconsideration_ref).toBe(
      reconsideration.reconsideration_id,
    );

    expect(reconsideration.trigger).toEqual({
      kind: "challenge",
      ref: challenge.challenge_id,
    });
    expect(reconsideration.subject).toEqual({
      kind: "grant",
      ref: grant.grant_id,
    });
    expect(reconsideration.outcome).toBe("narrow");
    expect(challenge.outcome.transition).toBe(reconsideration.outcome);
    expect(challenge.outcome.decided_at).toBe(reconsideration.decided_at);

    const registerEntry = register.decision_classes.find(
      (entry: { decision_class: string }) =>
        entry.decision_class === challenge.decision_class,
    );
    expect(registerEntry.possible_state_transitions).toContain(
      reconsideration.outcome,
    );
    expect(registerEntry.who_may_challenge).toContain(
      challenge.challenger.standing_basis,
    );

    const transitionRefs = grant.state_history.map(
      (entry: { evidence_ref?: string }) => entry.evidence_ref,
    );
    expect(transitionRefs).toContain(challenge.challenge_id);
    expect(transitionRefs).toContain(reconsideration.reconsideration_id);
    expect(grant.state_history.at(-1).at).toBe(reconsideration.decided_at);
  });

  test("the intervention can alter the states the grant depends on", () => {
    expect(intervention.actions_preventable).toContain(decision.action.class);
    expect(intervention.owner.contact).toBe(challenge.responder.contact);
  });

  test("the dependency record and substrate profile agree on exposure", () => {
    const { dependency_depth, substitution_cost, correction_latency, score } =
      dependency.exposure_score;
    expect(score).toBe(
      dependency_depth * substitution_cost * correction_latency,
    );
    expect(substitution_cost).toBe(dependency.substitution_cost.estimate);
    expect(correction_latency).toBe(
      dependency.correction_latency.estimate_hours,
    );
    expect(substrate.dependency_ref).toBe(dependency.dependency_id);
    expect(dependency.preserved_capacities.length).toBeGreaterThan(0);
  });

  test("the 2.0.0 object model points at every state variable record", () => {
    expect(objectModel.capability_catalog_ref).toBe(catalog.catalog_id);
    expect(objectModel.dependency_ref).toBe(dependency.dependency_id);
    expect(objectModel.intervention_ref).toBe(intervention.spec_id);
    expect(objectModel.substrate_profile_ref).toBe(substrate.profile_id);

    for (const actionClass of objectModel.action_classes) {
      if (grant.action_classes.includes(actionClass.class)) {
        expect(actionClass.grant_ref).toBe(grant.grant_id);
      } else {
        expect(actionClass.grant_ref).toBeNull();
      }
      expect("approval_required" in actionClass).toBe(false);
    }
  });
});
