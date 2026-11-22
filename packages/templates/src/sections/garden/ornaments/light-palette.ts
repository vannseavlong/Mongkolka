import { gardenPalette, type GardenPalette } from "../palette";

/** Ornament components only receive the accent colour, so they draw on a light ground. */
export function lightPalette(accent: string): GardenPalette {
  return gardenPalette({ bg_color: "#fdfbf7", text_color: "#3b3326", accent_color: accent, font_style: "serif" });
}
