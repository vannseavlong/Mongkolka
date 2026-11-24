import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "./i18n";
import { SiteRenderer, type SiteRendererSection, type SiteRendererTemplate } from "./site-renderer";
import { COVENANT_SAMPLE_COUPLE } from "./sample-content";
import type { SectionKey } from "./types";

const template: SiteRendererTemplate = {
  default_theme: { bg_color: "#fff3f6", text_color: "#4a2c35", accent_color: "#8a6418", font_style: "serif" },
  default_components: { cover: "cover_covenant_butterflies", opening: "opening_card_covenant", hero: "hero_covenant" },
};

const section = (key: SectionKey, order: number, enabled = true): SiteRendererSection => ({
  section_id: key,
  section_key: key,
  component_id: null,
  color_override: null,
  display_order: order,
  enabled,
});

function render(sections: SiteRendererSection[]): string {
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: "en",
      children: createElement(SiteRenderer, { template, sections, couple: COVENANT_SAMPLE_COUPLE, buildContent: () => ({}) }),
    }),
  );
}

describe("SiteRenderer cover", () => {
  it("first paint is the cover only: the opening gate is not mounted under it yet", () => {
    const html = render([section("cover", 0), section("opening", 1), section("hero", 2)]);
    assert.ok(html.includes("data-mk-cover"));
    assert.ok(!html.includes("cv-card"));
  });
  it("a disabled cover leaves today's behaviour: the opening gate shows straight away", () => {
    const html = render([section("cover", 0, false), section("opening", 1), section("hero", 2)]);
    assert.ok(!html.includes("data-mk-cover"));
    assert.ok(html.includes("cv-card"));
  });
  it("no cover row at all behaves as before", () => {
    const html = render([section("opening", 0), section("hero", 1)]);
    assert.ok(!html.includes("data-mk-cover"));
  });
});
