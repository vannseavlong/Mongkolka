import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, resolveInitialLanguage, type Language } from "../../i18n";
import { SkinProvider } from "../khmer/skin-context";
import { sectionRegistry } from "../../registry";
import { COVENANT_SAMPLE_COUPLE as SAMPLE_COUPLE, SAMPLE_CONTENT, SAMPLE_GUESTBOOK } from "../../sample-content";
import type { SectionKey, Theme } from "../../types";
import { fitScale, guestLine, hasKhmer, petals } from "./intro-logic";
import { coupleNamesFor, joinNames } from "./names";
import { memoriesView, subRoute } from "./memories-logic";
import { nextHeroPhase, usablePhoto } from "./hero-logic";
import { youtubeId } from "./video-logic";
import { coverTagline } from "./cover-text";
import { openingText } from "./opening-text";
import { BUTTERFLIES, bloomCluster, butterflyEntry, DOVES, FLYERS, FOLIAGE_REGIONS, leafCluster, SPARKLES } from "./cover-logic";

const theme: Theme = { bg_color: "#fff3f6", text_color: "#4a2c35", accent_color: "#8a6418", font_style: "serif" };

function render(section: SectionKey, id: string, language: Language, props: Record<string, unknown>): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(SkinProvider, { skin: "covenant", children: createElement(LanguageProvider, { initialLanguage: language, children: createElement(Component, { couple: SAMPLE_COUPLE, theme, ...props }) }) }),
  );
}

describe("covenant guest line", () => {
  it("shows the name exactly as set, tidied, and nothing else", () => {
    assert.equal(guestLine("សុខា"), "សុខា");
    assert.equal(guestLine("  Sokha   Chan "), "Sokha Chan");
    assert.equal(guestLine("Sokha & Dara"), "Sokha & Dara");
    assert.equal(guestLine(undefined), "");
    assert.equal(guestLine("   "), "");
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
      assert.ok(open.includes(language === "kh" ? "វុត្ថា" : "Vutha") && open.includes("Dara"));
      assert.ok(!open.includes("and spouse") && !open.includes("និងភរិយា"), "no hard-coded spouse text");
      const anon = render("opening", "opening_covenant", language, { onOpen: () => undefined });
      assert.ok(anon.includes(language === "kh" ? "អស់លោក" : "Honoured guests"), "default address without a name");
      assert.ok(!open.includes("covenant."), "no missing translation key");
      const card = render("opening", "opening_card_covenant", language, { guestGreeting: "Dara", details: { ceremonyVenue: "Grace Hall", ceremonyTime: "5:00 PM" }, onOpen: () => undefined });
      assert.ok(card.includes(language === "kh" ? "វុត្ថា" : "Vutha") && card.includes("Dara") && card.includes("Grace Hall") && card.includes("5:00 PM"));
      assert.ok(!card.includes("covenant."), "no missing translation key");
      assert.ok(!render("opening", "opening_card_covenant", language, { onOpen: () => undefined }).includes('class="cv-guestbox'), "no guest box without a name");
      assert.ok(card.includes('class="cv-guestbox'), "guest box with a name");
      assert.ok(render("hero", "hero_covenant", language, { content: SAMPLE_CONTENT.hero }).includes(language === "kh" ? "វុត្ថា" : "Vutha"));
      assert.ok(render("verse", "verse_covenant", language, { content: SAMPLE_CONTENT.verse }).includes("1 Corinthians 13:4–8") && render("verse", "verse_covenant", language, { content: SAMPLE_CONTENT.verse }).includes("True love is patient"));
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

describe("covenant names", () => {
  it("shows the Khmer spelling on Khmer pages and the main name otherwise", () => {
    assert.equal(joinNames(coupleNamesFor(SAMPLE_COUPLE, "kh")), "វុត្ថា & នីតា");
    assert.equal(joinNames(coupleNamesFor(SAMPLE_COUPLE, "en")), "Vutha & Nita");
    assert.equal(joinNames(coupleNamesFor({ partner1Name: "Sokha" }, "kh")), "Sokha");
    assert.equal(joinNames(coupleNamesFor({ partner1Name: "A", partner2Name: "B", partner1NameKh: " ក ", partner2NameKh: "" }, "kh")), "ក & B");
  });
});

describe("covenant fit scale", () => {
  it("shrinks only when needed and stays sane", () => {
    assert.equal(fitScale(800, 600), 1);
    assert.equal(fitScale(400, 800), 0.5);
    assert.equal(fitScale(100, 1000), 0.3);
    assert.equal(fitScale(0, 500), 1);
    assert.equal(fitScale(500, 0), 1);
  });
});

describe("covenant covers", () => {
  const noop = () => {};
  for (const id of ["cover_covenant_butterflies", "cover_covenant_garden"]) {
    for (const language of ["en", "kh"] as const) {
      it(`${id} renders the couple's names (no skip hint) in ${language}`, () => {
        const html = render("cover", id, language, { onReveal: noop, onDone: noop });
        assert.ok(html.includes("data-mk-cover"));
        assert.ok(!html.includes("Tap to skip") && !html.includes("ចុចដើម្បីរំលង"));
        assert.ok(html.includes("cvc-glass") && html.includes("cvc-world"));
      });
    }
  }
  it("butterflies sit inside the screen and fly in from the nearer edge", () => {
    for (const b of BUTTERFLIES) assert.ok(b.x >= 0 && b.x <= 100 && b.y >= 0 && b.y <= 100 && b.size > 0);
    for (const b of BUTTERFLIES) assert.equal(Math.abs(butterflyEntry(b).dx), 70);
  });
  it("foliage clusters are deterministic, stay in their region and match the requested count", () => {
    for (const { region, blooms, leaves } of FOLIAGE_REGIONS) {
      const a = bloomCluster(region, blooms, 5);
      assert.deepEqual(a, bloomCluster(region, blooms, 5));
      assert.equal(a.length, blooms);
      for (const b of a) assert.ok(b.x >= region.x0 && b.x <= region.x1 && b.y >= region.y0 && b.y <= region.y1 && b.size > 0);
      const l = leafCluster(region, leaves, 5);
      assert.equal(l.length, leaves);
      for (const x of l) assert.ok(x.x >= region.x0 && x.x <= region.x1 && x.size > 0);
    }
    assert.equal(bloomCluster(FOLIAGE_REGIONS[0]!.region, -2, 1).length, 0);
  });
  it("ambient tables are well formed", () => {
    for (const s of SPARKLES) assert.ok(s.x >= 0 && s.x <= 100 && s.y >= 0 && s.y <= 100 && s.duration > 0);
    assert.ok(FLYERS.every((f) => f.size > 0 && f.duration > 0));
    assert.ok(DOVES.length >= 1 && DOVES.every((d) => d.size > 0 && d.duration > 0));
  });
});

describe("covenant opening wording", () => {
  it("uses the couple's text for the viewer's language and the built-in text when empty", () => {
    const content = { inviteKh: " ជូនពរ ", openEn: "Come in", titleEn: "   " };
    assert.equal(openingText(content, "invite", "kh", "default"), "ជូនពរ");
    assert.equal(openingText(content, "invite", "en", "default"), "default");
    assert.equal(openingText(content, "open", "en", "default"), "Come in");
    assert.equal(openingText(content, "title", "en", "Invitation"), "Invitation");
    assert.equal(openingText(undefined, "blessing", "kh", "built-in"), "built-in");
  });
  it("renders the couple's wording on both Covenant openings", () => {
    const content = { inviteEn: "Together with joy we invite", openEn: "Come in", blessingEn: "Grace upon grace" };
    for (const id of ["opening_card_covenant", "opening_covenant"]) {
      const html = render("opening", id, "en", { guestGreeting: "Sokha", onOpen: () => {}, content });
      assert.ok(html.includes("Together with joy we invite") || html.includes("Grace upon grace"), id);
    }
  });
});

describe("initial site language", () => {
  it("an explicit ?lang= wins, then the couple's default, and Khmer when neither is set", () => {
    assert.equal(resolveInitialLanguage("en", "kh"), "en");
    assert.equal(resolveInitialLanguage("kh", "en"), "kh");
    assert.equal(resolveInitialLanguage(null, "en"), "en");
    assert.equal(resolveInitialLanguage(null, "kh"), "kh");
    assert.equal(resolveInitialLanguage(null, null), "kh");
    assert.equal(resolveInitialLanguage(undefined, undefined), "kh");
    assert.equal(resolveInitialLanguage("fr", "en"), "en");
  });
});

describe("cover wording", () => {
  it("uses the couple's line for the viewer's language, else the built-in one", () => {
    assert.equal(coverTagline({ taglineKh: " ខ្ញុំស្រលាញ់អ្នក ", taglineEn: "" }, "kh", "x"), "ខ្ញុំស្រលាញ់អ្នក");
    assert.equal(coverTagline({ taglineKh: "ក" }, "en", "built-in"), "built-in");
    assert.equal(coverTagline(undefined, "kh", "built-in"), "built-in");
  });
  it("shows the couple's line on both covers", () => {
    for (const id of ["cover_covenant_butterflies", "cover_covenant_garden"]) {
      assert.ok(render("cover", id, "en", { onReveal: () => {}, onDone: () => {}, content: { taglineEn: "Forever starts today" } }).includes("Forever starts today"), id);
    }
  });
});
