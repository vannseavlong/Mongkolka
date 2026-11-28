import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { deckOffset, deckPose } from "./deck";

describe("stacked carousel", () => {
  it("takes the shorter way round the loop", () => {
    assert.deepEqual([0, 1, 2, 3, 4].map((i) => deckOffset(i, 0, 5)), [0, 1, 2, -2, -1]);
    assert.equal(deckOffset(0, 4, 5), 1);
    assert.equal(deckOffset(0, 0, 0), 0);
  });

  it("puts the front card on top, neighbours smaller behind it and far cards out of sight", () => {
    assert.equal(deckPose(0).scale, 1);
    assert.ok(deckPose(1).zIndex < deckPose(0).zIndex && deckPose(1).scale < 1);
    assert.equal(deckPose(-1).x, "-22%");
    assert.equal(deckPose(3).opacity, 0);
  });
});
