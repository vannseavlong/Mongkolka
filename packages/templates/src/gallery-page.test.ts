import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider } from "./i18n";
import { GalleryAllPage, GalleryMoreLink, stepPhoto } from "./gallery-page";
import { SiteRenderer, type SiteRendererSection } from "./site-renderer";
import { COVENANT_SAMPLE_COUPLE } from "./sample-content";
import type { Theme } from "./types";

const theme: Theme = { bg_color: "#fff3f6", text_color: "#4a2c35", accent_color: "#8a6418", font_style: "serif" };
const wrap = (node: unknown, language: "en" | "kh" = "en") => renderToStaticMarkup(createElement(LanguageProvider, { initialLanguage: language, children: node as never }));

describe("gallery sub-page", () => {
  it("steps through photos and wraps around", () => {
    assert.equal(stepPhoto(0, 3, 1), 1);
    assert.equal(stepPhoto(2, 3, 1), 0);
    assert.equal(stepPhoto(0, 3, -1), 2);
    assert.equal(stepPhoto(0, 0, 1), 0);
  });
  it("lists every photo with the page title and a way back", () => {
    const html = wrap(createElement(GalleryAllPage, { theme, couple: COVENANT_SAMPLE_COUPLE, photos: ["https://x/1.jpg", "https://x/2.jpg", "https://x/3.jpg"], backHref: "/demo" }));
    for (const n of [1, 2, 3]) assert.ok(html.includes(`https://x/${n}.jpg`));
    assert.ok(html.includes("Gallery") && html.includes('href="/demo"'));
  });
  it("says so when there are no photos, in the viewer's language", () => {
    assert.ok(wrap(createElement(GalleryAllPage, { theme, couple: COVENANT_SAMPLE_COUPLE, photos: [], backHref: "/" }), "kh").includes("មិនទាន់មានរូបភាព"));
  });
  it("the button reads View all photos and links to the sub-page", () => {
    const html = wrap(createElement(GalleryMoreLink, { href: "/demo/gallery", theme }));
    assert.ok(html.includes("View all photos") && html.includes('href="/demo/gallery"'));
  });
});

describe("gallery button in the site", () => {
  const template = { default_theme: theme, default_components: { gallery: "gallery_grid" } as const };
  const gallery = (photos: string[]): SiteRendererSection => ({ section_id: "g", section_key: "gallery", component_id: null, color_override: null, display_order: 0, enabled: true, content: { photos } });
  const render = (sections: SiteRendererSection[], galleryHref?: string) =>
    wrap(createElement(SiteRenderer, { template, sections, couple: COVENANT_SAMPLE_COUPLE, buildContent: () => ({}), galleryHref }));
  it("appears under a gallery that has photos when a link is given", () => {
    assert.ok(render([gallery(["https://x/1.jpg"])], "/demo/gallery").includes("View all photos"));
  });
  it("is left out with no link or no photos", () => {
    assert.ok(!render([gallery(["https://x/1.jpg"])]).includes("View all photos"));
    assert.ok(!render([gallery([])], "/demo/gallery").includes("View all photos"));
  });
});
