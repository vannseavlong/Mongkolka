import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { titleChanged, titleToForm, titleToPatch } from "./section-title";

describe("section title form", () => {
  it("reads missing titles as empty", () => {
    assert.deepEqual(titleToForm(undefined), { kh: "", en: "" });
    assert.deepEqual(titleToForm(null), { kh: "", en: "" });
    assert.deepEqual(titleToForm({ kh: "ក", en: null }), { kh: "ក", en: "" });
  });
  it("saves trimmed values and null when both are empty", () => {
    assert.deepEqual(titleToPatch({ kh: " កម្រងរូបភាព ", en: "" }), { kh: "កម្រងរូបភាព" });
    assert.deepEqual(titleToPatch({ kh: "a", en: " b " }), { kh: "a", en: "b" });
    assert.equal(titleToPatch({ kh: "  ", en: "" }), null);
  });
  it("knows when there is something new to save", () => {
    assert.equal(titleChanged({ kh: "ក" }, { kh: "ក ", en: "" }), false);
    assert.equal(titleChanged({ kh: "ក" }, { kh: "ខ", en: "" }), true);
    assert.equal(titleChanged(null, { kh: "", en: "" }), false);
    assert.equal(titleChanged(null, { kh: "", en: "Our photos" }), true);
  });
});
