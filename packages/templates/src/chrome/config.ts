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

/** Returns null when nothing is switched on, so callers can skip every chrome code path. */
export function resolveChrome(config: ChromeConfig | null | undefined): ResolvedChrome | null {
  if (!config) return null;
  const dock = config.dock ? (config.dock === true ? {} : { include: config.dock.include }) : null;
  const musicIn = config.music;
  const music = musicIn
    ? {
        src: musicIn === true ? undefined : musicIn.src,
        icon: (musicIn === true ? undefined : musicIn.icon) ?? "disc",
        corner: (musicIn === true ? undefined : musicIn.corner) ?? "top-right",
      }
    : null;
  const p = config.particles;
  const particles = p && p.kinds.length > 0 ? { kinds: [...new Set(p.kinds)], density: p.density ?? "normal", colors: p.colors } : null;
  // `reveal` defaults on, but on its own it only counts when asked for explicitly.
  if (!dock && !music && !particles && config.reveal !== true) return null;
  return { dock, music, particles, reveal: config.reveal ?? true };
}
