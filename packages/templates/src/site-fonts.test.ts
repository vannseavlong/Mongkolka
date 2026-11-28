import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { FONT_ROLES, fontStack, siteFontVars } from "./site-fonts";
import { FONT_PRESETS } from "./font-presets";
import { themeFont } from "./theme";
import type { Theme } from "./types";

const theme: Theme = { bg_color: "#fff", text_color: "#000", accent_color: "#a00", font_style: "serif" };

describe("site fonts", () => {
  it("changes nothing for the template default or an unknown id", () => {
    assert.deepEqual(siteFontVars(theme), {});
    assert.deepEqual(siteFontVars({ ...theme, font_kh_heading: "", font_en_script: "constructor", font_kh_body: 'x"); color: red' }), {});
    assert.equal(fontStack("font_kh_heading", "playfair"), null);
  });

  it("points each role's variables at the chosen face", () => {
    const vars = siteFontVars({ ...theme, font_kh_heading: "koulen", font_kh_body: "siemreap" });
    assert.equal(vars["--font-moul"], 'var(--face-koulen, "Koulen"), "Koulen"');
    assert.equal(vars["--font-khmer"], vars["--font-battambang"]);
    assert.equal(vars["--site-body"], '"Siemreap", serif');
    assert.equal(vars["--font-script"], undefined);
  });

  it("leaves out the Arial stand-in for a face without Latin letters", () => {
    assert.equal(fontStack("font_kh_body", "siemreap"), '"Siemreap"');
    assert.equal(siteFontVars({ ...theme, font_kh_body: "siemreap" })["--font-battambang"], '"Siemreap"');
  });

  it("only offers known faces in the font presets", () => {
    for (const preset of FONT_PRESETS)
      for (const role of FONT_ROLES) assert.ok(fontStack(role.key, preset.fonts[role.key]), `${preset.id} ${role.key}`);
  });

  it("falls back to serif or sans for plain text", () => {
    assert.equal(themeFont(theme), "var(--site-body, serif)");
    assert.equal(themeFont({ ...theme, font_style: "sans" }), "var(--site-body, sans-serif)");
  });
});
