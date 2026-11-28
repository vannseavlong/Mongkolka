import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ENVELOPE_STAGES as S, sequenceEnd, TYPE_ORDER, typeStart, sealBadge } from "./envelope-logic";

describe("envelope storyboard", () => {
  it("runs the stages in order, each starting once the previous one has begun", () => {
    const order = [S.scene, S.envelope, S.flap, S.card, S.type, S.settle, S.banner, S.cue];
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
  it("the banner opens after the text has been read, and the cue comes after the banner has arrived", () => {
    assert.ok(S.banner.at >= S.type.at + S.type.ms + 300);
    assert.ok(S.cue.at >= S.banner.at + S.banner.ms - 600);
  });
  it("finishes within about six and a half seconds", () => {
    assert.ok(sequenceEnd() <= 6500);
    assert.ok(sequenceEnd() >= 5500);
  });
});

import { ENVELOPE_CSS } from "./envelope-styles";

describe("envelope layout css", () => {
  it("keeps every overlay out of the flex row, so the envelope stays centred", () => {
    // A static (in-flow) cue or banner would become a flex item beside the envelope and push it off-centre.
    for (const selector of [".he2-bg", ".he2-light", ".he2-grain", ".he2-vig", ".he2-banner", ".he2-cue"]) {
      const rule = new RegExp(`\\${selector}\\{[^}]*position:absolute`).test(ENVELOPE_CSS);
      assert.ok(rule, `${selector} must be position:absolute`);
    }
  });
});

describe("seal badge", () => {
  it("falls back to the initials and the automatic colors", () => {
    assert.deepEqual(sealBadge(undefined, "Vutha", "Sonita"), { text: "V&S", color: undefined, textColor: undefined });
    assert.equal(sealBadge({ sealText: "  " }, "Vutha").text, "V");
  });
  it("uses the couple's own text and only plain colors", () => {
    assert.deepEqual(sealBadge({ sealText: " វ&ស ", sealColor: "#B03A70", sealTextColor: "url(x)" }, "a", "b"), { text: "វ&ស", color: "#b03a70", textColor: undefined });
  });
});
