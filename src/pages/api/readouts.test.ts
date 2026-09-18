import { describe, expect, it } from "bun:test";
import type { APIContext } from "astro";

import { buildDefaultInput } from "../../features/delegation-audit/config";
import { POST } from "./readouts";

const createContext = (
  body: string,
  env: Record<string, unknown> = {},
  headers: Record<string, string> = {},
) => {
  const request = new Request("https://ethotechnics.org/api/readouts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://ethotechnics.org",
      ...headers,
    },
    body,
  });
  // Bun's Request drops forbidden headers such as Origin; answer them here.
  const originalGet = request.headers.get.bind(request.headers);
  request.headers.get = (name: string) => {
    const override = Object.entries(headers).find(
      ([key]) => key.toLowerCase() === name.toLowerCase(),
    )?.[1];
    if (override !== undefined) return override;
    if (name.toLowerCase() === "origin") return "https://ethotechnics.org";
    if (name.toLowerCase() === "content-type") return "application/json";
    return originalGet(name);
  };
  return {
    request,
    locals: { runtime: { env } },
  } as unknown as APIContext;
};

const memoryStore = () => {
  const data = new Map<string, string>();
  return {
    data,
    get: async (key: string) => data.get(key) ?? null,
    put: async (key: string, value: string) => {
      data.set(key, value);
    },
  };
};

const validBody = () =>
  JSON.stringify({ tool_id: "delegation-audit", inputs: buildDefaultInput() });

describe("readouts API", () => {
  it("fails closed without the KV binding", async () => {
    const response = await POST(createContext(validBody()));
    expect(response.status).toBe(503);
  });

  it("rejects cross-origin requests and unsupported media types", async () => {
    const crossOrigin = await POST(
      createContext(validBody(), {}, { Origin: "https://attacker.example" }),
    );
    const wrongType = await POST(
      createContext(validBody(), {}, { "Content-Type": "text/plain" }),
    );
    expect(crossOrigin.status).toBe(403);
    expect(wrongType.status).toBe(415);
  });

  it("returns 429 when the limiter rejects a request", async () => {
    const response = await POST(
      createContext(validBody(), {
        READOUTS: memoryStore(),
        READOUT_RATE_LIMITER: { limit: async () => ({ success: false }) },
      }),
    );
    expect(response.status).toBe(429);
  });

  it("rejects bodies that do not match the tool's input schema", async () => {
    const store = memoryStore();
    const response = await POST(
      createContext(
        JSON.stringify({ tool_id: "delegation-audit", inputs: { nope: 1 } }),
        { READOUTS: store },
      ),
    );
    expect(response.status).toBe(422);
    expect(store.data.size).toBe(0);
  });

  it("stores valid inputs and returns the permalink", async () => {
    const store = memoryStore();
    const response = await POST(
      createContext(validBody(), { READOUTS: store }),
    );
    expect(response.status).toBe(201);
    const body = (await response.json()) as { id: string; url: string };
    expect(body.url).toBe(`https://ethotechnics.org/readouts/${body.id}`);
    expect(store.data.has(`readout:${body.id}`)).toBe(true);
  });
});
