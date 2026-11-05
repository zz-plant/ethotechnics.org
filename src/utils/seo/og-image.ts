import resvgWasmModule from "@resvg/resvg-wasm/index_bg.wasm";
import serifSemiboldFont from "../../assets/fonts/source-serif-4-semibold-latin.ttf?inline";
import sansRegularFont from "../../assets/fonts/source-sans-3-regular-latin.ttf?inline";
import sansSemiboldFont from "../../assets/fonts/source-sans-3-semibold-latin.ttf?inline";
import { createHash } from "node:crypto";
import { buildOgCardSvg, HEIGHT, WIDTH } from "./og-cards";
import { OG_TEMPLATES, resolveOgTemplate } from "./og-template";

const DEFAULT_TITLE = "Ethotechnics Institute";
const DEFAULT_DESCRIPTION =
  "Standards, mechanisms, and validators for accountable system governance.";
const MAX_TITLE_CHARS = 98;
const MAX_DESCRIPTION_CHARS = 185;
const MAX_TEMPLATE_CHARS = 32;
const MAX_PATH_CHARS = 240;

type OgRequestInput = {
  title: string;
  description: string;
  template?: string;
  path?: string;
  v?: string;
};

const trimToLength = (value: string, maxLength: number) => {
  const normalized = value.replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) return normalized;
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
};

const normalizeOptionalParam = (
  value: string | null | undefined,
  max: number,
) => {
  if (!value) return undefined;
  const normalized = value.replace(/\s+/g, " ").trim();
  if (!normalized) return undefined;
  return normalized.slice(0, max);
};

const normalizeOgRequestInput = (input: Partial<OgRequestInput>) => ({
  title: trimToLength(input.title ?? DEFAULT_TITLE, MAX_TITLE_CHARS),
  description: trimToLength(
    input.description ?? DEFAULT_DESCRIPTION,
    MAX_DESCRIPTION_CHARS,
  ),
  template: normalizeOptionalParam(input.template, MAX_TEMPLATE_CHARS),
  path: normalizeOptionalParam(input.path, MAX_PATH_CHARS),
  v: normalizeOptionalParam(input.v, 16),
});

const buildOgEtag = (input: Partial<OgRequestInput>) => {
  const normalized = normalizeOgRequestInput(input);
  const digest = createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
  return `"${digest}"`;
};

const isIfNoneMatchSatisfied = (ifNoneMatch: string | null, etag: string) => {
  if (!ifNoneMatch) return false;
  const normalizeTag = (value: string) => value.trim().replace(/^W\//, "");
  const normalizedEtag = normalizeTag(etag);

  return ifNoneMatch.split(",").some((token) => {
    const candidate = token.trim();
    if (candidate === "*") return true;
    return normalizeTag(candidate) === normalizedEtag;
  });
};

const buildOgSvg = (
  title: string,
  description: string,
  options?: { template?: string; path?: string },
) =>
  buildOgCardSvg(
    trimToLength(title, MAX_TITLE_CHARS),
    trimToLength(description, MAX_DESCRIPTION_CHARS),
    options,
  );

const decodeFontSource = async (src: string): Promise<Uint8Array> => {
  if (typeof src === "string" && src.startsWith("data:")) {
    const commaIndex = src.indexOf(",");
    const base64 = commaIndex >= 0 ? src.slice(commaIndex + 1) : src;
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  if (
    typeof process !== "undefined" &&
    typeof src === "string" &&
    (src.startsWith("/") || src.startsWith("."))
  ) {
    try {
      const { readFileSync, existsSync } = await import("node:fs");
      if (existsSync(src)) {
        return new Uint8Array(readFileSync(src));
      }
    } catch {
      // In restricted runtimes, fall through
    }
  }

  try {
    const res = await fetch(src);
    if (res.ok) {
      return new Uint8Array(await res.arrayBuffer());
    }
  } catch {
    // ignore
  }

  return new Uint8Array();
};

const FONT_SOURCES = [serifSemiboldFont, sansRegularFont, sansSemiboldFont];

/**
 * resvg-wasm has no system fonts to fall back on, so text renders only for
 * families whose buffers are handed to it. Both the wasm and the fonts are
 * imported ahead of time so the worker does not rely on request-time network
 * fetches that fail on same-zone Cloudflare Worker subrequests.
 */
let resvgInitPromise: Promise<Uint8Array[]> | null = null;

const initResvg = async (baseUrl?: string | URL) => {
  if (!resvgInitPromise) {
    resvgInitPromise = (async () => {
      const { initWasm } = await import("@resvg/resvg-wasm");

      // In Node/Bun test environments, resvgWasmModule may resolve to a path string
      // rather than a compiled WebAssembly.Module.
      if (typeof resvgWasmModule === "string") {
        try {
          const { readFileSync, existsSync } = await import("node:fs");
          if (existsSync(resvgWasmModule)) {
            await initWasm(readFileSync(resvgWasmModule));
          } else {
            await initWasm(resvgWasmModule);
          }
        } catch {
          await initWasm(resvgWasmModule);
        }
      } else {
        await initWasm(resvgWasmModule);
      }

      return Promise.all(
        FONT_SOURCES.map(async (src) => {
          const resolvedSrc =
            baseUrl &&
            typeof src === "string" &&
            !src.startsWith("data:") &&
            !src.startsWith("/") &&
            !src.startsWith(".")
              ? new URL(src, baseUrl).toString()
              : src;
          return decodeFontSource(resolvedSrc);
        }),
      );
    })();
  }

  const buffers = (await resvgInitPromise).filter(
    (buffer) => buffer.length > 0,
  );
  if (buffers.length === 0) {
    throw new Error(
      "resvg: failed to load font buffers for OG image rendering",
    );
  }
  return buffers;
};

const renderOgPng = async (
  title: string,
  description: string,
  options?: {
    template?: string;
    path?: string;
    baseUrl?: string | URL;
    fontBuffers?: Uint8Array[];
  },
) => {
  const fontBuffers =
    options?.fontBuffers && options.fontBuffers.length > 0
      ? options.fontBuffers
      : await initResvg(options?.baseUrl ?? "https://ethotechnics.org");
  const { Resvg } = await import("@resvg/resvg-wasm");
  const svg = buildOgSvg(title, description, options);
  const renderer = new Resvg(svg, {
    font: {
      fontBuffers,
      defaultFontFamily: "Source Sans 3",
      serifFamily: "Source Serif 4",
      sansSerifFamily: "Source Sans 3",
    },
    fitTo: {
      mode: "width",
      value: WIDTH,
    },
  });

  return renderer.render().asPng();
};

export {
  buildOgSvg,
  buildOgEtag,
  renderOgPng,
  normalizeOgRequestInput,
  isIfNoneMatchSatisfied,
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  HEIGHT,
  WIDTH,
  OG_TEMPLATES,
  resolveOgTemplate,
};
