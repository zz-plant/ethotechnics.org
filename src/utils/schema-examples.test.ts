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
    expect(
      grant.policy_refs.map((ref: { policy_id: string }) => ref.policy_id),
    ).toContain(policy.policy_id);
    expect(
      grant.policy_refs.find(
        (ref: { policy_id: string }) => ref.policy_id === policy.policy_id,
      ).version,
    ).toBe(policy.version);
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
    expect(decision.policy_refs).toEqual(
      grant.policy_refs.map((ref: { policy_id: string }) => ref.policy_id),
    );
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

describe("STD-08 clauses are satisfiable against the published schemas", () => {
  const grantSchema = readJson<JsonSchema>(
    join(standardsDir, "authority-grant.schema.json"),
  );
  const catalogSchema = readJson<JsonSchema>(
    join(standardsDir, "capability-catalog.schema.json"),
  );
  const grant = loadExample("authority-grant");
  const catalog = loadExample("capability-catalog");
  const policy = loadExample("policy-record");

  test("STD-07 §2.2 mode is on the grant with STD-07's enum", () => {
    const mode = grantSchema.properties?.mode;
    expect(mode?.enum).toEqual(["unattended", "confirm", "forbidden"]);
    expect(grantSchema.required).toContain("mode");
    expect(
      validate(grantSchema, { ...grant, mode: "supervised" }).length,
    ).toBeGreaterThan(0);
  });

  test("mode and state are documented as different questions", () => {
    const mode = grantSchema.properties?.mode?.description ?? "";
    const state = grantSchema.properties?.state?.description ?? "";
    expect(mode).toContain("state");
    expect(state).toContain("mode");
  });

  test("STD-08 §3.2: mode confirm without intervention_ref fails validation", () => {
    const { intervention_ref: _omitted, ...withoutRef } = grant;
    const errors = validate(grantSchema, { ...withoutRef, mode: "confirm" });
    expect(
      errors.some((error) => error.message.includes("intervention_ref")),
    ).toBe(true);
  });

  test("STD-08 §3.2: mode confirm with intervention_ref passes", () => {
    expect(
      validate(grantSchema, {
        ...grant,
        mode: "confirm",
        intervention_ref: "INT-RISK-STEWARD-1",
      }),
    ).toEqual([]);
  });

  test("the conditional only fires for confirm", () => {
    const { intervention_ref: _omitted, ...withoutRef } = grant;
    expect(
      validate(grantSchema, { ...withoutRef, mode: "unattended" }),
    ).toEqual([]);
    expect(validate(grantSchema, { ...withoutRef, mode: "forbidden" })).toEqual(
      [],
    );
  });

  test("STD-08 §2.2: every policy_refs entry pins a policy_id and a version", () => {
    const items = grantSchema.properties?.policy_refs?.items as JsonSchema;
    expect(items.type).toBe("object");
    expect(items.required).toEqual(["policy_id", "version"]);
    expect(grant.policy_refs.length).toBeGreaterThan(0);
    for (const ref of grant.policy_refs) {
      expect(Object.keys(ref).sort()).toEqual(["policy_id", "version"]);
      expect(typeof ref.policy_id).toBe("string");
      expect(typeof ref.version).toBe("string");
    }
    expect(
      validate(grantSchema, { ...grant, policy_refs: [policy.policy_id] })
        .length,
    ).toBeGreaterThan(0);
    expect(
      validate(grantSchema, {
        ...grant,
        policy_refs: [{ policy_id: policy.policy_id }],
      }).length,
    ).toBeGreaterThan(0);
  });

  test("STD-07 §3.4: every catalog entry carries a capability state", () => {
    const items = catalogSchema.properties?.capabilities?.items as JsonSchema;
    expect(items.required).toContain("state");
    expect(items.properties?.state?.enum).toEqual([
      "absent",
      "configured",
      "verified",
      "broken",
    ]);
    expect(items.properties?.state?.description).toContain("verified");

    for (const capability of catalog.capabilities) {
      expect(items.properties?.state?.enum).toContain(capability.state);
    }
    const [first, ...rest] = catalog.capabilities;
    expect(
      validate(catalogSchema, {
        ...catalog,
        capabilities: [{ ...first, state: "installed" }, ...rest],
      }).length,
    ).toBeGreaterThan(0);
    const { state: _dropped, ...stateless } = first;
    expect(
      validate(catalogSchema, {
        ...catalog,
        capabilities: [stateless, ...rest],
      }).length,
    ).toBeGreaterThan(0);
  });

  test("the granted action classes rest on verified capabilities", () => {
    for (const capability of catalog.capabilities) {
      if (grant.action_classes.includes(capability.action_class)) {
        expect(capability.state).toBe("verified");
      }
    }
  });
});

describe("STD-08 Part D: correction capacity is implementable", () => {
  const grantSchema = readJson<JsonSchema>(
    join(standardsDir, "authority-grant.schema.json"),
  );
  const dependencySchema = readJson<JsonSchema>(
    join(standardsDir, "dependency-record.schema.json"),
  );
  const grant = loadExample("authority-grant");
  const dependency = loadExample("dependency-record");

  const components = [
    "detection",
    "challenge",
    "standing",
    "review",
    "authority_to_modify",
    "reversible_transitions",
    "operable_after_correction",
  ];

  test("STD-08 §4.1: the grant requires correction_capacity", () => {
    expect(grantSchema.required).toContain("correction_capacity");
    const { correction_capacity: _omitted, ...withoutCapacity } = grant;
    const errors = validate(grantSchema, withoutCapacity);
    expect(
      errors.some((error) => error.message.includes("correction_capacity")),
    ).toBe(true);
  });

  test("STD-08 §4.1: all seven components plus assessed_at are required", () => {
    const capacity = grantSchema.properties?.correction_capacity as JsonSchema;
    expect(capacity.required).toEqual(["assessed_at", ...components]);
    expect(capacity.additionalProperties).toBe(false);
    for (const component of components) {
      const { [component]: _dropped, ...partial } =
        grant.correction_capacity as Record<string, unknown>;
      const errors = validate(grantSchema, {
        ...grant,
        correction_capacity: partial,
      });
      expect(
        errors.some((error) => error.message.includes(component)),
        `dropping ${component} must fail validation`,
      ).toBe(true);
    }
    const { assessed_at: _at, ...undated } =
      grant.correction_capacity as Record<string, unknown>;
    expect(
      validate(grantSchema, { ...grant, correction_capacity: undated }).length,
    ).toBeGreaterThan(0);
  });

  test("every component records present and evidence", () => {
    const capacity = grantSchema.properties?.correction_capacity as JsonSchema;
    for (const component of components) {
      const entry = grant.correction_capacity[component];
      expect(typeof entry.present, `${component}.present`).toBe("boolean");
      expect(entry.evidence.length, `${component}.evidence`).toBeGreaterThan(
        20,
      );
      const shape = capacity.properties?.[component] as JsonSchema;
      expect(typeof shape.title).toBe("string");
      expect(typeof shape.description).toBe("string");
      const errors = validate(grantSchema, {
        ...grant,
        correction_capacity: {
          ...grant.correction_capacity,
          [component]: { present: true },
        },
      });
      expect(
        errors.some((error) => error.message.includes("evidence")),
        `${component} must require evidence`,
      ).toBe(true);
    }
  });

  test("detection requires an evaluator and its independence from the executor", () => {
    const detection = (
      grantSchema.properties?.correction_capacity as JsonSchema
    ).properties?.detection as JsonSchema;
    expect(detection.required).toEqual([
      "present",
      "evidence",
      "evaluator",
      "independent_of_executor",
    ]);
    expect(detection.properties?.independent_of_executor?.type).toBe("boolean");
    expect(detection.description).toContain("evaluates");
    for (const field of ["evaluator", "independent_of_executor"]) {
      const { [field]: _dropped, ...partial } = grant.correction_capacity
        .detection as Record<string, unknown>;
      const errors = validate(grantSchema, {
        ...grant,
        correction_capacity: {
          ...grant.correction_capacity,
          detection: partial,
        },
      });
      expect(
        errors.some((error) => error.message.includes(field)),
        `detection must require ${field}`,
      ).toBe(true);
    }
    expect(
      validate(grantSchema, {
        ...grant,
        correction_capacity: {
          ...grant.correction_capacity,
          detection: {
            ...grant.correction_capacity.detection,
            independent_of_executor: "yes",
          },
        },
      }).length,
    ).toBeGreaterThan(0);
  });

  test("Law IV's proportionality is stated on the object itself", () => {
    const description =
      (grantSchema.properties?.correction_capacity as JsonSchema).description ??
      "";
    expect(description).toContain("scope");
    expect(description).toContain("review");
    expect(description.length).toBeGreaterThan(200);
  });

  test("the grant's capacity assessment is no older than its last transition", () => {
    const assessedAt = new Date(
      grant.correction_capacity.assessed_at,
    ).getTime();
    const lastTransition = new Date(grant.state_history.at(-1).at).getTime();
    expect(assessedAt).toBeGreaterThanOrEqual(lastTransition);
  });

  test("§4.4: the seventh component is evidenced from the dependency record", () => {
    const seventh = grant.correction_capacity.operable_after_correction;
    expect(seventh.evidence).toContain(dependency.dependency_id);
    // Deliberately unflattering: the institution cannot absorb a late reversal.
    expect(seventh.present).toBe(false);
    expect(dependency.reversibility.institutional.feasible).toBe(false);
  });

  test("preserved capacities record depreciation, not a score", () => {
    const items = dependencySchema.properties?.preserved_capacities
      ?.items as JsonSchema;
    expect(items.required).toEqual([
      "capacity",
      "reason",
      "owner",
      "last_exercised",
      "status",
      "change_since_last_assessment",
    ]);
    expect(items.properties?.status?.enum).toEqual([
      "retained",
      "degrading",
      "lost",
    ]);
    expect(items.properties?.change_since_last_assessment?.enum).toEqual([
      "replenished",
      "unchanged",
      "consumed",
    ]);
    expect(items.properties?.status?.description).toContain("not a");
    expect(
      items.properties?.change_since_last_assessment?.description,
    ).toContain("delta");
    expect(items.properties?.last_exercised?.description).toContain("claim");

    const [first, ...rest] = dependency.preserved_capacities;
    for (const bad of [
      { ...first, status: "healthy" },
      { ...first, change_since_last_assessment: "improved" },
    ]) {
      expect(
        validate(dependencySchema, {
          ...dependency,
          preserved_capacities: [bad, ...rest],
        }).length,
        JSON.stringify(bad.status),
      ).toBeGreaterThan(0);
    }
    for (const field of [
      "last_exercised",
      "status",
      "change_since_last_assessment",
    ]) {
      const { [field]: _dropped, ...partial } = first as Record<
        string,
        unknown
      >;
      const errors = validate(dependencySchema, {
        ...dependency,
        preserved_capacities: [partial, ...rest],
      });
      expect(
        errors.some((error) => error.message.includes(field)),
        `preserved capacity must require ${field}`,
      ).toBe(true);
    }
    expect(
      validate(dependencySchema, {
        ...dependency,
        preserved_capacities: [
          { ...first, last_exercised: "a while ago" },
          ...rest,
        ],
      }).length,
    ).toBeGreaterThan(0);
  });

  test("the dependency example is honest about a capacity it has consumed", () => {
    const capacities = dependency.preserved_capacities as {
      status: string;
      change_since_last_assessment: string;
      last_exercised: string;
    }[];
    const assessedAt = new Date(dependency.assessed_at).getTime();
    const stale = capacities.filter(
      (entry) =>
        assessedAt - new Date(entry.last_exercised).getTime() >
        180 * 24 * 60 * 60 * 1000,
    );
    expect(stale.length).toBeGreaterThan(0);
    for (const entry of stale) {
      expect(["degrading", "lost"]).toContain(entry.status);
    }
    expect(
      capacities.some(
        (entry) => entry.change_since_last_assessment === "consumed",
      ),
    ).toBe(true);
    for (const entry of capacities) {
      expect(new Date(entry.last_exercised).getTime()).toBeLessThanOrEqual(
        assessedAt,
      );
    }
  });

  test("independent_evaluation is the deployment-level counterpart", () => {
    const independent = dependencySchema.properties
      ?.independent_evaluation as JsonSchema;
    expect(independent.required).toEqual([
      "executor",
      "evaluator",
      "independent",
      "evidence",
    ]);
    expect(independent.description).toContain(
      "correction_capacity.detection.independent_of_executor",
    );
    expect(dependency.independent_evaluation.evaluator).toBe(
      grant.correction_capacity.detection.evaluator,
    );
    for (const field of ["executor", "evaluator", "independent", "evidence"]) {
      const { [field]: _dropped, ...partial } =
        dependency.independent_evaluation as Record<string, unknown>;
      const errors = validate(dependencySchema, {
        ...dependency,
        independent_evaluation: partial,
      });
      expect(
        errors.some((error) => error.message.includes(field)),
        `independent_evaluation must require ${field}`,
      ).toBe(true);
    }
    expect(
      validate(dependencySchema, {
        ...dependency,
        independent_evaluation: {
          ...dependency.independent_evaluation,
          independent: "mostly",
        },
      }).length,
    ).toBeGreaterThan(0);
  });
});

describe("json-schema-lite if/then", () => {
  const schema: JsonSchema = {
    type: "object",
    properties: { kind: { type: "string" }, ref: { type: "string" } },
    if: { required: ["kind"], properties: { kind: { const: "confirm" } } },
    then: { required: ["ref"] },
    else: { required: ["kind"] },
  };

  test("applies then when if matches", () => {
    expect(validate(schema, { kind: "confirm", ref: "INT-1" })).toEqual([]);
    expect(validate(schema, { kind: "confirm" }).length).toBeGreaterThan(0);
  });

  test("applies else when if does not match", () => {
    expect(validate(schema, { kind: "unattended" })).toEqual([]);
    expect(validate(schema, {}).length).toBeGreaterThan(0);
  });

  test("a schema with no if is unaffected", () => {
    expect(validate({ type: "object" }, { kind: "confirm" })).toEqual([]);
  });
});

describe("delegation model crosswalk", () => {
  type Mapping = {
    id: string;
    std_07: { record_kind: string; field: string } | null;
    std_08: { schema: string; fields: string[] } | null;
    relation: string;
    note: string;
  };
  type Crosswalk = {
    id: string;
    title: string;
    description: string;
    version: string;
    relations: Record<string, string>;
    mappings: Mapping[];
    known_gaps: { id: string; summary: string; detail: string }[];
  };

  const crosswalk = readJson<Crosswalk>(
    join(standardsDir, "delegation-model-crosswalk.json"),
  );
  const recordSchema = readJson<JsonSchema>(
    join(
      standardsDir,
      "..",
      "api",
      "schema",
      "revisable-delegation-record.schema.json",
    ),
  );

  /** Resolve a dotted field path, where `[]` steps into an array's items. */
  const resolveField = (
    schema: JsonSchema,
    path: string,
  ): JsonSchema | null => {
    let current: JsonSchema | undefined = schema;
    for (const rawSegment of path.split(".")) {
      const isArray = rawSegment.endsWith("[]");
      const segment = isArray ? rawSegment.slice(0, -2) : rawSegment;
      current = current?.properties?.[segment];
      if (!current) return null;
      if (isArray) {
        current = current.items;
        if (!current) return null;
      }
    }
    return current ?? null;
  };

  test("carries self-describing metadata", () => {
    expect(crosswalk.id).toBe(
      "https://ethotechnics.org/standards/delegation-model-crosswalk.json",
    );
    expect(typeof crosswalk.title).toBe("string");
    expect(crosswalk.description.length).toBeGreaterThan(80);
    expect(crosswalk.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(Array.isArray(crosswalk.mappings)).toBe(true);
    expect(crosswalk.mappings.length).toBeGreaterThan(0);
  });

  test("every mapping entry is well-formed", () => {
    const ids = new Set<string>();
    for (const mapping of crosswalk.mappings) {
      expect(typeof mapping.id, JSON.stringify(mapping)).toBe("string");
      expect(ids.has(mapping.id)).toBe(false);
      ids.add(mapping.id);
      expect(Object.keys(crosswalk.relations)).toContain(mapping.relation);
      expect(mapping.note.length, `${mapping.id} note`).toBeGreaterThan(20);
      expect(
        mapping.std_07 !== null || mapping.std_08 !== null,
        `${mapping.id} maps nothing`,
      ).toBe(true);
      if (mapping.std_07 === null || mapping.std_08 === null) {
        expect(mapping.relation, `${mapping.id} relation`).toBe(
          "no_counterpart",
        );
      }
      if (mapping.std_08) {
        expect(mapping.std_08.schema).toMatch(/\.schema\.json$/);
        expect(mapping.std_08.fields.length).toBeGreaterThan(0);
      }
      if (mapping.std_07) {
        expect(typeof mapping.std_07.record_kind).toBe("string");
        expect(mapping.std_07.field.length).toBeGreaterThan(0);
      }
    }
  });

  test("every STD-08 field it names exists in the schema it names", () => {
    for (const mapping of crosswalk.mappings) {
      if (!mapping.std_08) continue;
      const schema = readJson<JsonSchema>(
        join(standardsDir, mapping.std_08.schema),
      );
      for (const field of mapping.std_08.fields) {
        expect(
          resolveField(schema, field),
          `${mapping.id}: ${mapping.std_08.schema}#${field}`,
        ).not.toBeNull();
      }
    }
  });

  test("every STD-07 field it names exists on the record schema", () => {
    const kindContent = (kind: string): JsonSchema | null => {
      if (kind === "any") return recordSchema;
      const branch = (recordSchema.allOf ?? []).find(
        (entry) =>
          (entry.if as JsonSchema | undefined)?.properties?.kind?.const ===
          kind,
      );
      const content = branch?.then?.properties?.content;
      return content ?? null;
    };
    for (const mapping of crosswalk.mappings) {
      if (!mapping.std_07) continue;
      const { record_kind: kind, field } = mapping.std_07;
      const [head, ...tail] = field.split(".");
      if (head === "content") {
        const content = kindContent(kind);
        expect(
          content,
          `${mapping.id}: no content shape for kind ${kind}`,
        ).not.toBeNull();
        let current: JsonSchema | undefined = content ?? undefined;
        for (const segment of tail) current = current?.properties?.[segment];
        expect(current, `${mapping.id}: ${field}`).toBeDefined();
      } else {
        expect(
          recordSchema.properties?.[head],
          `${mapping.id}: ${field}`,
        ).toBeDefined();
      }
    }
  });

  test("the mappings the audit asked for are all present", () => {
    const byId = new Map(crosswalk.mappings.map((entry) => [entry.id, entry]));
    for (const id of [
      "authorization.scope",
      "authorization.holder",
      "authorization.granted_by",
      "authorization.expires_at",
      "authorization.revocation_conditions",
      "authorization.mode",
      "record.depends_on",
      "record.invalidated_by",
      "capability.state",
      "grant.state",
      "grant.state_history",
      "grant.review_conditions",
      "policy_record",
    ]) {
      expect(byId.has(id), `missing mapping ${id}`).toBe(true);
    }
    expect(byId.get("authorization.holder")?.std_08?.fields).toContain(
      "grantee",
    );
    expect(byId.get("authorization.granted_by")?.std_08?.fields).toContain(
      "issuing_authority",
    );
    expect(byId.get("authorization.expires_at")?.std_08?.fields).toContain(
      "until",
    );
    expect(byId.get("record.depends_on")?.std_08?.fields).toEqual(
      expect.arrayContaining(["evidence_basis", "policy_refs"]),
    );
    expect(byId.get("record.invalidated_by")?.std_08?.fields).toContain(
      "assumptions",
    );
    expect(byId.get("capability.state")?.std_08?.fields).toContain(
      "capabilities[].state",
    );
    for (const id of [
      "grant.state",
      "grant.state_history",
      "grant.review_conditions",
      "policy_record",
    ]) {
      expect(
        byId.get(id)?.std_07,
        `${id} must have no STD-07 counterpart`,
      ).toBe(null);
      expect(byId.get(id)?.relation).toBe("no_counterpart");
    }
  });

  test("Part D fields are recorded as having no STD-07 counterpart", () => {
    const byId = new Map(crosswalk.mappings.map((entry) => [entry.id, entry]));
    for (const id of [
      "grant.correction_capacity",
      "grant.correction_capacity.detection",
      "grant.correction_capacity.remedy_components",
      "dependency.preserved_capacities.depreciation",
      "dependency.independent_evaluation",
    ]) {
      const mapping = byId.get(id);
      expect(mapping, `missing mapping ${id}`).toBeDefined();
      expect(mapping!.std_07, `${id} must have no STD-07 counterpart`).toBe(
        null,
      );
      expect(mapping!.relation).toBe("no_counterpart");
      expect(mapping!.note.length, `${id} reason`).toBeGreaterThan(200);
      const schema = readJson<JsonSchema>(
        join(standardsDir, mapping!.std_08!.schema),
      );
      for (const field of mapping!.std_08!.fields) {
        expect(
          resolveField(schema, field),
          `${id}: ${mapping!.std_08!.schema}#${field}`,
        ).not.toBeNull();
      }
    }
    expect(byId.get("grant.correction_capacity")?.note).toContain(
      "what invalidates it",
    );
    expect(
      byId.get("grant.correction_capacity.detection")?.std_08?.fields,
    ).toContain("correction_capacity.detection.independent_of_executor");
    expect(
      byId.get("dependency.preserved_capacities.depreciation")?.std_08?.fields,
    ).toEqual(
      expect.arrayContaining([
        "preserved_capacities[].status",
        "preserved_capacities[].change_since_last_assessment",
      ]),
    );
  });

  test("the one genuine partial overlap with contest is stated precisely", () => {
    const mapping = crosswalk.mappings.find(
      (entry) => entry.id === "record.contest.correction_components",
    );
    expect(mapping).toBeDefined();
    expect(mapping!.relation).toBe("partial");
    expect(mapping!.std_07?.field).toBe("contest");
    expect(mapping!.std_08?.fields).toEqual([
      "correction_capacity.challenge",
      "correction_capacity.standing",
      "correction_capacity.review",
    ]);
    for (const term of ["standing", "channel", "reversal_clock", "evidence"]) {
      expect(mapping!.note, `note must name ${term}`).toContain(term);
    }
    const contest = recordSchema.properties?.contest as JsonSchema;
    for (const field of ["standing", "channel", "reversal_clock"]) {
      expect(contest.properties?.[field], `contest.${field}`).toBeDefined();
    }
  });

  test("the correction-capacity gap is recorded as a known gap", () => {
    const gap = crosswalk.known_gaps.find(
      (entry) => entry.id === "correction-capacity-has-no-record-side",
    );
    expect(gap).toBeDefined();
    expect(gap!.summary).toContain("correct after the fact");
    expect(gap!.detail).toContain("contest");
    expect(gap!.detail.length).toBeGreaterThan(200);
  });

  test("the identifier convention mismatch is recorded as a known gap", () => {
    const gap = crosswalk.known_gaps.find(
      (entry) => entry.id === "identifier-convention-mismatch",
    );
    expect(gap).toBeDefined();
    expect(gap!.detail).toContain("<system>:<kind>:<local-id>");
    expect(gap!.detail).toContain("depends_on");
    expect(gap!.summary.length).toBeGreaterThan(20);
    for (const entry of crosswalk.known_gaps) {
      expect(typeof entry.id).toBe("string");
      expect(entry.detail.length).toBeGreaterThan(40);
    }
  });
});
