import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { cornerFlames, petalPath } from "./geometry";
import { KbachBackdrop } from "./KbachBackdrop";

describe("kbach ornament", () => {
  it("draws a closed petal and flames that shrink away from the corner", () => {
    assert.match(petalPath(0, 0, 10, 20), /^M0 0C.*0 -20C.*0 0Z$/);
    const flames = cornerFlames();
    assert.ok(flames.every((f, i) => f.scale > 0 && (i === 0 || (f.scale < flames[i - 1]!.scale && f.x > flames[i - 1]!.x))));
  });

  it("is decoration only, and ids stay unique when used twice", () => {
    const one = createElement(KbachBackdrop, { color: "#b03a70", gold: "#b8892e" });
    const html = renderToStaticMarkup(createElement(Fragment, null, one, one));
    const ids = [...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(ids.length, 2);
    assert.equal(new Set(ids).size, 2);
    assert.match(html, /^<div aria-hidden="true" style="position:fixed[^"]*pointer-events:none/);
    assert.doesNotMatch(html, /NaN|undefined/);
  });
});
