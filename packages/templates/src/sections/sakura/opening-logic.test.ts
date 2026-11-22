import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OPENING_DONE_MS, OPENING_STEPS, phaseAt, TWINKLES } from "./opening-logic";

describe("sakura opening timeline", () => {
  it("runs idle, burst, hallway, leave in order and finishes after the last step", () => {
    assert.equal(phaseAt(-1), "idle");
    assert.equal(phaseAt(0), "burst");
    assert.equal(phaseAt(1049), "burst");
    assert.equal(phaseAt(1050), "hallway");
    assert.equal(phaseAt(2449), "hallway");
    assert.equal(phaseAt(2450), "leave");
    const last = OPENING_STEPS[OPENING_STEPS.length - 1]!;
    assert.ok(OPENING_DONE_MS > last.at, "the gate fades before onOpen");
    assert.ok(OPENING_DONE_MS < 4000, "the guest is never kept waiting more than 4s");
  });
  it("steps are strictly increasing", () => {
    for (let i = 1; i < OPENING_STEPS.length; i++) assert.ok(OPENING_STEPS[i]!.at > OPENING_STEPS[i - 1]!.at);
  });
  it("twinkles stay inside the screen", () => {
    for (const t of TWINKLES) assert.ok(t.left >= 0 && t.left <= 100 && t.top >= 0 && t.top <= 100);
  });
});
