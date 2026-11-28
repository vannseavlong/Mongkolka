import { DECOR_KEYS, FONT_KEYS, sameColor } from "@mongkolka/templates";
import type { Theme } from "@mongkolka/templates";

/** The fields each preset family owns. Picking a preset never touches the other family's fields. */
export const THEME_PRESET_KEYS = ["bg_color", "text_color", "accent_color", ...DECOR_KEYS] as const;
export const FONT_PRESET_KEYS = ["font_style", ...FONT_KEYS] as const;

type PresetKey = (typeof THEME_PRESET_KEYS)[number] | (typeof FONT_PRESET_KEYS)[number];

/** The values a preset sets. A field it leaves out becomes "", meaning "keep the template's own". */
export function presetPatch<K extends PresetKey>(keys: readonly K[], values: Partial<Theme>): Pick<Theme, K> {
  return Object.fromEntries(keys.map((key) => [key, values[key] ?? ""])) as Pick<Theme, K>;
}

export function isPresetActive(keys: readonly PresetKey[], values: Partial<Theme>, current: Partial<Theme>): boolean {
  return keys.every((key) => sameColor(current[key] ?? "", values[key] ?? ""));
}
