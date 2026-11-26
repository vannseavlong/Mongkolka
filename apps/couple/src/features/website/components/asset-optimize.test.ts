import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { fitWithin, pickSmaller } from "./asset-optimize";

describe("image optimizer", () => {
  it("caps the longest side and keeps the shape", () => {
    assert.deepEqual(fitWithin(6000, 4000, 2048), { width: 2048, height: 1365, scaled: true });
    assert.deepEqual(fitWithin(4000, 6000, 2048), { width: 1365, height: 2048, scaled: true });
  });
  it("never enlarges", () => {
    assert.deepEqual(fitWithin(800, 600, 2048), { width: 800, height: 600, scaled: false });
  });
  it("keeps the new file only when it is smaller, with a matching extension", () => {
    const original = new File([new Uint8Array(100)], "a.jpeg", { type: "image/jpeg" });
    const small = new Blob([new Uint8Array(10)], { type: "image/jpeg" });
    assert.equal(pickSmaller(original, small).file.name, "a.jpg");
    assert.equal(pickSmaller(original, new Blob([new Uint8Array(200)], { type: "image/webp" })).converted, false);
    assert.equal(pickSmaller(original, null).file, original);
  });
});
