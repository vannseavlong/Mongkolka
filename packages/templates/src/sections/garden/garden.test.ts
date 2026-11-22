import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import type { Theme } from "../../types";
import { sectionRegistry } from "../../registry";
import { SKIN_ORNAMENTS } from "../khmer/skin-ornaments";
import { skinFromComponents } from "../khmer/skin-resolve";
import { AGENDA_ICONS } from "../../types";
import { archY, gateBars, LEAF_H, LEAF_W } from "./art/gate-geometry";
import { archGarland } from "./garland";
import { laurel } from "./laurel";
import { GATE_TIMELINE, canStart, phaseAfterTap, timelineFor, timelineVars } from "./opening-logic";
import { gardenPalette, tone } from "./palette";
import { gardenSectionBackground } from "./ornaments/section-backdrop";
import { ROSE, artToSvg } from "./art/botanical-data";
import { GARDEN_ORNAMENTS } from "./ornaments";
import { contrastRatio } from "../../theme-presets";

const theme: Theme = { bg_color: "#fdfbf7", text_color: "#3b3326", accent_color: "#8a6a2f", font_style: "serif" };

function render(section: "opening" | "hero", id: string, language: Language): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.hero, guestGreeting: "Dara", onOpen: () => undefined }),
    }),
  );
}

describe("garden gate geometry", () => {
  it("bars stay inside the leaf and rise toward the meeting edge", () => {
    const bars = gateBars(7);
    assert.equal(bars.length, 7);
    for (const b of bars) {
      assert.ok(b.x > 0 && b.x < LEAF_W);
      assert.ok(b.top < b.bottom && b.bottom < LEAF_H);
    }
    assert.ok(bars[6]!.top < bars[0]!.top, "the arch is higher at the centre line");
    assert.ok(archY(0) > archY(LEAF_W));
  });
});

describe("garden art helpers", () => {
  it("laurel puts leaves on both sides, mirrored", () => {
    const l = laurel(9, 44);
    assert.equal(l.length, 18);
    const left = l.filter((x) => x.x < 0).length;
    assert.equal(left, 9);
  });
  it("garland starts and ends at the arch feet and peaks at the crown", () => {
    const g = archGarland(17);
    assert.equal(g[0]!.x, 0);
    assert.equal(g[16]!.x, 100);
    assert.ok(Math.min(...g.map((i) => i.y)) < 1);
    assert.equal(g.filter((i) => i.kind === "rose").length, 6);
  });
  it("palette resolves tokens and literals", () => {
    const p = gardenPalette(theme);
    assert.equal(tone(p, "rose"), p.rose);
    assert.equal(tone(p, "#123456"), "#123456");
  });
  it("the same botanical data renders to an svg string", () => {
    const svg = artToSvg(ROSE, gardenPalette(theme), "translate(1 2)");
    assert.ok(svg.startsWith('<g transform="translate(1 2)">') && svg.includes("<path"));
  });
  it("section background layers vines, a hedge and glows, and encodes safely", () => {
    const bg = gardenSectionBackground(theme);
    assert.ok(String(bg.backgroundImage).split("data:image/svg+xml").length - 1 >= 3);
    assert.ok(!String(bg.backgroundImage).includes("<svg"), "svg is percent-encoded in the url()");
  });
});

describe("opening timeline", () => {
  it("accepts one tap, and opens at once with reduced motion", () => {
    assert.equal(canStart("closed"), true);
    assert.equal(canStart("opening"), false);
    assert.equal(phaseAfterTap("closed"), "opening");
    assert.equal(phaseAfterTap("opening"), "opening");
    assert.equal(timelineFor(true), null);
    assert.equal(timelineFor(false), GATE_TIMELINE);
  });
  it("hands over only after the swing, the reveal and the fade", () => {
    const t = GATE_TIMELINE;
    assert.ok(t.taglineDelayMs < t.swingMs + 500);
    assert.ok(t.fadeDelayMs + t.fadeMs <= t.totalMs);
    assert.ok(t.fadeDelayMs > t.taglineDelayMs + 1000);
    assert.equal(timelineVars(t)["--gd-swing"], `${t.swingMs}ms`);
  });
});

describe("garden skin wiring", () => {
  it("registers its own ornament set and resolves from the template defaults", () => {
    assert.equal(SKIN_ORNAMENTS.garden, GARDEN_ORNAMENTS);
    assert.equal(skinFromComponents({ opening: "opening_garden" }), "garden");
    for (const icon of AGENDA_ICONS) assert.ok(GARDEN_ORNAMENTS.icons[icon], `icon ${icon}`);
  });
  it("heading and surface adapt to a dark recolour", () => {
    const dark: Theme = { ...theme, bg_color: "#10241c", text_color: "#e8f1e6", accent_color: "#8fcf9d" };
    assert.ok(String(GARDEN_ORNAMENTS.surface(dark).boxShadow).includes("0 0 0 5px"));
    assert.ok(GARDEN_ORNAMENTS.heading(dark, "kh").fontFamily);
  });
  it("the ivory theme keeps text and accent readable", () => {
    assert.ok((contrastRatio(theme.text_color, theme.bg_color) ?? 0) >= 4.5);
    assert.ok((contrastRatio(theme.accent_color, theme.bg_color) ?? 0) >= 4.5);
  });
});

describe("garden opening and hero render", () => {
  for (const language of ["en", "kh"] as const) {
    it(`opening is a labelled region with the names, the guest and one open button (${language})`, () => {
      const html = render("opening", "opening_garden", language);
      assert.ok(html.includes("Alex") && html.includes("Dara"));
      assert.ok(html.includes('role="region"') && html.includes("data-mk-open"));
      assert.equal(html.split("<button").length - 1, 1);
      assert.ok(!html.includes("garden."), "no missing translation key");
    });
    it(`hero shows the photo, names and no raw keys (${language})`, () => {
      const html = render("hero", "hero_garden", language);
      assert.ok(html.includes("<img") && html.includes("Alex"));
      assert.ok(!html.includes("garden."));
    });
  }
  it("hero without a photo falls back to the monogram", () => {
    const Component = sectionRegistry.hero.hero_garden!;
    const html = renderToStaticMarkup(createElement(LanguageProvider, { initialLanguage: "en", children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content: {} }) }));
    assert.ok(!html.includes("<img") && html.includes("A &amp; S"));
  });
});
