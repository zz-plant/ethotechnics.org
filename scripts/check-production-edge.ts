/**
 * Probes the production edge for the failure modes that would not show up in
 * local preview: DNS, Cloudflare managed challenges on HTML surfaces, and
 * non-success responses on the endpoints real readers and crawlers hit first.
 *
 * The bash version of this check needed curl and temp files; this port runs
 * on Bun alone so it can share the check-script harness.
 *
 * DNS-only failures are downgraded to a warning unless STRICT_DNS_FAILURES=1:
 * a resolver hiccup from one machine says nothing about the site.
 *
 * Run: bun run scripts/check-production-edge.ts [baseUrl]
 */

const BASE_URL = process.argv[2] ?? "https://ethotechnics.org";
const ENDPOINTS = ["/", "/rss.xml", "/sitemap.xml", "/field-notes"];

const isDnsFailure = (error: unknown): boolean => {
  const text = `${error instanceof Error ? `${error.message} ${String(error.cause)}` : String(error)}`;
  return /ENOTFOUND|EAI_AGAIN|getaddrinfo|Unable to connect/i.test(text);
};

async function main(): Promise<void> {
  let failures = 0;
  let dnsFailures = 0;

  for (const endpoint of ENDPOINTS) {
    const url = `${BASE_URL.replace(/\/$/, "")}${endpoint}`;
    let status = "HTTP status unavailable";
    let headers: Headers;
    let body: string;

    try {
      const response = await fetch(url, { redirect: "manual" });
      status = `HTTP/${response.status}`;
      headers = response.headers;
      body = await response.text();
    } catch (error) {
      console.log(`[${endpoint}] ${status}`);
      if (isDnsFailure(error)) {
        console.log("  ❌ DNS resolution failed.");
        dnsFailures += 1;
        failures += 1;
      } else {
        console.log(`  ❌ Request failed: ${error}`);
        failures += 1;
      }
      continue;
    }

    const statusCode = Number(status.split("/")[1]);
    console.log(`[${endpoint}] ${status}`);

    const mitigated =
      headers?.get("cf-mitigated")?.toLowerCase() === "challenge";
    if (mitigated) {
      console.log(
        "  ❌ Cloudflare managed challenge is enabled for this endpoint.",
      );
      failures += 1;
    } else if (statusCode === 403 && body.includes("Just a moment")) {
      console.log("  ❌ Received Cloudflare challenge interstitial body.");
      failures += 1;
    } else if (!Number.isFinite(statusCode) || statusCode >= 400) {
      console.log(`  ❌ Non-success response (${statusCode || "unknown"}).`);
      failures += 1;
    } else {
      console.log("  ✅ Reachable.");
    }
  }

  if (failures > 0) {
    if (
      dnsFailures > 0 &&
      failures === dnsFailures &&
      process.env.STRICT_DNS_FAILURES !== "1"
    ) {
      console.log("\nProduction edge checks completed with DNS warnings.");
      return;
    }
    console.log("\n❌ Production edge checks found failures.");
    process.exit(1);
  }

  console.log("\nAll production edge checks passed.");
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
