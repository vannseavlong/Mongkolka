import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FONT_PRESETS, THEME_PRESETS } from "@mongkolka/templates";
import type { Theme } from "@mongkolka/templates";
import { FONT_PRESET_KEYS, THEME_PRESET_KEYS, isPresetActive, presetPatch } from "./design-presets";

const current: Theme = { bg_color: "#fff", text_color: "#000", accent_color: "#a00", font_style: "sans", font_kh_heading: "koulen", pattern: "lotus", corners: "on" };

describe("design presets", () => {
  it("keeps the fonts when a theme preset is picked", () => {
    for (const preset of THEME_PRESETS) {
      const next = { ...current, ...presetPatch(THEME_PRESET_KEYS, preset.theme) };
      for (const key of FONT_PRESET_KEYS) assert.equal(next[key], current[key], `${preset.id} ${key}`);
      assert.ok(isPresetActive(THEME_PRESET_KEYS, preset.theme, next), preset.id);
    }
  });

  it("keeps the colors and background when a font preset is picked", () => {
    for (const preset of FONT_PRESETS) {
      const next = { ...current, ...presetPatch(FONT_PRESET_KEYS, preset.fonts) };
      for (const key of THEME_PRESET_KEYS) assert.equal(next[key], current[key], `${preset.id} ${key}`);
      assert.ok(isPresetActive(FONT_PRESET_KEYS, preset.fonts, next), preset.id);
    }
  });

  it("clears the choices a preset leaves to the template", () => {
    const patch = presetPatch(FONT_PRESET_KEYS, { font_style: "serif" });
    assert.equal(patch.font_kh_heading, "");
    assert.equal(patch.font_style, "serif");
  });
});
