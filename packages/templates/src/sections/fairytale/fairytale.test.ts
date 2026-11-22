import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import { AGENDA_ICONS, type Theme } from "../../types";
import { contrastRatio } from "../../theme-presets";
import { SKIN_ORNAMENTS } from "../khmer/skin-ornaments";
import { FAIRYTALE_ORNAMENTS } from "./ornaments";
import { cleanPhotos, gridClasses } from "./gallery-logic";
import { PINK, bloomsFor, clusterPoints, fairytalePalette, openingTimeline, polaroidTilt, seeded, stickerFor } from "./fairytale-logic";

const theme: Theme = { bg_color: "#bfd7ea", text_color: "#1c2d5a", accent_color: "#2f4b8a", font_style: "serif" };

function render(section: "opening" | "hero" | "gallery", id: string, language: Language, extra: Record<string, unknown> = {}): string {
  const Component = sectionRegistry[section][id];
  assert.ok(Component, `${id} registered`);
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(Component, { couple: SAMPLE_COUPLE, theme, guestGreeting: "Dara", onOpen: () => undefined, ...extra }),
    }),
  );
}

describe("fairytale logic", () => {
  it("clusterPoints is deterministic, bounded and has the requested count", () => {
    const a = clusterPoints(15, 20, 7, 5);
    const b = clusterPoints(15, 20, 7, 5);
    assert.deepEqual(a, b);
    assert.equal(a.length, 15);
    for (const p of a) {
      assert.ok(Math.hypot(p.x, p.y) <= 20 + 0.01, "inside the radius");
      assert.ok(p.tint >= 0 && p.tint < 5);
      assert.ok(p.r > 0);
    }
    assert.notDeepEqual(a, clusterPoints(15, 20, 8, 5));
    assert.equal(clusterPoints(0, 10, 1, 3).length, 1, "at least one floret");
  });

  it("seeded() repeats and stays in [0,1)", () => {
    const r1 = seeded(42);
    const r2 = seeded(42);
    for (let i = 0; i < 20; i++) {
      const v = r1();
      assert.equal(v, r2());
      assert.ok(v >= 0 && v < 1);
    }
  });

  it("polaroidTilt alternates sides and stays between 1.5 and 4.5 degrees", () => {
    for (let i = 0; i < 12; i++) {
      const t = polaroidTilt(i);
      assert.ok(Math.abs(t) >= 1.5 && Math.abs(t) <= 4.5);
      assert.equal(Math.sign(t), i % 2 === 0 ? -1 : 1);
    }
  });

  it("stickerFor cycles through every kind and corner", () => {
    const kinds = new Set(Array.from({ length: 6 }, (_, i) => stickerFor(i).kind));
    assert.equal(kinds.size, 3);
    const corners = new Set(Array.from({ length: 8 }, (_, i) => stickerFor(i).corner));
    assert.equal(corners.size, 4);
  });

  it("openingTimeline: reduced motion skips the swing and zoom", () => {
    const r = openingTimeline(true);
    assert.equal(r.coverMs, 0);
    assert.equal(r.zoomMs, 0);
    assert.ok(r.doneMs <= 500);
    const f = openingTimeline(false);
    assert.ok(f.zoomAtMs >= f.coverMs / 2 && f.doneMs >= f.zoomAtMs + f.zoomMs, "hand-over after the zoom ends");
  });

  it("palette derives from the theme and includes a pink bloom", () => {
    const p = fairytalePalette(theme);
    assert.equal(p.royal, theme.accent_color);
    assert.ok(p.blooms.includes(PINK));
    assert.equal(bloomsFor("#2f4b8a", "#bfd7ea").length, p.blooms.length);
  });

  it("the seeded colours keep 4.5:1 for text and accent on the sky ground", () => {
    assert.ok((contrastRatio(theme.text_color, theme.bg_color) ?? 0) >= 4.5);
    assert.ok((contrastRatio(theme.accent_color, theme.bg_color) ?? 0) >= 4.5);
  });

  it("cleanPhotos trims, de-duplicates and drops non-strings", () => {
    assert.deepEqual(cleanPhotos([" a ", "a", "", 3, null, "b"]), ["a", "b"]);
    assert.deepEqual(cleanPhotos(undefined), []);
    assert.deepEqual(cleanPhotos("nope"), []);
    assert.equal(gridClasses(1).cols, "grid-cols-1");
    assert.equal(gridClasses(5).cols, "grid-cols-2 sm:grid-cols-3");
  });
});

describe("fairytale skin registration", () => {
  it("registers its own ornaments, with all nine ritual icons", () => {
    assert.equal(SKIN_ORNAMENTS.fairytale, FAIRYTALE_ORNAMENTS);
    for (const icon of AGENDA_ICONS) assert.ok(FAIRYTALE_ORNAMENTS.icons[icon], `icon ${icon}`);
    assert.ok(FAIRYTALE_ORNAMENTS.Backdrop, "has scene art");
    assert.notEqual(SKIN_ORNAMENTS.emerald, FAIRYTALE_ORNAMENTS, "other skins keep their own set");
  });

  it("registers opening, hero and gallery ids", () => {
    for (const [section, id] of [["opening", "opening_fairytale"], ["hero", "hero_fairytale"], ["gallery", "gallery_fairytale"]] as const) {
      assert.ok(sectionRegistry[section][id], id);
    }
  });
});

describe("fairytale components render", () => {
  for (const language of ["en", "kh"] as const) {
    it(`opening: names, guest greeting, button, castle, no missing keys (${language})`, () => {
      const html = render("opening", "opening_fairytale", language);
      assert.ok(html.includes("Alex") && html.includes("Sam") && html.includes("Dara"));
      assert.ok(html.includes("data-mk-open"), "primes the music on tap");
      assert.ok(html.includes("<button"), "keyboard-operable button");
      assert.ok(!html.includes("fairytale."), "no raw translation key");
    });
    it(`hero: photo or palace fallback, names (${language})`, () => {
      const withPhoto = render("hero", "hero_fairytale", language, { content: SAMPLE_CONTENT.hero });
      assert.ok(withPhoto.includes("Alex") && withPhoto.includes("<img"));
      const without = render("hero", "hero_fairytale", language, { content: {} });
      assert.ok(without.includes("Alex") && !without.includes("<img"), "palace instead of a photo");
      assert.ok(!without.includes("fairytale."));
    });
    it(`gallery: polaroids, and nothing when empty (${language})`, () => {
      const html = render("gallery", "gallery_fairytale", language, { content: SAMPLE_CONTENT.gallery });
      assert.equal((html.match(/<img/g) ?? []).length, 3);
      assert.ok(html.includes("aria-haspopup"));
      assert.equal(render("gallery", "gallery_fairytale", language, { content: { photos: [] } }), "");
      assert.equal(render("gallery", "gallery_fairytale", language, { content: undefined }), "");
    });
  }
});
