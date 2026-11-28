import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PATTERN_OPTIONS, resolveDecor } from "./site-decor";
import { hasPicture } from "./ornament/kbach/use-clear-grounds";
import { THEME_PRESETS } from "./theme-presets";
import { KbachBackdrop } from "./ornament/kbach/KbachBackdrop";
import type { Theme } from "./types";

describe("site decoration", () => {
  it("keeps each template's own look until the couple chooses", () => {
    assert.deepEqual(resolveDecor({}, "covenant"), { pattern: "diamond", corners: true });
    assert.deepEqual(resolveDecor({ pattern: "", corners: "" }, undefined), { pattern: null, corners: false });
    assert.deepEqual(resolveDecor({ pattern: "url(x)", corners: "yes" }, "emerald"), { pattern: null, corners: false });
  });

  it("applies the pattern and the corners separately, on any template", () => {
    assert.deepEqual(resolveDecor({ pattern: "none" }, "covenant"), { pattern: null, corners: true });
    assert.deepEqual(resolveDecor({ corners: "off" }, "covenant"), { pattern: "diamond", corners: false });
    assert.deepEqual(resolveDecor({ pattern: "lotus", corners: "on" }, undefined), { pattern: "lotus", corners: true });
  });

  it("draws every offered pattern, and only the layers asked for", () => {
    for (const { id } of PATTERN_OPTIONS) {
      if (id === "none") continue;
      const html = renderToStaticMarkup(createElement(KbachBackdrop, { color: "#a00", gold: "#b80", pattern: id, corners: false }));
      assert.match(html, /<pattern /, id);
      assert.doesNotMatch(html, /viewBox="0 0 220 220"|NaN|undefined/, id);
    }
    const cornersOnly = renderToStaticMarkup(createElement(KbachBackdrop, { color: "#a00", gold: "#b80", pattern: null, corners: true }));
    assert.doesNotMatch(cornersOnly, /<pattern /);
    assert.match(cornersOnly, /viewBox="0 0 220 220"/);
  });

  it("treats photos as pictures, but not gradients or drawn textures", () => {
    assert.equal(hasPicture("none"), false);
    assert.equal(hasPicture('radial-gradient(red, transparent), url("data:image/svg+xml,%3Csvg(1)%3E")'), false);
    assert.equal(hasPicture('linear-gradient(red, blue), url("https://x.test/a.jpg")'), true);
  });

  it("only offers known patterns in the design presets", () => {
    const ids: readonly string[] = PATTERN_OPTIONS.map((o) => o.id);
    for (const preset of THEME_PRESETS) {
      const { pattern, corners } = preset.theme as Theme;
      if (pattern) assert.ok(ids.includes(pattern), preset.id);
      if (corners) assert.ok(corners === "on" || corners === "off", preset.id);
    }
  });
});
