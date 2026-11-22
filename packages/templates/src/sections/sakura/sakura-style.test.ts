import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { Theme } from "../../types";
import { contrastRatio } from "../../theme-presets";
import { paletteKey, sakuraPalette } from "./palette";
import { bedVar, branchesVar, foilText, hasKhmer, sakuraHeading, sakuraSurface } from "./sakura-style";

const theme: Theme = { bg_color: "#f7d6e0", text_color: "#4a1230", accent_color: "#b01553", font_style: "serif" };

describe("sakura palette", () => {
  it("derives blossom tones from the accent and keeps the fixed identity colours", () => {
    const p = sakuraPalette(theme);
    assert.equal(p.accent, "#b01553");
    assert.equal(p.lavender, "#c8b6e2");
    assert.notEqual(p.petalPale, p.petalDeep);
  });
  it("foil text stops stay readable (>= 3:1) on the card for large headings", () => {
    const p = sakuraPalette(theme);
    for (const stop of [p.textHi, p.textMid, p.textLo]) {
      const c = contrastRatio(stop, p.card);
      assert.ok(c !== null && c >= 3, `${stop} on ${p.card} is ${c}`);
    }
  });
  it("custom-property names are identifier-safe and accent specific", () => {
    assert.equal(paletteKey("#B01553"), "b01553");
    assert.equal(branchesVar("#b01553"), "--sk-br-b01553");
    assert.equal(bedVar("#b01553"), "--sk-bd-b01553");
    assert.notEqual(branchesVar("#112233"), branchesVar("#b01553"));
  });
});

describe("sakura style", () => {
  it("surface layers the art vars with a fallback and a gold hairline", () => {
    const s = sakuraSurface(theme);
    assert.ok(String(s.backgroundImage).includes("var(--sk-br-b01553, none)"));
    assert.ok(String(s.backgroundImage).includes("var(--sk-bd-b01553, none)"));
    assert.ok(String(s.border).includes("1px solid"));
  });
  it("headings use Moul in Khmer and tracked caps in English, both as foil", () => {
    const kh = sakuraHeading(theme, "kh");
    const en = sakuraHeading(theme, "en");
    assert.ok(String(kh.fontFamily).includes("Moul"));
    assert.equal(en.textTransform, "uppercase");
    assert.equal(kh.WebkitTextFillColor, "transparent");
    assert.ok(String(foilText(sakuraPalette(theme)).backgroundImage).includes("linear-gradient"));
  });
  it("detects Khmer names", () => {
    assert.equal(hasKhmer("សុខា"), true);
    assert.equal(hasKhmer("Sokha"), false);
  });
});
