import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { COVER_TIMING, COVER_TIMING_REDUCED, coverTiming, nextCoverPhase } from "./cover-phase";

describe("cover phases", () => {
  it("plays, then reveals on the timer or a tap", () => {
    assert.equal(nextCoverPhase("play", "tick"), "reveal");
    assert.equal(nextCoverPhase("play", "tap"), "reveal");
    assert.equal(nextCoverPhase("play", "finished"), "play");
  });
  it("only the reveal timer finishes the reveal; a tap during it does nothing", () => {
    assert.equal(nextCoverPhase("reveal", "tap"), "reveal");
    assert.equal(nextCoverPhase("reveal", "tick"), "reveal");
    assert.equal(nextCoverPhase("reveal", "finished"), "done");
  });
  it("done is final", () => {
    for (const e of ["tick", "tap", "finished"] as const) assert.equal(nextCoverPhase("done", e), "done");
  });
  it("reduced motion is shorter and still advances by itself", () => {
    assert.equal(coverTiming(true), COVER_TIMING_REDUCED);
    assert.equal(coverTiming(false), COVER_TIMING);
    assert.ok(COVER_TIMING_REDUCED.playMs > 0 && COVER_TIMING_REDUCED.revealMs < COVER_TIMING.revealMs);
  });
});
