import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { styleKey } from "./style-key";

describe("styleKey", () => {
  it("is stable for the same css and changes when the css changes", () => {
    assert.equal(styleKey("a", ".x{color:red}"), styleKey("a", ".x{color:red}"));
    assert.notEqual(styleKey("a", ".x{color:red}"), styleKey("a", ".x{color:blue}"));
  });
  it("keeps the prefix so each family stays recognisable", () => {
    assert.ok(styleKey("mk-hero-envelope-css", "x").startsWith("mk-hero-envelope-css-"));
  });
});
