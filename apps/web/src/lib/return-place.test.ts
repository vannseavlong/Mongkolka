import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { RETURN_MAX_AGE_MS, shouldRestore } from "./return-place.ts";

const place = (over: Partial<{ y: number; at: number; returning: boolean }> = {}) => ({ y: 1800, at: 1_000_000, returning: false, ...over });

describe("coming back to the invitation", () => {
  it("restores after the page's own back link, or the browser's back button", () => {
    assert.equal(shouldRestore(place({ returning: true }), "navigate", 1_000_500), true);
    assert.equal(shouldRestore(place(), "back_forward", 1_000_500), true);
  });
  it("a fresh visit or a reload starts from the cover", () => {
    assert.equal(shouldRestore(place(), "navigate", 1_000_500), false);
    assert.equal(shouldRestore(place(), "reload", 1_000_500), false);
    assert.equal(shouldRestore(place(), undefined, 1_000_500), false);
  });
  it("nothing saved, or saved too long ago, or from the future, never restores", () => {
    assert.equal(shouldRestore(null, "back_forward", 1_000_500), false);
    assert.equal(shouldRestore(place({ returning: true }), "navigate", 1_000_000 + RETURN_MAX_AGE_MS + 1), false);
    assert.equal(shouldRestore(place({ returning: true }), "navigate", 999_000), false);
  });
});
