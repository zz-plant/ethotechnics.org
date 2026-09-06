/**
 * A small JSON Schema (draft 2020-12) validator covering the subset of
 * keywords used by the schemas under public/standards. It exists so the
 * example instances can be validated in unit tests without adding a
 * dependency. Supported keywords: type, required, properties,
 * additionalProperties (boolean or schema), enum, const, items, oneOf, anyOf,
 * allOf, pattern, format (date-time, date), minimum, maximum, minItems,
 * maxItems, and local $ref ("#/..." JSON pointers).
 */

export type JsonSchema = {
  $ref?: string;
  type?: string | string[];
  required?: string[];
  properties?: Record<string, JsonSchema>;
  additionalProperties?: boolean | JsonSchema;
  enum?: unknown[];
  const?: unknown;
  items?: JsonSchema;
  oneOf?: JsonSchema[];
  anyOf?: JsonSchema[];
  allOf?: JsonSchema[];
  pattern?: string;
  format?: string;
  minimum?: number;
  maximum?: number;
  minItems?: number;
  maxItems?: number;
  [keyword: string]: unknown;
};

export type ValidationError = { path: string; message: string };

const DATE_TIME_PATTERN =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const typeOf = (value: unknown): string => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  if (typeof value === "number") {
    return Number.isInteger(value) ? "integer" : "number";
  }
  return typeof value;
};

const matchesType = (value: unknown, expected: string) => {
  const actual = typeOf(value);
  if (expected === "number") return actual === "number" || actual === "integer";
  return actual === expected;
};

const resolvePointer = (root: JsonSchema, ref: string): JsonSchema => {
  if (!ref.startsWith("#")) {
    throw new Error(`Only local $ref values are supported, got "${ref}".`);
  }
  const segments = ref
    .slice(1)
    .split("/")
    .filter((segment) => segment.length > 0)
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"));

  let current: unknown = root;
  for (const segment of segments) {
    if (typeof current !== "object" || current === null) {
      throw new Error(`Cannot resolve $ref "${ref}".`);
    }
    current = (current as Record<string, unknown>)[segment];
  }
  if (typeof current !== "object" || current === null) {
    throw new Error(`$ref "${ref}" does not point at a schema.`);
  }
  return current as JsonSchema;
};

const checkFormat = (value: string, format: string): boolean => {
  switch (format) {
    case "date-time":
      return DATE_TIME_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
    case "date":
      return DATE_PATTERN.test(value) && !Number.isNaN(Date.parse(value));
    default:
      return true;
  }
};

const validateNode = (
  schema: JsonSchema,
  value: unknown,
  path: string,
  root: JsonSchema,
  errors: ValidationError[],
) => {
  const fail = (message: string) => errors.push({ path: path || "$", message });

  if (schema.$ref) {
    validateNode(resolvePointer(root, schema.$ref), value, path, root, errors);
  }

  if (schema.type !== undefined) {
    const expected = Array.isArray(schema.type) ? schema.type : [schema.type];
    if (!expected.some((candidate) => matchesType(value, candidate))) {
      fail(`expected type ${expected.join(" | ")}, got ${typeOf(value)}`);
      return;
    }
  }

  if (schema.enum !== undefined) {
    if (!schema.enum.some((candidate) => deepEqual(candidate, value))) {
      fail(
        `value ${JSON.stringify(value)} is not one of ${JSON.stringify(schema.enum)}`,
      );
    }
  }

  if (schema.const !== undefined && !deepEqual(schema.const, value)) {
    fail(
      `value ${JSON.stringify(value)} is not ${JSON.stringify(schema.const)}`,
    );
  }

  if (typeof value === "string") {
    if (
      schema.pattern !== undefined &&
      !new RegExp(schema.pattern).test(value)
    ) {
      fail(`"${value}" does not match pattern ${schema.pattern}`);
    }
    if (schema.format !== undefined && !checkFormat(value, schema.format)) {
      fail(`"${value}" is not a valid ${schema.format}`);
    }
  }

  if (typeof value === "number") {
    if (schema.minimum !== undefined && value < schema.minimum) {
      fail(`${value} is below minimum ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && value > schema.maximum) {
      fail(`${value} is above maximum ${schema.maximum}`);
    }
  }

  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      fail(`expected at least ${schema.minItems} items`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      fail(`expected at most ${schema.maxItems} items`);
    }
    if (schema.items !== undefined) {
      value.forEach((item, index) =>
        validateNode(
          schema.items as JsonSchema,
          item,
          `${path}[${index}]`,
          root,
          errors,
        ),
      );
    }
  }

  if (typeOf(value) === "object") {
    const record = value as Record<string, unknown>;
    for (const key of schema.required ?? []) {
      if (!(key in record)) fail(`missing required property "${key}"`);
    }
    const properties = schema.properties ?? {};
    for (const [key, child] of Object.entries(properties)) {
      if (key in record) {
        validateNode(
          child,
          record[key],
          path ? `${path}.${key}` : key,
          root,
          errors,
        );
      }
    }
    if (schema.additionalProperties !== undefined) {
      for (const key of Object.keys(record)) {
        if (key in properties) continue;
        const childPath = path ? `${path}.${key}` : key;
        if (schema.additionalProperties === false) {
          errors.push({
            path: childPath,
            message: "additional property is not allowed",
          });
        } else if (typeof schema.additionalProperties === "object") {
          validateNode(
            schema.additionalProperties,
            record[key],
            childPath,
            root,
            errors,
          );
        }
      }
    }
  }

  if (schema.allOf) {
    schema.allOf.forEach((branch) =>
      validateNode(branch, value, path, root, errors),
    );
  }

  if (schema.anyOf) {
    const matched = schema.anyOf.some(
      (branch) => validate(branch, value, root).length === 0,
    );
    if (!matched) fail("value does not match any anyOf branch");
  }

  if (schema.oneOf) {
    const matches = schema.oneOf.filter(
      (branch) => validate(branch, value, root).length === 0,
    ).length;
    if (matches !== 1) {
      fail(`value matches ${matches} oneOf branches, expected exactly 1`);
    }
  }
};

const deepEqual = (a: unknown, b: unknown): boolean => {
  if (a === b) return true;
  if (typeOf(a) !== typeOf(b)) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    return (
      a.length === b.length &&
      a.every((item, index) => deepEqual(item, b[index]))
    );
  }
  if (typeOf(a) === "object") {
    const left = a as Record<string, unknown>;
    const right = b as Record<string, unknown>;
    const keys = Object.keys(left);
    return (
      keys.length === Object.keys(right).length &&
      keys.every((key) => deepEqual(left[key], right[key]))
    );
  }
  return false;
};

/**
 * Validate a value against a schema. Returns an empty array when valid.
 * `root` is the document that local $ref pointers resolve against; it
 * defaults to the schema itself.
 */
export const validate = (
  schema: JsonSchema,
  value: unknown,
  root: JsonSchema = schema,
): ValidationError[] => {
  const errors: ValidationError[] = [];
  validateNode(schema, value, "", root, errors);
  return errors;
};

export const formatErrors = (errors: ValidationError[]) =>
  errors.map((error) => `${error.path}: ${error.message}`).join("\n");
