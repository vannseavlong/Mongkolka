import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { monogramOf, pickLang, safeHttpsUrl } from "./skin-logic";

describe("skin-logic", () => {
  it("pickLang prefers the viewer's language and falls back", () => {
    assert.equal(pickLang("kh", "សួស្តី", "Hello"), "សួស្តី");
    assert.equal(pickLang("kh", "", "Hello"), "Hello");
    assert.equal(pickLang("en", "សួស្តី", "Hello"), "Hello");
    assert.equal(pickLang("en", "សួស្តី", undefined), "សួស្តី");
    assert.equal(pickLang("en"), "");
  });
  it("monogramOf uses initials and handles missing names", () => {
    assert.equal(monogramOf({ partner1Name: "sokha", partner2Name: "Dara" }), "S & D");
    assert.equal(monogramOf({ partner1Name: "Sokha" }), "S");
    assert.equal(monogramOf({ partner1Name: "" }), "&");
  });
  it("safeHttpsUrl only accepts https", () => {
    assert.equal(safeHttpsUrl("https://maps.google.com/?q=1"), "https://maps.google.com/?q=1");
    assert.equal(safeHttpsUrl("http://x.com"), null);
    assert.equal(safeHttpsUrl("javascript:alert(1)"), null);
    assert.equal(safeHttpsUrl(undefined), null);
  });
});
