import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { SkinProvider } from "../khmer/skin-context";
import { sectionRegistry } from "../../registry";
import { COVENANT_SAMPLE_COUPLE as COUPLE, SAMPLE_PHOTOS } from "../../sample-content";
import { defaultSectionTitle } from "../../section-titles";
import { formatWeddingDate } from "../../format";
import type { SectionKey, Theme } from "../../types";
import { initialOf, sealMonogram } from "../hero/envelope-logic";
import { activeColumn, columnRatios, homeLimit, inColumns } from "./gallery-logic";
import { guestInitial, tabFor, wallCounts } from "./wall-logic";
import { directionsUrl, letterView, mapImage, mapPlace, noteView, pickText } from "./text-logic";
import { openingTitle } from "./opening-text";

const theme: Theme = { bg_color: "#fff3f6", text_color: "#4a2c35", accent_color: "#8a6418", font_style: "serif" };

function render(section: SectionKey, id: string, language: Language, props: Record<string, unknown>): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(SkinProvider, { skin: "covenant", children: createElement(LanguageProvider, { initialLanguage: language, children: createElement(Component, { couple: COUPLE, theme, ...props }) }) }),
  );
}

describe("wedding date", () => {
  it("pads the day to two digits in both languages when asked", () => {
    assert.equal(formatWeddingDate("2027-01-07", "en", { padDay: true }), "January 07, 2027");
    assert.equal(formatWeddingDate("2027-01-07", "kh", { padDay: true }), "០៧ មករា ២០២៧");
    assert.equal(formatWeddingDate("2027-01-07", "en"), "January 7, 2027");
    assert.equal(formatWeddingDate("2027-01-17", "kh", { padDay: true }), "១៧ មករា ២០២៧");
  });
});

describe("opening title", () => {
  it("drops the built-in English title (it repeated the invitation line) but keeps the couple's own", () => {
    assert.equal(openingTitle(undefined, "en", "Invitation"), "");
    assert.equal(openingTitle({ titleEn: "You are invited" }, "en", "Invitation"), "You are invited");
    assert.equal(openingTitle(undefined, "kh", "Invitation"), "Invitation");
  });
});

describe("envelope seal", () => {
  it("shows both initials, Latin and Khmer", () => {
    assert.equal(sealMonogram("Vutha", "Sonita"), "V&S");
    assert.equal(sealMonogram("វុឌ្ឍា", "សុនីតា"), "វ&ស");
    assert.equal(sealMonogram("Vutha"), "V");
    assert.equal(sealMonogram("Vutha", "  "), "V");
    assert.equal(initialOf(undefined), "");
  });
});

describe("home page photo limit and columns", () => {
  it("uses the couple's number, whole and clamped, else the fallback", () => {
    assert.equal(homeLimit(undefined, 9), 9);
    assert.equal(homeLimit(6), 6);
    assert.equal(homeLimit("12"), 12);
    assert.equal(homeLimit(1), 3);
    assert.equal(homeLimit(99), 24);
    assert.equal(homeLimit(7.9), 7);
    assert.equal(homeLimit("abc", 8), 8);
  });
  it("groups photos in pairs and keeps neighbouring columns different", () => {
    assert.deepEqual(inColumns([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]]);
    assert.deepEqual(columnRatios(0, 2), ["3 / 4", "1 / 1"]);
    assert.deepEqual(columnRatios(1, 2), ["1 / 1", "3 / 4"]);
    assert.deepEqual(columnRatios(0, 1), ["4 / 5"]);
    assert.equal(activeColumn(300, 100, 5), 3);
    assert.equal(activeColumn(900, 100, 5), 4);
    assert.equal(activeColumn(10, 0, 5), 0);
  });
});

describe("guest wall logic", () => {
  it("names the initial, the tab and the counts", () => {
    assert.equal(guestInitial(" sokha"), "S");
    assert.equal(guestInitial("សុខា"), "ស");
    assert.equal(guestInitial(""), "♥");
    assert.equal(tabFor("photos"), "photos");
    assert.equal(tabFor("anything"), "wishes");
    const c = wallCounts({ photos: [{ photo_id: "a", url: "https://x/a.jpg" }, { photo_id: "b", url: "" }], wishes: [{ wish_id: "1", name: "A", message: "hi" }, { wish_id: "2", name: "B", message: " " }] } as never);
    assert.deepEqual(c, { wishes: 1, photos: 1 });
  });
});

describe("letters, note and map text", () => {
  it("picks the viewer's language, then the other, then the fallback", () => {
    assert.equal(pickText("ក", "a", "kh"), "ក");
    assert.equal(pickText("", "a", "kh"), "a");
    assert.equal(pickText("", " ", "en", "x"), "x");
  });
  it("falls back to the built-in apology, and the couple's own words win", () => {
    assert.deepEqual(letterView(undefined, "en", "Thanks", "Sorry").apology, ["Sorry"]);
    assert.deepEqual(letterView({ apologyEn: "Mine" }, "en", "Thanks", "Sorry").apology, ["Mine"]);
  });
  it("shows the built-in thank-you and note when nothing is written", () => {
    assert.deepEqual(letterView(undefined, "en", "Thanks").thanks, ["Thanks"]);
    const n = noteView(undefined, "en", { title: "No alcohol", body: "Please." });
    assert.equal(n.builtIn, true);
    assert.equal(n.title, "No alcohol");
    const own = noteView({ bodyEn: "Dress warm." }, "en", { title: "No alcohol", body: "Please." });
    assert.equal(own.builtIn, false);
    assert.equal(own.title, "");
    assert.deepEqual(own.body, ["Dress warm."]);
  });
  it("only lets safe map links through", () => {
    assert.equal(mapImage({ imageUrl: "https://a.b/m.png" }), "https://a.b/m.png");
    assert.equal(mapImage({ imageUrl: "http://localhost:4000/media/m.png" }), "http://localhost:4000/media/m.png");
    assert.equal(mapImage({ imageUrl: "javascript:alert(1)" }), null);
    assert.equal(mapImage({ imageUrl: "data:image/svg+xml,<svg/>" }), null);
    assert.equal(directionsUrl("https://maps.app.goo.gl/x"), "https://maps.app.goo.gl/x");
    assert.equal(directionsUrl("http://x"), null);
  });
});

describe("section title hints", () => {
  it("shows the heading the page really draws for the chosen component", () => {
    assert.equal(defaultSectionTitle("guestbook", "kh", "guestbook_skin"), "ចែករំលែកក្តីរីករាយ");
    assert.equal(defaultSectionTitle("registry", "kh", "registry_khqr"), "អំណោយចំណងដៃ");
    assert.equal(defaultSectionTitle("registry", "en", "registry_khqr"), "Wedding Gift");
  });
});

describe("new covenant sections render", () => {
  const photos = [...SAMPLE_PHOTOS, "https://x.test/4.jpg", "https://x.test/5.jpg"];
  for (const language of ["en", "kh"] as const) {
    for (const id of ["gallery_flow_covenant", "gallery_spotlight_covenant", "gallery_polaroid_covenant"]) {
      it(`${id} / ${language} caps the photos at the couple's number`, () => {
        const html = render("gallery", id, language, { content: { photos, maxPhotos: 3 } });
        assert.equal((html.match(/<img/g) ?? []).length >= 3, true);
        assert.ok(!html.includes("4.jpg"), "photo 4 stays behind show-all");
        assert.ok(html.includes("cv-lazy"));
      });
    }
    for (const id of ["video_cinema_covenant", "video_arch_covenant", "video_polaroid_covenant", "video_story_covenant"]) {
      it(`${id} / ${language} shows the poster and the play button, and nothing without a link`, () => {
        const html = render("video", id, language, { content: { url: "https://youtu.be/aqz-KE-bpKQ", title: "Our film" } });
        assert.ok(html.includes("i.ytimg.com/vi/aqz-KE-bpKQ"));
        assert.ok(html.includes("cv-play"));
        assert.ok(!html.includes("<iframe"));
        assert.equal(render("video", id, language, { content: { url: "https://evil.test/x" } }), "");
      });
    }
    for (const id of ["letters_paper_covenant", "letters_arch_covenant", "letters_script_covenant"]) {
      it(`${id} / ${language} shows the built-in thanks when empty and the couple's words when written`, () => {
        assert.ok(render("letters", id, language, {}).length > 200);
        assert.ok(render("letters", id, language, { content: { gratitudeEn: "Thank you all", gratitudeKh: "សូមអរគុណ" } }).includes(language === "en" ? "Thank you all" : "សូមអរគុណ"));
      });
    }
    for (const id of ["note_card_skin", "note_banner_skin", "note_ribbon_skin"]) {
      it(`${id} / ${language} says no alcohol by default`, () => {
        const html = render("note", id, language, {});
        assert.ok(html.includes(language === "en" ? "No alcohol" : "សូមកុំយកគ្រឿងស្រវឹង"));
        assert.ok(render("note", id, "en", { content: { bodyEn: "Bring a jacket." } }).includes("Bring a jacket."));
      });
    }
    for (const id of ["map_paper_skin", "map_postcard_skin"]) {
      it(`${id} / ${language} shows the picture and the directions button; nothing when both are missing`, () => {
        const html = render("map", id, language, { content: { imageUrl: "https://x.test/map.png" }, mapUrl: "https://maps.app.goo.gl/x" });
        assert.ok(html.includes("https://x.test/map.png"));
        assert.ok(html.includes('href="https://maps.app.goo.gl/x"'));
        assert.ok(html.indexOf('href="https://maps.app.goo.gl/x"') > html.indexOf("https://x.test/map.png"), "directions sit below the map");
        assert.equal(render("map", id, language, {}), "");
      });
    }
  }
});

describe("place line above the map", () => {
  const details = { ceremonyVenue: "Church", receptionVenue: "Hall" };

  it("names the reception first, then the ceremony, and keeps the details link", () => {
    assert.deepEqual(mapPlace(undefined, details, "https://maps.app.goo.gl/d"), { name: "Hall", href: "https://maps.app.goo.gl/d" });
    assert.equal(mapPlace(undefined, { ceremonyVenue: "Church", receptionVenue: "  " }, undefined).name, "Church");
    assert.deepEqual(mapPlace(undefined, undefined, undefined), { name: null, href: null });
  });

  it("lets the map's own name and https link win, ignoring blank or unsafe values", () => {
    const own = mapPlace({ placeName: " Garden ", mapUrl: "https://maps.app.goo.gl/m" }, details, "https://maps.app.goo.gl/d");
    assert.deepEqual(own, { name: "Garden", href: "https://maps.app.goo.gl/m" });
    const bad = mapPlace({ placeName: " ", mapUrl: "javascript:alert(1)" }, details, "https://maps.app.goo.gl/d");
    assert.deepEqual(bad, { name: "Hall", href: "https://maps.app.goo.gl/d" });
  });
});
