import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { SkinProvider } from "../khmer/skin-context";
import { sectionRegistry } from "../../registry";
import { SAMPLE_COUPLE, SAMPLE_CONTENT, SAMPLE_GUESTBOOK } from "../../sample-content";
import type { SectionKey, Theme } from "../../types";
import { guestLine, hasKhmer, petals } from "./intro-logic";
import { memoriesView, subRoute } from "./memories-logic";
import { nextHeroPhase, usablePhoto } from "./hero-logic";
import { youtubeId } from "./video-logic";

const theme: Theme = { bg_color: "#fff3f6", text_color: "#4a2c35", accent_color: "#8a6418", font_style: "serif" };

function render(section: SectionKey, id: string, language: Language, props: Record<string, unknown>): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(SkinProvider, { skin: "covenant", children: createElement(LanguageProvider, { initialLanguage: language, children: createElement(Component, { couple: SAMPLE_COUPLE, theme, ...props }) }) }),
  );
}

describe("covenant guest line", () => {
  it("adds the spouse text to a single name and leaves groups alone", () => {
    assert.equal(guestLine("សុខា", "និងភរិយា"), "សុខា និងភរិយា");
    assert.equal(guestLine("  Sokha  ", "and spouse"), "Sokha and spouse");
    assert.equal(guestLine("Sokha & Dara", "and spouse"), "Sokha & Dara");
    assert.equal(guestLine("Sokha and Dara", "and spouse"), "Sokha and Dara");
    assert.equal(guestLine("Sokha, Dara", "and spouse"), "Sokha, Dara");
    assert.equal(guestLine("សុខា និង ដារ៉ា", "និងភរិយា"), "សុខា និង ដារ៉ា");
    assert.equal(guestLine(undefined, "x"), "");
    assert.equal(guestLine("   ", "x"), "");
  });
  it("detects Khmer text", () => {
    assert.ok(hasKhmer("វត្ថា"));
    assert.ok(!hasKhmer("Vatha"));
  });
  it("petals are deterministic", () => {
    assert.deepEqual(petals(5), petals(5));
    assert.equal(petals(-1).length, 0);
  });
});

describe("covenant video link", () => {
  it("takes only a valid 11-character id from YouTube links", () => {
    const id = "aqz-KE-bpKQ";
    for (const u of [`https://www.youtube.com/watch?v=${id}&t=3`, `https://youtu.be/${id}?si=x`, `https://www.youtube.com/embed/${id}`, `https://youtube.com/shorts/${id}`, `https://m.youtube.com/watch?v=${id}`, `https://www.youtube-nocookie.com/embed/${id}`]) {
      assert.equal(youtubeId(u), id, u);
    }
  });
  it("rejects other hosts, schemes and malformed ids", () => {
    for (const u of ["https://evil.com/watch?v=aqz-KE-bpKQ", "javascript:alert(1)", "https://youtube.com/watch?v=short", 'https://youtu.be/aqz-KE-bpKQ"onload="x', "", "not a url", "https://youtube.com.evil.com/watch?v=aqz-KE-bpKQ"]) {
      assert.equal(youtubeId(u), null, u);
    }
    assert.equal(youtubeId(undefined), null);
  });
});

describe("covenant hero photo", () => {
  it("only https or site-relative photos load", () => {
    assert.equal(usablePhoto("https://x.test/a.jpg"), "https://x.test/a.jpg");
    assert.equal(usablePhoto("/a.jpg"), "/a.jpg");
    assert.equal(usablePhoto("//evil.test/a.jpg"), null);
    assert.equal(usablePhoto("http://x.test/a.jpg"), null);
    assert.equal(usablePhoto("javascript:1"), null);
    assert.equal(usablePhoto(" "), null);
  });
  it("reveals at once without a photo, waits otherwise", () => {
    assert.equal(nextHeroPhase(null, "mount"), "reveal");
    assert.equal(nextHeroPhase("https://x.test/a.jpg", "mount"), "loading");
    for (const e of ["loaded", "failed", "timeout"] as const) assert.equal(nextHeroPhase("https://x.test/a.jpg", e), "reveal");
  });
});

describe("covenant memories", () => {
  it("keeps the latest few and says when there is more", () => {
    const v = memoriesView(SAMPLE_GUESTBOOK, 4, 2);
    assert.equal(v.photos.length, 4);
    assert.equal(v.wishes.length, 2);
    assert.ok(v.hasMorePhotos && v.hasMoreWishes);
    assert.equal(v.photos[0]!.photo_id, SAMPLE_GUESTBOOK.photos[0]!.photo_id);
    const none = memoriesView(undefined);
    assert.equal(none.photoTotal, 0);
    assert.ok(!none.hasMorePhotos);
  });
  it("builds an encoded sub-route", () => {
    assert.equal(subRoute("sokha-dara", "wishes"), "/sokha-dara/wishes");
    assert.equal(subRoute("a b", "photos"), "/a%20b/photos");
    assert.equal(subRoute("", "photos"), null);
  });
});

describe("covenant sections render", () => {
  for (const language of ["en", "kh"] as const) {
    it(`opening, hero, verse, video, memories (${language})`, () => {
      const open = render("opening", "opening_covenant", language, { guestGreeting: "Dara", onOpen: () => undefined });
      assert.ok(open.includes("Alex") && open.includes("Dara"));
      assert.ok(!open.includes("covenant."), "no missing translation key");
      assert.ok(render("hero", "hero_covenant", language, { content: SAMPLE_CONTENT.hero }).includes("Alex"));
      assert.ok(render("verse", "verse_covenant", language, { content: SAMPLE_CONTENT.verse }).includes("Genesis 2:24"));
      assert.equal(render("verse", "verse_covenant", language, {}), "");
      const video = render("video", "video_skin", language, { content: SAMPLE_CONTENT.video });
      assert.ok(video.includes("i.ytimg.com") && !video.includes("<iframe"), "thumbnail first, no iframe before the tap");
      assert.equal(render("video", "video_skin", language, { content: { url: "https://evil.com/x" } }), "");
      const mem = render("guestbook", "guestbook_covenant", language, { guestbook: SAMPLE_GUESTBOOK, photosHref: "/s/photos", wishesHref: "/s/wishes" });
      assert.ok(mem.includes('href="/s/photos"') && mem.includes('href="/s/wishes"'));
      assert.ok(!mem.includes("covenant."), "no missing translation key");
    });
  }
});
