import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { contrastRatio } from "../../theme-presets";
import type { Theme } from "../../types";
import { buttonStyle, fieldStyle, mediaTones, noteStyle, readableOn } from "./gallery-tones";

const theme = (bg: string, text: string, accent: string): Theme => ({ bg_color: bg, text_color: text, accent_color: accent, font_style: "serif" });

/** The default accents of the six Khmer templates (as verified by the skeleton task). */
const ACCENTS = ["#d4af37", "#8a6a2f", "#886420", "#b01553", "#2f4b8a", "#c82a62", "#e5c07b"];

describe("readableOn", () => {
  it("picks white on a dark accent and deep brown on a light one", () => {
    assert.equal(readableOn("#2f4b8a"), "#ffffff");
    assert.equal(readableOn("#f3e5ab"), "#1b1408");
  });
  it("gives every template accent a button label with at least 4.5:1", () => {
    for (const a of ACCENTS) {
      const ratio = contrastRatio(a, readableOn(a)) ?? 0;
      assert.ok(ratio >= 4.5, `${a} -> ${ratio.toFixed(2)}`);
    }
  });
});

describe("mediaTones", () => {
  it("detects a dark ground and lightens the card on it", () => {
    assert.equal(mediaTones(theme("#0d2b1d", "#f3e5ab", "#d4af37")).dark, true);
    assert.equal(mediaTones(theme("#fbf1de", "#4a0e1a", "#8a5a10")).dark, false);
  });
});

describe("style builders", () => {
  const t = theme("#fbf1de", "#4a0e1a", "#8a5a10");
  it("fields are at least 48px tall and turn red when invalid", () => {
    assert.equal(fieldStyle(t).minHeight, 48);
    assert.notEqual(fieldStyle(t, true).border, fieldStyle(t, false).border);
  });
  it("buttons are at least 48px tall with a readable label", () => {
    const b = buttonStyle(t);
    assert.equal(b.minHeight, 48);
    assert.ok((contrastRatio(t.accent_color, String(b.color)) ?? 0) >= 4.5);
  });
  it("notes follow the requested radius", () => {
    assert.equal(noteStyle(t, { radius: 26 }).borderRadius, 26);
  });
});
