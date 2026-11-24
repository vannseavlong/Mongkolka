import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { unit } from "../covenant/intro-logic";
import { BOOK_TIMING, confetti, GIFT_TIMING, nextRevealPhase } from "./reveal-logic";

describe("reveal hero phases", () => {
  it("waits, opens once on start, then finishes", () => {
    assert.equal(nextRevealPhase("idle", "start"), "opening");
    assert.equal(nextRevealPhase("idle", "finished"), "idle");
    assert.equal(nextRevealPhase("opening", "start"), "opening");
    assert.equal(nextRevealPhase("opening", "finished"), "open");
  });
  it("open is final", () => {
    assert.equal(nextRevealPhase("open", "start"), "open");
    assert.equal(nextRevealPhase("open", "finished"), "open");
  });
  it("the gift and the book wait for a tap and then plays for a few seconds", () => {
    for (const t of [GIFT_TIMING, BOOK_TIMING]) assert.ok(t.autoMs >= 3000 && t.openMs >= 3000 && t.openMs <= 6000);
  });
});

describe("confetti", () => {
  it("is deterministic and thrown upward and outward", () => {
    const a = confetti(20, unit);
    assert.deepEqual(a, confetti(20, unit));
    assert.equal(a.length, 20);
    for (const c of a) assert.ok(c.dy < 0 && c.size > 0 && c.tone >= 0 && c.tone < 4);
    assert.ok(a[0]!.dx < 0 && a[19]!.dx > 0, "a fan from left to right");
  });
  it("makes none for zero or a negative count", () => {
    assert.equal(confetti(0, unit).length, 0);
    assert.equal(confetti(-3, unit).length, 0);
  });
});
