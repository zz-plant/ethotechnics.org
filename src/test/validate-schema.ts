import Ajv2020, { type ErrorObject, type SchemaObject } from "ajv/dist/2020";
import addFormats from "ajv-formats";

export type JsonSchema = SchemaObject;

/** "/provenance/issued_at" as "provenance.issued_at", and "/steps/0" as "steps[0]". */
const pathOf = ({ instancePath, keyword, params }: ErrorObject) => {
  const segments = instancePath.split("/").slice(1);
  if (keyword === "additionalProperties") {
    segments.push(String(params.additionalProperty));
  }
  return segments
    .join(".")
    .replace(/\.(\d+)(?=\.|$)/g, "[$1]")
    .replace(/^$/, "$");
};

/** Validates against JSON Schema draft 2020-12. An empty list means valid. */
export const validate = (schema: JsonSchema, value: unknown) => {
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const check = ajv.compile(schema);
  check(value);
  return (check.errors ?? []).map((error) => ({
    path: pathOf(error),
    message: error.message ?? "",
  }));
};

export const formatErrors = (errors: ReturnType<typeof validate>) =>
  errors.map(({ path, message }) => `${path}: ${message}`).join("\n");
