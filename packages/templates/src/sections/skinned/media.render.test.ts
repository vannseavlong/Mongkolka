import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import { SAMPLE_COUPLE, SAMPLE_GUESTBOOK, SAMPLE_PHOTOS } from "../../sample-content";
import type { Theme } from "../../types";
import type { SkinId } from "../skins";
import { SkinProvider } from "../khmer/skin-context";
import { SKIN_ORNAMENTS } from "../khmer/skin-ornaments";

/** Each skin with its template's default theme and a marker that only its own frame draws. */
const SKINS: Array<{ skin: SkinId; theme: Theme; marker: string }> = [
  { skin: "emerald", theme: { bg_color: "#0d2b1d", text_color: "#f3e5ab", accent_color: "#d4af37", font_style: "serif" }, marker: "rotate(45deg)" },
  { skin: "garden", theme: { bg_color: "#fdfbf7", text_color: "#4a3b32", accent_color: "#8a6a2f", font_style: "serif" }, marker: "rounded-t-[999px]" },
  { skin: "cream", theme: { bg_color: "#f8f1e4", text_color: "#4a3a22", accent_color: "#886420", font_style: "serif" }, marker: "rounded-[50%]" },
  { skin: "sakura", theme: { bg_color: "#f7d6e0", text_color: "#4a1f35", accent_color: "#b01553", font_style: "serif" }, marker: "rounded-[22px]" },
  { skin: "fairytale", theme: { bg_color: "#bfd7ea", text_color: "#1c2d5a", accent_color: "#2f4b8a", font_style: "serif" }, marker: "♡ ♡ ♡" },
  { skin: "kids", theme: { bg_color: "#fff8f0", text_color: "#5a1a33", accent_color: "#c82a62", font_style: "sans" }, marker: "♥" },
  { skin: "covenant", theme: { bg_color: "#fff3f6", text_color: "#4a2c35", accent_color: "#8a6418", font_style: "serif" }, marker: "999px 999px 16px 16px" },
];

function render(id: "gallery" | "guestbook", skin: SkinId, theme: Theme, language: Language, extra: Record<string, unknown> = {}): string {
  const Component = sectionRegistry[id][`${id}_skin`]!;
  const props = id === "gallery"
    ? { couple: SAMPLE_COUPLE, theme, content: { photos: SAMPLE_PHOTOS }, ...extra }
    : { couple: SAMPLE_COUPLE, theme, guestbook: SAMPLE_GUESTBOOK, onSubmit: async () => ({ status: "pending" as const }), ...extra };
  return renderToStaticMarkup(
    createElement(LanguageProvider, { initialLanguage: language, children: createElement(SkinProvider, { skin, children: createElement(Component, props) }) }),
  );
}

describe("gallery_skin and guestbook_skin are registered", () => {
  it("under their own section keys", () => {
    assert.ok(sectionRegistry.gallery.gallery_skin);
    assert.ok(sectionRegistry.guestbook.guestbook_skin);
  });
  it("every skin supplies its own media set", () => {
    for (const { skin } of SKINS) assert.ok(SKIN_ORNAMENTS[skin].media, `${skin} has no media`);
  });
});

describe("gallery_skin", () => {
  for (const { skin, theme, marker } of SKINS) {
    for (const language of ["en", "kh"] as const) {
      it(`${skin} (${language}): a labelled button and an image per photo, in the skin's own frame`, () => {
        const html = render("gallery", skin, theme, language);
        assert.equal((html.match(/<button/g) ?? []).length, SAMPLE_PHOTOS.length);
        assert.equal((html.match(/<img/g) ?? []).length, SAMPLE_PHOTOS.length);
        assert.ok(html.includes('aria-haspopup="dialog"'));
        assert.ok(html.includes('id="gallery"'));
        assert.ok(html.includes(marker), `${skin} frame marker missing`);
        assert.ok(!html.includes("undefined"));
      });
    }
  }
  it("each skin draws a different frame (no two look the same)", () => {
    const frames = SKINS.map(({ skin, theme }) => {
      const html = render("gallery", skin, theme, "en");
      return html.slice(html.indexOf("<button"), html.indexOf("</button>"));
    });
    assert.equal(new Set(frames).size, SKINS.length);
  });
  it("renders nothing without photos", () => {
    const html = render("gallery", "emerald", SKINS[0]!.theme, "en", { content: { photos: [] } });
    assert.equal(html, "");
  });
  it("never renders the Grace cross", () => {
    for (const { skin, theme } of SKINS) assert.ok(!/M12 2v20|cross/i.test(render("gallery", skin, theme, "en")));
  });
});

describe("guestbook_skin", () => {
  for (const { skin, theme } of SKINS) {
    for (const language of ["en", "kh"] as const) {
      it(`${skin} (${language}): form fields, wall and actions`, () => {
        const html = render("guestbook", skin, theme, language);
        for (const id of ["sk-gb-name", "sk-gb-wish", "sk-gb-file"]) assert.ok(html.includes(`id="${id}"`), `${id} missing`);
        assert.ok(html.includes('type="submit"'));
        assert.ok(html.includes('id="guestbook"'));
        // every approved photo from the sample wall is on the page, and so is a wish
        assert.equal((html.match(/<img/g) ?? []).length, SAMPLE_GUESTBOOK.photos.length);
        assert.ok(html.includes(SAMPLE_GUESTBOOK.wishes[0]!.name));
        assert.ok(html.includes("min-h-12"), "action buttons are at least 48px tall");
        assert.ok(!html.includes("undefined"));
      });
    }
  }
  it("shows a friendly empty note when nobody has shared yet", () => {
    const html = render("guestbook", "kids", SKINS[5]!.theme, "en", { guestbook: { photos: [], wishes: [] } });
    assert.ok(html.includes("Be the first to share a moment."));
    assert.equal((html.match(/<img/g) ?? []).length, 0);
  });
  it("shows directions when the couple has a maps link", () => {
    const html = render("guestbook", "garden", SKINS[1]!.theme, "en", { actions: { mapsUrl: "https://maps.example/x" } });
    assert.ok(html.includes("Get directions"));
  });
});
