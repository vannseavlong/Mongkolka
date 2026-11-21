import { goldGradient, goldStops, mixHex, withAlpha } from "./gold";

/** CSS custom properties every chrome element reads. Derived from the 4 theme colors only. */
export interface ChromeThemeInput {
  bg_color: string;
  text_color: string;
  accent_color: string;
}

export function chromeVars(theme: ChromeThemeInput): Record<string, string> {
  const { hi, mid, lo } = goldStops(theme.accent_color);
  return {
    "--mk-gold": mid,
    "--mk-gold-hi": hi,
    "--mk-gold-lo": lo,
    "--mk-gold-grad": goldGradient(theme.accent_color, 135),
    "--mk-glass": withAlpha(theme.bg_color, 0.64),
    "--mk-glass-solid": theme.bg_color,
    "--mk-ink": theme.text_color,
    "--mk-glow": withAlpha(mid, 0.38),
  };
}

/** Default particle colors: soft tints of the accent, so a dark-green gold template gets gold and a blush one gets pale rose-gold. */
export function defaultParticleColors(accent: string): string[] {
  return [mixHex(accent, "#ffffff", 55), mixHex(accent, "#ffffff", 80), accent];
}
