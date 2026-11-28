import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildInvitationView } from "./invitation-logic";

const view = (content: object, lang: "en" | "kh" = "en", builtIn = "No alcohol") =>
  buildInvitationView(content, { partner1Name: "A" }, lang, () => "g", () => builtIn).notice;

describe("invitation notice line", () => {
  it("prefers the couple's words, then the built-in line, and can be hidden", () => {
    assert.equal(view({}), "No alcohol");
    assert.equal(view({ noticeKh: "ខ្មែរ", noticeEn: "Mine" }), "Mine");
    assert.equal(view({ noticeEn: "Mine" }, "kh"), "Mine");
    assert.equal(view({ hideNotice: true, noticeEn: "Mine" }), "");
    assert.equal(view({}, "en", ""), "");
  });
});
