import { describe, expect, it } from "bun:test";

const loadAstroConfig = async () => {
  const configModule = await import(
    new URL("../astro.config.mjs", import.meta.url).href
  );

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
  }, 15000);

  it("has the expected Worker name and no legacy entrypoint", async () => {
    const wranglerText = await Bun.file("wrangler.toml").text();
    const wranglerConfig = Bun.TOML.parse(wranglerText) as {
      main?: string;
      name?: string;
    };

    // @astrojs/cloudflare v13 + @cloudflare/vite-plugin handles the
    // worker entrypoint automatically — the wrangler.toml no longer
    // needs a `main` field.
    expect(wranglerConfig.main).toBeUndefined();
    expect(wranglerConfig.name).toBe("et3");
  });

  it("deploys the generated Astro Cloudflare Worker config", async () => {
    const packageJson = (await Bun.file("package.json").json()) as {
      scripts?: Record<string, string>;
    };

    expect(packageJson.scripts?.deploy).toContain(
      "--config dist/server/wrangler.json",
    );
    expect(packageJson.scripts?.["deploy:preview"]).toContain(
      "--config dist/server/wrangler.json",
    );
    expect(packageJson.scripts?.["preview:cf"]).toContain(
      "--config dist/server/wrangler.json",
    );
    expect(packageJson.scripts?.build).toContain("bun run patch:cf-worker");

    // Deployment is manual via `bun run deploy`; there is no legacy GitHub
    // Actions workflow in this repo.
    expect(await Bun.file(".github/workflows/deploy.yml").exists()).toBe(false);
  });
});
