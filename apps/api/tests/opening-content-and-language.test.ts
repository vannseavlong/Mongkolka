import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { LIMITS, validateSectionContent } from "../src/utils/section-content.js";
import { SECTION_TITLE_MAX, validateSectionTitle } from "../src/utils/section-title.js";
import { DEFAULT_SITE_LANGUAGE, resolveSiteLanguage, validateSiteLanguage } from "../src/utils/language.js";

describe("opening content validation", () => {
  it("keeps the wording per language, trimmed, and drops empty fields and unknown keys", () => {
    const out = validateSectionContent("opening", {
      blessingKh: "  សិរីសួស្ដី ",
      blessingEn: "Blessed",
      inviteEn: "",
      openKh: "បើក",
      junk: "dropped",
    });
    assert.deepEqual(out, { blessingKh: "សិរីសួស្ដី", blessingEn: "Blessed", openKh: "បើក" });
  });
  it("rejects non-strings, non-objects and over-long values", () => {
    assert.throws(() => validateSectionContent("opening", { openEn: 5 }), /must be a string/);
    assert.throws(() => validateSectionContent("opening", "nope"), /must be an object/);
    assert.throws(() => validateSectionContent("opening", { blessingEn: "x".repeat(LIMITS.openingBlessing + 1) }), /at most/);
    assert.throws(() => validateSectionContent("opening", { titleEn: "x".repeat(LIMITS.openingTitle + 1) }), /at most/);
  });
  it("passes null through (clearing the content)", () => {
    assert.equal(validateSectionContent("opening", null), null);
  });
});

describe("opening event details", () => {
  it("keeps names, a valid date, time and venue, trimmed", () => {
    assert.deepEqual(
      validateSectionContent("opening", { name1En: " Vutha ", name2Kh: "សុនីតា", date: "2027-01-07", time: " 5:00 PM ", venue: " Sen Sok City " }),
      { name1En: "Vutha", name2Kh: "សុនីតា", date: "2027-01-07", time: "5:00 PM", venue: "Sen Sok City" },
    );
  });
  it("rejects malformed and impossible dates", () => {
    for (const date of ["07/01/2027", "2027-1-7", "2027-02-31", "2027-13-01", "tomorrow", "2027-01-07T10:00"]) {
      assert.throws(() => validateSectionContent("opening", { date }), /YYYY-MM-DD|at most/, date);
    }
    assert.deepEqual(validateSectionContent("opening", { date: "" }), {});
  });
  it("caps name, time and venue length", () => {
    assert.throws(() => validateSectionContent("opening", { name1En: "x".repeat(LIMITS.name + 1) }), /at most/);
    assert.throws(() => validateSectionContent("opening", { time: "x".repeat(LIMITS.openingTime + 1) }), /at most/);
    assert.throws(() => validateSectionContent("opening", { venue: "x".repeat(LIMITS.openingVenue + 1) }), /at most/);
  });
});

describe("hero banners", () => {
  it("keeps portrait and landscape image links, trimmed; empty ones are dropped", () => {
    assert.deepEqual(
      validateSectionContent("hero", { portraitUrl: " https://cdn.x/p.jpg ", landscapeUrl: "", junk: 1 }),
      { portraitUrl: "https://cdn.x/p.jpg" },
    );
    assert.deepEqual(validateSectionContent("hero", { landscapeUrl: "http://localhost:4000/uploads/l.webp" }), { landscapeUrl: "http://localhost:4000/uploads/l.webp" });
  });
  it("rejects scripts, data URLs, junk and non-strings", () => {
    for (const portraitUrl of ["javascript:alert(1)", "data:image/png;base64,AAAA", "ftp://x/y.jpg", "not a url"]) {
      assert.throws(() => validateSectionContent("hero", { portraitUrl }), /image URL|https:\/\//, portraitUrl);
    }
    assert.throws(() => validateSectionContent("hero", { landscapeUrl: 5 }), /must be a string/);
    assert.throws(() => validateSectionContent("hero", "nope"), /must be an object/);
  });
});

describe("cover content", () => {
  it("keeps one trimmed line per language", () => {
    assert.deepEqual(validateSectionContent("cover", { taglineKh: " ក ", taglineEn: "", junk: 1 }), { taglineKh: "ក" });
  });
  it("rejects non-strings, non-objects and over-long lines", () => {
    assert.throws(() => validateSectionContent("cover", { taglineEn: 5 }), /must be a string/);
    assert.throws(() => validateSectionContent("cover", "x"), /must be an object/);
    assert.throws(() => validateSectionContent("cover", { taglineKh: "x".repeat(LIMITS.coverTagline + 1) }), /at most/);
  });
});

describe("story content", () => {
  it("keeps the English and Khmer story, trimmed, and drops empty ones", () => {
    assert.deepEqual(validateSectionContent("story", { loveStory: " We met ", loveStoryKh: "", junk: 1 }), { loveStory: "We met" });
    assert.deepEqual(validateSectionContent("story", { loveStoryKh: "ខ្មែរ" }), { loveStoryKh: "ខ្មែរ" });
  });
  it("rejects over-long, non-string and non-object content", () => {
    assert.throws(() => validateSectionContent("story", { loveStory: "x".repeat(LIMITS.storyText + 1) }), /at most/);
    assert.throws(() => validateSectionContent("story", { loveStoryKh: 5 }), /must be a string/);
    assert.throws(() => validateSectionContent("story", "x"), /must be an object/);
  });
});

describe("verse content", () => {
  it("keeps text, reference and meaning in both languages, trimmed", () => {
    assert.deepEqual(
      validateSectionContent("verse", { text: " Love ", textKh: "ស្រឡាញ់", reference: "Ruth 1:16", referenceKh: "រស់ ១:១៦", meaning: "", meaningKh: "អត្ថន័យ", junk: 1 }),
      { text: "Love", textKh: "ស្រឡាញ់", reference: "Ruth 1:16", referenceKh: "រស់ ១:១៦", meaningKh: "អត្ថន័យ" },
    );
  });
  it("rejects over-long, non-string and non-object content", () => {
    assert.throws(() => validateSectionContent("verse", { text: "x".repeat(LIMITS.verseText + 1) }), /at most/);
    assert.throws(() => validateSectionContent("verse", { referenceKh: "x".repeat(LIMITS.verseReference + 1) }), /at most/);
    assert.throws(() => validateSectionContent("verse", { meaning: 5 }), /must be a string/);
    assert.throws(() => validateSectionContent("verse", "x"), /must be an object/);
  });
});

describe("site language", () => {
  it("accepts only en or kh", () => {
    assert.equal(validateSiteLanguage("en"), "en");
    assert.equal(validateSiteLanguage("kh"), "kh");
    for (const bad of ["EN", "km", "", null, undefined, 3]) assert.throws(() => validateSiteLanguage(bad), /'en' or 'kh'/);
  });
  it("opens in Khmer when nothing usable is stored", () => {
    assert.equal(DEFAULT_SITE_LANGUAGE, "kh");
    for (const stored of [undefined, null, "", "fr", 1]) assert.equal(resolveSiteLanguage(stored), "kh");
    assert.equal(resolveSiteLanguage("en"), "en");
    assert.equal(resolveSiteLanguage("kh"), "kh");
  });
});

describe("section titles", () => {
  it("keeps Khmer and English headings trimmed and drops empty ones", () => {
    assert.deepEqual(validateSectionTitle({ kh: "  រឿងរ៉ាវពួកយើង ", en: "Our story" }), { kh: "រឿងរ៉ាវពួកយើង", en: "Our story" });
    assert.deepEqual(validateSectionTitle({ kh: "", en: "Gallery" }), { en: "Gallery" });
  });
  it("null or nothing left means the template's wording", () => {
    assert.equal(validateSectionTitle(null), null);
    assert.equal(validateSectionTitle({ kh: "  ", en: "" }), null);
    assert.equal(validateSectionTitle({}), null);
  });
  it("rejects non-objects, non-strings and over-long headings", () => {
    for (const bad of ["x", 5, [], undefined]) assert.throws(() => validateSectionTitle(bad), /must be an object/);
    assert.throws(() => validateSectionTitle({ kh: 5 }), /must be a string/);
    assert.throws(() => validateSectionTitle({ en: "x".repeat(SECTION_TITLE_MAX + 1) }), /at most/);
  });
});
