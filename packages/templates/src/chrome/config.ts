/**
 * Template-level switches for the shared "chrome" (music toggle, bottom dock, ambient
 * particles, scroll reveals). Pure data + a normaliser; no React. Everything is OFF unless a
 * template's config turns it on, so templates without a `chrome` block render exactly as before.
 */

export type ParticleKind = "petals" | "butterflies" | "dust" | "bokeh";
export type ParticleDensity = "low" | "normal" | "high";
export type MusicIcon = "disc" | "waves";
export type MusicCorner = "top-right" | "top-left";

export interface ChromeParticlesConfig {
  /** One or more layers; they are drawn together (e.g. ["petals", "dust"]). */
  kinds: ParticleKind[];
  density?: ParticleDensity;
  /** CSS colors cycled over the particles. Default: soft tints derived from the theme accent. */
  colors?: string[];
}

export interface ChromeMusicConfig {
  /** Default audio file (https or site-relative). The couple's own direct-audio URL wins over it. */
  src?: string;
  icon?: MusicIcon;
  corner?: MusicCorner;
}

export interface ChromeDockConfig {
  /**
   * Section keys that get a dock button, in page order. Default: invitation, agenda, details
   * (shown as "Location"), gallery, registry (shown as "Gift"), guestbook (shown as "Wishes").
   * Sections that are disabled or render nothing are skipped automatically.
   */
  include?: string[];
}

export interface ChromeConfig {
  dock?: boolean | ChromeDockConfig;
  music?: boolean | ChromeMusicConfig;
  particles?: ChromeParticlesConfig;
  /** Fade-and-rise on scroll for each section. Default true once chrome is configured. */
  reveal?: boolean;
}

export interface ResolvedChrome {
  dock: { include?: string[] } | null;
  music: { src?: string; icon: MusicIcon; corner: MusicCorner } | null;
  particles: { kinds: ParticleKind[]; density: ParticleDensity; colors?: string[] } | null;
  reveal: boolean;
}

const PARTICLE_KINDS: readonly ParticleKind[] = ["petals", "butterflies", "dust", "bokeh"];
const DENSITIES: readonly ParticleDensity[] = ["low", "normal", "high"];

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function strings(v: unknown): string[] | undefined {
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : undefined;
}

/**
 * Returns null when nothing is switched on, so callers can skip every chrome code path.
 * The config comes from a JSON column that is not validated on write, so every field is
 * checked here: malformed data turns a feature off, it never throws during render.
 */
export function resolveChrome(config: ChromeConfig | null | undefined): ResolvedChrome | null {
  if (!isObject(config)) return null;
  const c = config as Record<string, unknown>;

  const dockIn = c.dock;
  const dock = dockIn ? (isObject(dockIn) ? { include: strings(dockIn.include) } : {}) : null;

  const musicIn = c.music;
  const musicObj = isObject(musicIn) ? musicIn : undefined;
  const music = musicIn
    ? {
        src: typeof musicObj?.src === "string" ? musicObj.src : undefined,
        icon: (musicObj?.icon === "waves" ? "waves" : "disc") as MusicIcon,
        corner: (musicObj?.corner === "top-left" ? "top-left" : "top-right") as MusicCorner,
      }
    : null;

  const p = isObject(c.particles) ? c.particles : undefined;
  const kinds = p && Array.isArray(p.kinds)
    ? [...new Set((p.kinds as unknown[]).filter((k): k is ParticleKind => PARTICLE_KINDS.includes(k as ParticleKind)))]
    : [];
  const particles = p && kinds.length > 0
    ? {
        kinds,
        density: DENSITIES.includes(p.density as ParticleDensity) ? (p.density as ParticleDensity) : ("normal" as const),
        colors: strings(p.colors),
      }
    : null;

  // `reveal` defaults on, but on its own it only counts when asked for explicitly.
  if (!dock && !music && !particles && c.reveal !== true) return null;
  return { dock, music, particles, reveal: c.reveal !== false };
}
