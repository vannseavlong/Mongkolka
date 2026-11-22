import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import { AGENDA_ICONS, type Theme } from "../../types";
import { SKIN_ORNAMENTS, ornamentsFor, DEFAULT_ORNAMENTS } from "../khmer";
import { SkinProvider } from "../khmer/skin-context";
import { Skyline, skylinePath } from "./art/Backdrop";
import { EMERALD_ORNAMENTS } from "./ornaments";
import { FULL_TIMELINE, REDUCED_TIMELINE, gildedMotes, nextPhase, sparkBurst, timelineFor, unit } from "./opening-logic";
import { emeraldPalette, latticeDataUri, starPoints } from "./palette";
import { strings } from "./strings";

const theme: Theme = { bg_color: "#0d2b1d", text_color: "#f3e5ab", accent_color: "#e5c07b", font_style: "serif" };

function render(section: "opening" | "hero" | "invitation", id: string, language: Language, content?: unknown): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content, guestGreeting: "Dara", onOpen: () => undefined }),
    }),
  );
}

describe("emerald palette and maths", () => {
  it("derives a deeper ground and a lifted face from the theme", () => {
    const p = emeraldPalette(theme);
    assert.equal(p.ground, "#0d2b1d");
    assert.notEqual(p.deep, p.ground);
    assert.ok(p.gold.hi !== p.gold.lo);
  });
  it("starPoints returns 2n points", () => {
    assert.equal(starPoints(100, 100, 50, 30, 8).split(" ").length, 16);
    assert.equal(starPoints(0, 0, 10, 5, 4).split(" ")[0], "0.00,-10.00");
  });
  it("latticeDataUri is a css url with the accent encoded and alpha clamped", () => {
    const u = latticeDataUri("#e5c07b", 9);
    assert.ok(u.startsWith('url("data:image/svg+xml,'));
    assert.ok(u.includes(encodeURIComponent("#e5c07b")));
    assert.ok(u.includes(encodeURIComponent("stroke-opacity='1'")));
  });
  it("skyline path is closed and starts at the baseline", () => {
    const d = skylinePath();
    assert.ok(d.startsWith("M0 80") && d.endsWith("Z"));
    assert.ok(renderToStaticMarkup(createElement(Skyline, { color: "#e5c07b", deep: "#081c13" })).includes("<path"));
  });
});

describe("opening logic", () => {
  it("only a tap leaves closed, and finished only leaves opening", () => {
    assert.equal(nextPhase("closed", "tap"), "opening");
    assert.equal(nextPhase("closed", "finished"), "closed");
    assert.equal(nextPhase("opening", "tap"), "opening");
    assert.equal(nextPhase("opening", "finished"), "done");
    assert.equal(nextPhase("done", "tap"), "done");
  });
  it("reduced motion shortens the timeline", () => {
    assert.equal(timelineFor(false), FULL_TIMELINE);
    assert.equal(timelineFor(true), REDUCED_TIMELINE);
    assert.ok(REDUCED_TIMELINE.totalMs < FULL_TIMELINE.totalMs && REDUCED_TIMELINE.doorsMs === 0);
  });
  it("motes and sparks are deterministic and bounded", () => {
    assert.deepEqual(gildedMotes(10), gildedMotes(10));
    assert.equal(gildedMotes(-3).length, 0);
    for (const m of gildedMotes(30)) assert.ok(m.x >= 0 && m.x <= 100 && m.size >= 2 && m.duration >= 7);
    assert.equal(sparkBurst(12, 100).length, 12);
    for (let i = 0; i < 50; i++) assert.ok(unit(i) >= 0 && unit(i) < 1);
  });
});

describe("emerald skin", () => {
  it("registers its own ornament set and leaves the other skins on the default", () => {
    assert.equal(ornamentsFor("emerald"), EMERALD_ORNAMENTS);
    assert.equal(SKIN_ORNAMENTS.emerald.id, "emerald");
    assert.equal(SKIN_ORNAMENTS.garden, DEFAULT_ORNAMENTS);
  });
  it("ornament set is complete: nine ritual icons, surface, heading, backdrop", () => {
    for (const icon of AGENDA_ICONS) assert.equal(typeof EMERALD_ORNAMENTS.icons[icon], "function", icon);
    assert.ok(EMERALD_ORNAMENTS.surface(theme).border);
    assert.equal(EMERALD_ORNAMENTS.heading(theme, "kh").WebkitTextFillColor, "transparent");
    assert.ok(String(EMERALD_ORNAMENTS.sectionBackground?.(theme).backgroundImage).includes("data:image/svg+xml"));
  });
  it("strings have the same keys in both languages", () => {
    assert.deepEqual(Object.keys(strings.en).sort(), Object.keys(strings.kh).sort());
  });
  for (const language of ["en", "kh"] as const) {
    it(`opening renders doors, medallion, guest and a keyboard-operable button (${language})`, () => {
      const html = render("opening", "opening_emerald", language);
      assert.ok(html.includes("em-door-l") && html.includes("em-door-r") && html.includes("em-gate"));
      assert.ok(html.includes("<button") && html.includes('type="button"'));
      assert.ok(html.includes(strings[language]["emerald.open"]));
      assert.ok(html.includes("Dara") && html.includes("Alex"));
      assert.ok(!html.includes("emerald.open") && !html.includes("khmer.dear"));
      assert.ok(html.includes("prefers-reduced-motion"));
    });
    it(`hero renders the arch frame with and without a photo (${language})`, () => {
      const withPhoto = render("hero", "hero_emerald", language, SAMPLE_CONTENT.hero);
      assert.ok(withPhoto.includes("<img") && withPhoto.includes("clipPath"));
      const without = render("hero", "hero_emerald", language, undefined);
      assert.ok(!without.includes("<img") && without.includes("em-spin"));
      assert.ok(!without.includes("emerald.greeting"));
    });
  }
  it("shared invitation section picks up the emerald backdrop through the skin provider", () => {
    const Component = sectionRegistry.invitation.invitation_khmer!;
    const html = renderToStaticMarkup(
      createElement(LanguageProvider, {
        initialLanguage: "en",
        children: createElement(SkinProvider, {
          skin: "emerald",
          children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.invitation }),
        }),
      }),
    );
    assert.ok(html.includes("data:image/svg+xml"));
    const plain = renderToStaticMarkup(
      createElement(LanguageProvider, {
        initialLanguage: "en",
        children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.invitation }),
      }),
    );
    assert.ok(!plain.includes("data:image/svg+xml"));
  });
});

describe("arch clip", () => {
  it("archPolygon is a closed polygon inside the box with the apex near the top centre", async () => {
    const { archPolygon } = await import("./opening-logic");
    const poly = archPolygon(10);
    assert.ok(poly.startsWith("polygon(0.00% 100.00%,0.00% 27.50%"));
    assert.ok(poly.endsWith("100.00% 100.00%)"));
    const nums = [...poly.matchAll(/([\d.]+)% ([\d.]+)%/g)].map((m) => [Number(m[1]), Number(m[2])] as const);
    assert.ok(nums.every(([x, y]) => x >= 0 && x <= 100 && y >= 0 && y <= 100));
    assert.equal(Math.min(...nums.map(([, y]) => y)), 1.56);
  });
});

describe("hasKhmer", () => {
  it("detects Khmer script only", async () => {
    const { hasKhmer } = await import("./opening-logic");
    assert.equal(hasKhmer("Chantha & Chhary"), false);
    assert.equal(hasKhmer("ចន្ថា & ឆារី"), true);
    assert.equal(hasKhmer(""), false);
  });
});
