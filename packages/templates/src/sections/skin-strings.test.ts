import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { SKIN_EN, SKIN_KH, skinKeyMismatches } from "./skin-strings";
import { SKIN_IDS } from "./skins";

describe("skin strings", () => {
  it("en and kh keys match", () => assert.deepEqual(skinKeyMismatches(), []));
  it("every skin has greeting, open and tagline in both languages", () => {
    for (const id of SKIN_IDS) {
      for (const key of ["greeting", "open", "tagline"]) {
        assert.ok(SKIN_EN[`${id}.${key}`], `en ${id}.${key}`);
        assert.ok(SKIN_KH[`${id}.${key}`], `kh ${id}.${key}`);
      }
    }
  });
});
