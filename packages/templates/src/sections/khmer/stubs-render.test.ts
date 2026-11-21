import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import { SKIN_IDS } from "../skins";
import type { SectionKey, Theme } from "../../types";

const theme: Theme = { bg_color: "#0d2b1d", text_color: "#f3e5ab", accent_color: "#e5c07b", font_style: "serif" };

function render(section: SectionKey, id: string, language: Language, content?: unknown): string {
  const Component = sectionRegistry[section][id];
  assert.ok(Component, `${id} is not registered under ${section}`);
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content, guestGreeting: "Dara", onOpen: () => undefined }),
    }),
  );
}

describe("skin and Khmer section stubs", () => {
  for (const language of ["en", "kh"] as const) {
    it(`every skin opening and hero renders themed, non-empty markup (${language})`, () => {
      for (const skin of SKIN_IDS) {
        const opening = render("opening", `opening_${skin}`, language);
        assert.ok(opening.includes("Alex"), `opening_${skin} shows the names`);
        assert.ok(!opening.includes(`${skin}.open`), `opening_${skin} has no missing translation key`);
        assert.ok(opening.includes("Dara"), `opening_${skin} greets the guest`);
        const hero = render("hero", `hero_${skin}`, language, SAMPLE_CONTENT.hero);
        assert.ok(hero.includes("Alex") && hero.includes("<img"), `hero_${skin}`);
        assert.ok(!hero.includes(`${skin}.greeting`), `hero_${skin} has no missing translation key`);
      }
    });
  }

  it("shared Khmer sections render sample content and return nothing when empty", () => {
    for (const [section, id] of [["invitation", "invitation_khmer"], ["agenda", "agenda_khmer"], ["letters", "letters_khmer"], ["details", "details_khmer"]] as const) {
      assert.ok(render(section, id, "en", SAMPLE_CONTENT[section]).length > 50, `${id} with content`);
      assert.equal(render(section, id, "en", undefined), "", `${id} empty`);
    }
  });

  it("details only links https map URLs", () => {
    const bad = render("details", "details_khmer", "en", { ceremonyVenue: "Hall", mapUrl: "javascript:alert(1)" });
    assert.ok(!bad.includes("javascript:"));
    const good = render("details", "details_khmer", "en", { ceremonyVenue: "Hall", mapUrl: "https://maps.example.com/x" });
    assert.ok(good.includes('href="https://maps.example.com/x"'));
  });
});
