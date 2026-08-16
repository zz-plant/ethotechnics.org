/**
 * Scene types + compact SVG renderers.
 *
 * Each scene is a small (~280×90) inline SVG that communicates a project's
 * domain at a glance.  The accent color drives the primary visual element.
 *
 * Intended to be embedded inside project cards on the home page, work page,
 * or any portfolio surface.
 */

export type SceneType =
  | "pipeline"
  | "cards"
  | "review"
  | "notebook"
  | "timeline"
  | "archive"
  | "signals"
  | "book"
  | "desks"
  | "hex"
  | "portfolio"
  | "profile";

export interface SceneConfig {
  scene: SceneType;
  accent: string;
  labels?: string[];
}

/* ─── SVG scene renderers ─────────────────────────────────────────── */

function svg(w: number, h: number, accent: string, content: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" style="display:block;overflow:hidden;border-radius:6px;background:color-mix(in srgb, ${accent} 8%, transparent);">
    <defs><filter id="g"><feGaussianBlur stdDeviation="1.5"/></filter></defs>
    ${content}
  </svg>`;
}

function pipeline(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="20" y="20" width="60" height="28" rx="4" fill="${accent}" opacity="0.25"/>
    <rect x="110" y="20" width="60" height="28" rx="4" fill="${accent}" opacity="0.5"/>
    <rect x="200" y="20" width="60" height="28" rx="4" fill="${accent}" opacity="0.8"/>
    <line x1="80" y1="34" x2="110" y2="34" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    <line x1="170" y1="34" x2="200" y2="34" stroke="${accent}" stroke-width="2" opacity="0.5"/>
    <circle cx="95" cy="34" r="3" fill="${accent}" opacity="0.6">
      <animate attributeName="cx" values="85;185;85" dur="3s" repeatCount="indefinite"/>
    </circle>
  `,
  );
}

function cards(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="18" y="18" width="70" height="54" rx="4" fill="${accent}" opacity="0.3"/>
    <rect x="98" y="18" width="70" height="54" rx="4" fill="${accent}" opacity="0.5"/>
    <rect x="178" y="18" width="70" height="54" rx="4" fill="${accent}" opacity="0.8"/>
    <rect x="26" y="52" width="54" height="4" rx="2" fill="rgba(255,255,255,0.6)"/>
    <rect x="106" y="52" width="54" height="4" rx="2" fill="rgba(255,255,255,0.6)"/>
    <rect x="186" y="52" width="54" height="4" rx="2" fill="rgba(255,255,255,0.6)"/>
    <circle cx="53" cy="48" r="2" fill="${accent}"/>
    <circle cx="133" cy="48" r="2" fill="${accent}"/>
    <circle cx="213" cy="48" r="2" fill="${accent}"/>
  `,
  );
}

function review(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="14" y="14" width="120" height="62" rx="4" fill="${accent}" opacity="0.15"/>
    <rect x="22" y="22" width="36" height="6" rx="2" fill="${accent}" opacity="0.4"/>
    <rect x="22" y="34" width="80" height="4" rx="2" fill="${accent}" opacity="0.2"/>
    <rect x="22" y="44" width="60" height="4" rx="2" fill="${accent}" opacity="0.2"/>
    <rect x="22" y="54" width="70" height="4" rx="2" fill="${accent}" opacity="0.2"/>
    <text x="194" y="52" font-size="32" font-weight="700" text-anchor="middle" fill="${accent}" opacity="0.85">A−</text>
    <rect x="156" y="62" width="76" height="4" rx="2" fill="${accent}" opacity="0.25"/>
  `,
  );
}

function notebook(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="12" y="14" width="156" height="62" rx="4" fill="${accent}" opacity="0.12"/>
    <rect x="20" y="22" width="60" height="4" rx="2" fill="${accent}" opacity="0.35"/>
    <rect x="20" y="32" width="100" height="3" rx="1.5" fill="${accent}" opacity="0.2"/>
    <rect x="20" y="40" width="80" height="3" rx="1.5" fill="${accent}" opacity="0.2"/>
    <rect x="20" y="48" width="90" height="3" rx="1.5" fill="${accent}" opacity="0.2"/>
    <rect x="20" y="56" width="120" height="3" rx="1.5" fill="${accent}" opacity="0.2"/>
    <rect x="20" y="64" width="50" height="4" rx="2" fill="${accent}" opacity="0.35"/>
    <rect x="182" y="14" width="86" height="62" rx="4" fill="${accent}" opacity="0.08"/>
    <circle cx="208" cy="32" r="4" fill="${accent}" opacity="0.3"/>
    <rect x="218" y="29" width="36" height="6" rx="2" fill="${accent}" opacity="0.2"/>
    <circle cx="208" cy="50" r="4" fill="${accent}" opacity="0.3"/>
    <rect x="218" y="47" width="28" height="6" rx="2" fill="${accent}" opacity="0.2"/>
    <circle cx="208" cy="68" r="4" fill="${accent}" opacity="0.3"/>
    <rect x="218" y="65" width="32" height="6" rx="2" fill="${accent}" opacity="0.2"/>
  `,
  );
}

function timeline(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <line x1="48" y1="18" x2="48" y2="72" stroke="${accent}" stroke-width="2" opacity="0.3"/>
    <circle cx="48" cy="24" r="5" fill="${accent}" opacity="0.7"/>
    <rect x="60" y="20" width="80" height="8" rx="3" fill="${accent}" opacity="0.2"/>
    <circle cx="48" cy="45" r="5" fill="${accent}" opacity="0.5"/>
    <rect x="60" y="41" width="120" height="8" rx="3" fill="${accent}" opacity="0.2"/>
    <circle cx="48" cy="66" r="5" fill="${accent}" opacity="0.3"/>
    <rect x="60" y="62" width="60" height="8" rx="3" fill="${accent}" opacity="0.2"/>
  `,
  );
}

function archive(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="16" y="16" width="58" height="58" rx="3" fill="${accent}" opacity="0.2"/>
    <rect x="24" y="24" width="20" height="8" rx="2" fill="${accent}" opacity="0.4"/>
    <line x1="24" y1="40" x2="60" y2="40" stroke="${accent}" stroke-width="2" opacity="0.15"/>
    <line x1="24" y1="50" x2="50" y2="50" stroke="${accent}" stroke-width="2" opacity="0.15"/>
    <rect x="88" y="16" width="58" height="58" rx="3" fill="${accent}" opacity="0.35"/>
    <rect x="96" y="24" width="20" height="8" rx="2" fill="${accent}" opacity="0.55"/>
    <line x1="96" y1="40" x2="132" y2="40" stroke="${accent}" stroke-width="2" opacity="0.25"/>
    <line x1="96" y1="50" x2="122" y2="50" stroke="${accent}" stroke-width="2" opacity="0.25"/>
    <rect x="160" y="16" width="58" height="58" rx="3" fill="${accent}" opacity="0.5"/>
    <rect x="168" y="24" width="20" height="8" rx="2" fill="${accent}" opacity="0.7"/>
    <line x1="168" y1="40" x2="204" y2="40" stroke="${accent}" stroke-width="2" opacity="0.35"/>
    <line x1="168" y1="50" x2="194" y2="50" stroke="${accent}" stroke-width="2" opacity="0.35"/>
  `,
  );
}

function signals(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="14" y="14" width="76" height="62" rx="4" fill="${accent}" opacity="0.12"/>
    <circle cx="52" cy="50" r="14" fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>
    <circle cx="52" cy="50" r="14" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="22 66" opacity="0.8" transform="rotate(-45 52 50)"/>
    <rect x="104" y="14" width="76" height="62" rx="4" fill="${accent}" opacity="0.12"/>
    <circle cx="142" cy="50" r="14" fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>
    <circle cx="142" cy="50" r="14" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="44 44" opacity="0.8" transform="rotate(-20 142 50)"/>
    <rect x="194" y="14" width="76" height="62" rx="4" fill="${accent}" opacity="0.12"/>
    <circle cx="232" cy="50" r="14" fill="none" stroke="${accent}" stroke-width="3" opacity="0.3"/>
    <circle cx="232" cy="50" r="14" fill="none" stroke="${accent}" stroke-width="3" stroke-dasharray="66 22" opacity="0.8" transform="rotate(30 232 50)"/>
  `,
  );
}

function book(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="80" y="14" width="120" height="62" rx="2" fill="${accent}" opacity="0.08"/>
    <rect x="88" y="22" width="40" height="6" rx="2" fill="${accent}" opacity="0.3"/>
    <rect x="88" y="34" width="80" height="3" rx="1.5" fill="${accent}" opacity="0.15"/>
    <rect x="88" y="42" width="60" height="3" rx="1.5" fill="${accent}" opacity="0.15"/>
    <rect x="88" y="50" width="70" height="3" rx="1.5" fill="${accent}" opacity="0.15"/>
    <rect x="88" y="58" width="50" height="3" rx="1.5" fill="${accent}" opacity="0.15"/>
    <line x1="140" y1="14" x2="140" y2="76" stroke="${accent}" stroke-width="1.5" opacity="0.2"/>
  `,
  );
}

function desks(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="14" y="14" width="56" height="62" rx="4" fill="${accent}" opacity="0.12"/>
    <rect x="22" y="22" width="40" height="8" rx="2" fill="${accent}" opacity="0.35"/>
    <rect x="22" y="36" width="40" height="8" rx="2" fill="${accent}" opacity="0.55"/>
    <rect x="22" y="50" width="40" height="8" rx="2" fill="${accent}" opacity="0.2"/>
    <rect x="84" y="14" width="182" height="62" rx="4" fill="${accent}" opacity="0.08"/>
    <rect x="92" y="22" width="60" height="6" rx="2" fill="${accent}" opacity="0.2"/>
    <rect x="92" y="34" width="80" height="4" rx="2" fill="${accent}" opacity="0.12"/>
    <rect x="92" y="44" width="50" height="4" rx="2" fill="${accent}" opacity="0.12"/>
    <rect x="160" y="22" width="80" height="40" rx="4" fill="${accent}" opacity="0.15"/>
    <text x="200" y="48" font-size="18" font-weight="700" text-anchor="middle" fill="${accent}" opacity="0.6">0.65</text>
  `,
  );
}

function hexScene(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <polygon points="70,32 88,18 106,32 106,50 88,64 70,50" fill="${accent}" opacity="0.15" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.4"/>
    <polygon points="140,18 158,32 158,50 140,64 122,50 122,32" fill="${accent}" opacity="0.3" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.6"/>
    <polygon points="200,32 218,18 236,32 236,50 218,64 200,50" fill="${accent}" opacity="0.15" stroke="${accent}" stroke-width="1.5" stroke-opacity="0.4"/>
    <line x1="106" y1="40" x2="122" y2="40" stroke="${accent}" stroke-width="1" opacity="0.3"/>
    <line x1="158" y1="40" x2="200" y2="40" stroke="${accent}" stroke-width="1" opacity="0.3"/>
  `,
  );
}

function portfolio(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <rect x="14" y="14" width="76" height="26" rx="4" fill="${accent}" opacity="0.3"/>
    <rect x="14" y="48" width="76" height="26" rx="4" fill="${accent}" opacity="0.5"/>
    <rect x="104" y="14" width="76" height="26" rx="4" fill="${accent}" opacity="0.15"/>
    <rect x="104" y="48" width="76" height="26" rx="4" fill="${accent}" opacity="0.35"/>
    <rect x="194" y="14" width="76" height="26" rx="4" fill="${accent}" opacity="0.2"/>
    <rect x="194" y="48" width="76" height="26" rx="4" fill="${accent}" opacity="0.4"/>
  `,
  );
}

function profile(accent: string): string {
  return svg(
    280,
    90,
    accent,
    `
    <circle cx="52" cy="40" r="24" fill="${accent}" opacity="0.15"/>
    <circle cx="52" cy="38" r="12" fill="${accent}" opacity="0.3"/>
    <rect x="90" y="20" width="80" height="6" rx="3" fill="${accent}" opacity="0.35"/>
    <rect x="90" y="32" width="120" height="4" rx="2" fill="${accent}" opacity="0.15"/>
    <rect x="90" y="42" width="60" height="4" rx="2" fill="${accent}" opacity="0.15"/>
    <rect x="90" y="52" width="100" height="4" rx="2" fill="${accent}" opacity="0.15"/>
    <rect x="90" y="62" width="80" height="4" rx="2" fill="${accent}" opacity="0.15"/>
  `,
  );
}

/* ─── registry ────────────────────────────────────────────────────── */

const registry: Record<SceneType, (accent: string) => string> = {
  pipeline,
  cards,
  review,
  notebook,
  timeline,
  archive,
  signals,
  book,
  desks,
  hex: hexScene,
  portfolio,
  profile,
};

export function renderCompactScene(config: SceneConfig): string {
  const render = registry[config.scene];
  if (!render) return "";
  return render(config.accent);
}
