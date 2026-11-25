import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, TextOverridesProvider, useLanguage, type Language } from "./i18n";
import { defaultSectionTitle, hasSectionTitle, SECTION_TITLE_KEYS, titleOverrides } from "./section-titles";

const section = (key: "story" | "gallery" | "hero", enabled: boolean, title?: { kh?: string; en?: string } | null) => ({ section_key: key, enabled, title });

describe("section title overrides", () => {
  it("maps a typed title onto every dictionary key the section's heading can come from", () => {
    const out = titleOverrides([section("gallery", true, { kh: "កម្រងរូបភាព", en: "Our photos" })]);
    for (const key of SECTION_TITLE_KEYS.gallery!) assert.deepEqual(out[key], { kh: "កម្រងរូបភាព", en: "Our photos" }, key);
  });
  it("ignores empty titles, hidden sections and sections without a heading", () => {
    assert.deepEqual(titleOverrides([section("story", true, { kh: " ", en: "" }), section("story", true, null), section("gallery", false, { en: "x" }), section("hero", true, { en: "x" })]), {});
  });
  it("keeps one language when only one is typed", () => {
    assert.deepEqual(titleOverrides([section("story", true, { en: "Our journey" })])["section.story.heading"], { en: "Our journey" });
  });
  it("knows which sections have a heading and what the built-in one is", () => {
    assert.equal(hasSectionTitle("gallery"), true);
    assert.equal(hasSectionTitle("hero"), false);
    assert.equal(defaultSectionTitle("story", "kh"), "រឿងរ៉ាវពួកយើង");
    assert.equal(defaultSectionTitle("gallery", "kh"), "កម្រងរូបភាព");
    assert.equal(defaultSectionTitle("hero", "en"), "");
  });
});

function Probe({ k }: { k: "section.gallery.heading" }) {
  return createElement("span", null, useLanguage().t(k));
}
const render = (language: Language, overrides?: Record<string, { en?: string; kh?: string }>) =>
  renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: overrides
        ? createElement(TextOverridesProvider, { overrides, children: createElement(Probe, { k: "section.gallery.heading" }) })
        : createElement(Probe, { k: "section.gallery.heading" }),
    }),
  );

describe("overridden wording", () => {
  it("uses the couple's text for the viewer's language and the built-in text otherwise", () => {
    const overrides = { "section.gallery.heading": { en: "Our photos" } };
    assert.ok(render("en", overrides).includes("Our photos"));
    assert.ok(render("kh", overrides).includes("កម្រងរូបភាព"), "no Khmer title typed, so the built-in Khmer is kept");
    assert.ok(render("en").includes("Gallery"));
  });
});
