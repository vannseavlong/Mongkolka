import type { FontKey } from "./site-fonts";
import type { Theme } from "./types";

/** font_style values the section components understand (anything else renders sans-serif). */
export const FONT_STYLES = [
  { value: "serif", label: "Serif" },
  { value: "sans", label: "Sans" },
] as const;

export type FontStyle = (typeof FONT_STYLES)[number]["value"];

export interface FontPreset {
  id: string;
  name: string;
  fonts: Pick<Theme, FontKey> & { font_style: FontStyle };
}

/** Named font sets: fonts only, never colors or background (see THEME_PRESETS). */
export const FONT_PRESETS = [
  { id: "classic-khmer", name: "Classic Khmer", fonts: { font_style: "serif", font_kh_heading: "moul", font_kh_body: "battambang", font_en_heading: "cinzel", font_en_script: "great-vibes" } },
  { id: "elegant", name: "Elegant", fonts: { font_style: "serif", font_kh_heading: "moul", font_kh_body: "battambang", font_en_heading: "cormorant", font_en_script: "great-vibes" } },
  { id: "romantic", name: "Romantic", fonts: { font_style: "serif", font_kh_heading: "moulpali", font_kh_body: "siemreap", font_en_heading: "playfair", font_en_script: "parisienne" } },
  { id: "garden", name: "Garden", fonts: { font_style: "serif", font_kh_heading: "moulpali", font_kh_body: "battambang", font_en_heading: "cormorant", font_en_script: "dancing" } },
  { id: "modern", name: "Modern", fonts: { font_style: "sans", font_kh_heading: "koulen", font_kh_body: "kantumruy", font_en_heading: "playfair", font_en_script: "dancing" } },
] as const satisfies readonly FontPreset[];
