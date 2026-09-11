import { describe, expect, it } from "bun:test";

import schema from "../../public/standards/authority-grant.schema.json";
import { DIAGRAM_STATES } from "./grant-states";

describe("the grant state diagram matches the schema", () => {
  it("draws every state the object can be in, and no others", () => {
    const fromSchema = [...schema.properties.state.enum].sort();
    expect([...DIAGRAM_STATES].sort()).toEqual(fromSchema);
  });

  it("uses the same origin state the schema uses for issue", () => {
    expect(
      schema.properties.state_history.items.properties.from.enum,
    ).toContain("none");
  });
});
