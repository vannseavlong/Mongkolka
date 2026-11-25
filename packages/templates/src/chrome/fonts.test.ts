import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CINZEL_FONT, KHMER_BODY_FONT, MOUL_FONT, ROUNDED_FONT } from "./fonts";

describe("font stacks", () => {
  it("every var() has a fallback, so an undefined variable cannot invalidate the whole font-family", () => {
    for (const stack of [MOUL_FONT, KHMER_BODY_FONT, CINZEL_FONT, ROUNDED_FONT]) {
      const bare = stack.match(/var\(--[a-z-]+\)/g);
      assert.equal(bare, null, `${stack} has a var() without a fallback: ${bare?.join(", ")}`);
    }
  });
  it("still end in a generic family", () => {
    for (const stack of [MOUL_FONT, KHMER_BODY_FONT, CINZEL_FONT, ROUNDED_FONT]) assert.match(stack, /(serif|sans-serif)$/);
  });
});
