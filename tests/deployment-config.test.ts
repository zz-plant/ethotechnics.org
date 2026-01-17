import { describe, expect, it } from "bun:test";

const loadAstroConfig = async () => {
  const configModule = await import(new URL("../astro.config.mjs", import.meta.url).href);

  return configModule.default as {
    site?: string;
    output?: string;
  };
};

describe("deployment configuration", () => {
  it("pins the canonical site URL and server output", async () => {
    const config = await loadAstroConfig();

    expect(config.site).toBe("https://ethotechnics.org");
    expect(config.output).toBe("server");
  });

  it("uses the expected Cloudflare Worker entrypoint", async () => {
    const wranglerText = await Bun.file("wrangler.toml").text();
    const wranglerConfig = Bun.TOML.parse(wranglerText) as {
      main?: string;
      name?: string;
    };

    expect(wranglerConfig.main).toBe("./dist/_worker.js");
    expect(wranglerConfig.name).toBe("et3");
  });
});
