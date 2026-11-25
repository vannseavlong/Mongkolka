import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { storyContentFor } from "./story-view";

describe("story view", () => {
  it("shows each language's own story", () => {
    const stored = { loveStory: "We met in 2019.", loveStoryKh: "យើងបានជួបគ្នា" };
    assert.equal(storyContentFor(undefined, stored, "en").loveStory, "We met in 2019.");
    assert.equal(storyContentFor(undefined, stored, "kh").loveStory, "យើងបានជួបគ្នា");
  });
  it("falls back to the other language, then to the profile story", () => {
    assert.equal(storyContentFor(undefined, { loveStory: "Only English" }, "kh").loveStory, "Only English");
    assert.equal(storyContentFor(undefined, { loveStoryKh: "មានតែខ្មែរ" }, "en").loveStory, "មានតែខ្មែរ");
    assert.equal(storyContentFor({ loveStory: "From the profile" }, null, "en").loveStory, "From the profile");
    assert.equal(storyContentFor({ loveStory: "From the profile" }, { loveStoryKh: "ខ្មែរ" }, "kh").loveStory, "ខ្មែរ");
    assert.equal(storyContentFor({ loveStory: "From the profile" }, { loveStoryKh: "ខ្មែរ" }, "en").loveStory, "From the profile");
  });
  it("is empty when nothing is set, ignoring blanks and bad input", () => {
    assert.equal(storyContentFor(undefined, undefined, "en").loveStory, undefined);
    assert.equal(storyContentFor("x", { loveStory: "  ", loveStoryKh: "" }, "kh").loveStory, undefined);
  });
});
