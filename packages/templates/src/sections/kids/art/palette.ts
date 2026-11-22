import type { Theme } from "../../../types";
import { mixHex } from "../../../chrome/gold";

/** Colours of the kids skin. Berry and the ground come from the theme (so a couple can recolour); the pastels are fixed. */
export interface KidsPalette {
  berry: string;
  rose: string;
  ground: string;
  ink: string;
  peach: string;
  mint: string;
  lavender: string;
  sky: string;
  gold: string;
}

export const KIDS_PASTELS = { peach: "#ffd8c2", mint: "#bdebdd", lavender: "#d9c8f0", sky: "#cfe6ff", gold: "#f6c453" } as const;

export function kidsPalette(theme: Theme): KidsPalette {
  const berry = theme.accent_color;
  return {
    berry,
    rose: mixHex(berry, "#ff7a96", 28),
    ground: theme.bg_color,
    ink: theme.text_color,
    ...KIDS_PASTELS,
  };
}
