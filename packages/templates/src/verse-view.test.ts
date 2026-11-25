import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { verseView } from "./verse-view";

const both = { text: "Love is patient", textKh: "សេចក្តីស្រឡាញ់ អត់ធ្មត់", reference: "1 Corinthians 13:4", referenceKh: "កូរិនថូសទី១ ១៣:៤", meaning: "Love lasts", meaningKh: "ស្រឡាញ់ជានិច្ច" };

describe("verse view", () => {
  it("shows each language's own text, reference and meaning", () => {
    assert.deepEqual(verseView(both, "en"), { text: "Love is patient", reference: "1 Corinthians 13:4", meaning: "Love lasts" });
    assert.deepEqual(verseView(both, "kh"), { text: "សេចក្តីស្រឡាញ់ អត់ធ្មត់", reference: "កូរិនថូសទី១ ១៣:៤", meaning: "ស្រឡាញ់ជានិច្ច" });
  });
  it("falls back to the other language field by field", () => {
    assert.equal(verseView({ text: "Only English", reference: "Ruth 1:16" }, "kh").text, "Only English");
    assert.equal(verseView({ textKh: "មានតែខ្មែរ" }, "en").text, "មានតែខ្មែរ");
    assert.equal(verseView({ text: "x", referenceKh: "រស់ ១:១៦" }, "en").reference, "រស់ ១:១៦");
  });
  it("is empty when nothing is set, ignoring blanks", () => {
    assert.deepEqual(verseView(undefined, "en"), { text: "", reference: "", meaning: "" });
    assert.equal(verseView({ text: "   ", textKh: " " }, "kh").text, "");
  });
});
