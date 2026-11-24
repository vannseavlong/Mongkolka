import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ENVELOPE_STAGES as S, sequenceEnd, TYPE_ORDER, typeStart } from "./envelope-logic";

describe("envelope storyboard", () => {
  it("runs the stages in order, each starting once the previous one has begun", () => {
    const order = [S.scene, S.envelope, S.flap, S.card, S.type, S.settle, S.cue];
    for (let i = 1; i < order.length; i++) assert.ok(order[i]!.at > order[i - 1]!.at, `stage ${i}`);
  });
  it("the envelope enters while the scene is still fading, and the flap opens after the envelope has arrived", () => {
    assert.ok(S.envelope.at < S.scene.at + S.scene.ms);
    assert.ok(S.flap.at >= S.envelope.at + S.envelope.ms);
  });
  it("the card starts rising while the flap is still opening, and the seal lets go before the flap", () => {
    assert.ok(S.card.at < S.flap.at + S.flap.ms);
    assert.ok(S.seal.at + S.seal.ms <= S.flap.at + 200);
  });
  it("text begins before the card has fully settled and reads label, names, divider, date, support", () => {
    assert.ok(S.type.at < S.card.at + S.card.ms);
    assert.deepEqual([...TYPE_ORDER], ["label", "names", "divider", "date", "support"]);
    for (let i = 1; i < TYPE_ORDER.length; i++) assert.equal(typeStart(i) - typeStart(i - 1), 150);
  });
  it("durations stay inside the brief: small 150-300, entrances 500-900, physical 700-1200", () => {
    for (const s of [S.envelope, S.type]) assert.ok(s.ms >= 500 && s.ms <= 900);
    for (const s of [S.flap, S.card]) assert.ok(s.ms >= 700 && s.ms <= 1200);
    assert.ok(S.seal.ms >= 150 && S.seal.ms <= 300);
  });
  it("finishes within about four and a half seconds", () => {
    assert.ok(sequenceEnd() <= 4700);
    assert.ok(sequenceEnd() >= 4000);
  });
});
