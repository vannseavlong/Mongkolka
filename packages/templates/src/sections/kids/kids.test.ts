import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import type { SectionKey, Theme } from "../../types";
import { SkinProvider } from "../khmer/skin-context";
import { SKIN_ORNAMENTS } from "../khmer/skin-ornaments";
import { skinFromComponents } from "../khmer/skin-resolve";
import { SKIN_EN, SKIN_KH } from "../skin-strings";
import { buntingFlags } from "./kids-logic-art";
import { burstPieces, exitDelay, honoreeName, OPEN_EXIT_MS, scatterSparkles, seeded } from "./kids-logic";
import { buildHeroView, ringPoints, safePhoto } from "./hero-logic";
import { buildKidsInvitation } from "./invitation-logic";
import { buildKidsDetails } from "./details-logic";

const theme: Theme = { bg_color: "#fff8f0", text_color: "#5a1630", accent_color: "#c82a62", font_style: "sans" };
const couple = { partner1Name: "Morokod", weddingDate: "2026-01-20" };

function render(section: SectionKey, id: string, language: Language, content?: unknown, extra: Record<string, unknown> = {}): string {
  const Component = sectionRegistry[section][id]!;
  assert.ok(Component, `${id} registered`);
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(SkinProvider, { skin: "kids", children: createElement(Component, { couple, theme, content, guestGreeting: "Dara", onOpen: () => undefined, ...extra }) }),
    }),
  );
}

describe("kids logic", () => {
  it("seeded generator is deterministic and in 0..1", () => {
    const a = seeded("x");
    const b = seeded("x");
    for (let i = 0; i < 5; i++) {
      const v = a();
      assert.equal(v, b());
      assert.ok(v >= 0 && v < 1);
    }
  });
  it("burst pieces are stable, bounded and cycle four tones", () => {
    const p = burstPieces(24, 200);
    assert.deepEqual(p, burstPieces(24, 200));
    assert.equal(p.length, 24);
    for (const piece of p) assert.ok(Math.hypot(piece.dx, piece.dy) <= 200 * 1.2);
    assert.deepEqual([...new Set(p.map((x) => x.tone))].sort(), [0, 1, 2, 3]);
  });
  it("skips the burst delay for reduced motion", () => {
    assert.equal(exitDelay(true), 0);
    assert.equal(exitDelay(false), OPEN_EXIT_MS);
  });
  it("scatter depends on the section id and stays on the page", () => {
    assert.deepEqual(scatterSparkles("agenda", 6), scatterSparkles("agenda", 6));
    assert.notDeepEqual(scatterSparkles("agenda", 6), scatterSparkles("details", 6));
    for (const s of scatterSparkles("a", 20)) assert.ok(s.x >= 2 && s.x <= 98 && s.y >= 2 && s.y <= 98);
  });
  it("honoree name: viewer language first, couple name as fallback", () => {
    assert.deepEqual(honoreeName("kh", { nameKh: "មរកត", nameEn: "Morokod" }, "X"), { name: "មរកត", other: "Morokod" });
    assert.deepEqual(honoreeName("en", { nameKh: "មរកត" }, "Fallback"), { name: "មរកត", other: "" });
    assert.deepEqual(honoreeName("en", undefined, " Fallback "), { name: "Fallback", other: "" });
  });
  it("bunting flags hang along the string and ring points sit on a circle", () => {
    const flags = buntingFlags(9, 400, 26);
    assert.equal(flags.length, 9);
    assert.ok(flags[4]!.y > flags[0]!.y, "middle hangs lower than the ends");
    assert.ok(flags[0]!.rot > 0 && flags[8]!.rot < 0, "flags tilt toward the middle");
    for (const p of ringPoints(12, 100, 150)) assert.ok(Math.abs(Math.hypot(p.x - 150, p.y - 150) - 100) < 0.2);
  });
});

describe("kids view models", () => {
  it("hero accepts https and site-relative photos only", () => {
    assert.equal(safePhoto("https://x.test/a.jpg"), "https://x.test/a.jpg");
    assert.equal(safePhoto("/img/a.jpg"), "/img/a.jpg");
    for (const bad of ["javascript:alert(1)", "http://x.test/a.jpg", "//evil.test/a.jpg", "data:text/html,x", "", undefined]) assert.equal(safePhoto(bad), null);
    assert.equal(buildHeroView({ partner1Name: " Mia ", partner2Name: "Leo" }, undefined).name, "Mia & Leo");
  });
  it("invitation: child, hosts, derived dates, monogram", () => {
    const v = buildKidsInvitation(
      { groom: { nameEn: "Morokod", fatherEn: "Sok", motherEn: "Dara" }, startsAt: "2026-01-20T17:00:00+07:00", greetingEn: "Join us!" },
      couple,
      "en",
    );
    assert.equal(v.name, "Morokod");
    assert.deepEqual(v.hosts, ["Mr. Sok & Mrs. Dara"]);
    assert.equal(v.englishDate, "TUESDAY 20th JANUARY 2026");
    assert.equal(v.time, "5:00 PM");
    assert.equal(v.monogram, "M");
    assert.equal(v.greeting, "Join us!");
    assert.equal(buildKidsInvitation(undefined, { partner1Name: "" }, "en").isEmpty, true);
    assert.equal(buildKidsInvitation({ groom: { nameKh: "មរកត", fatherKh: "សុខ" } }, couple, "kh").hosts[0], "លោក សុខ");
  });
  it("details: party first, after-party second, https only", () => {
    const v = buildKidsDetails({ ceremonyVenue: "Hall", receptionVenue: "Garden", mapUrl: "http://x.test", venueImageUrl: "https://x.test/v.jpg" });
    assert.deepEqual(v.places.map((p) => p.key), ["party", "after"]);
    assert.equal(v.map, null);
    assert.equal(v.image, "https://x.test/v.jpg");
    assert.deepEqual(buildKidsDetails({ receptionVenue: "Garden" }).places.map((p) => p.key), ["party"]);
    assert.equal(buildKidsDetails({}).isEmpty, true);
  });
});

describe("kids skin wiring", () => {
  it("is resolved from the template's default component ids and owns its ornaments", () => {
    assert.equal(skinFromComponents({ opening: "opening_kids", hero: "hero_kids" }), "kids");
    assert.equal(SKIN_ORNAMENTS.kids.id, "kids");
    assert.ok(SKIN_ORNAMENTS.kids.Backdrop);
    assert.equal(SKIN_ORNAMENTS.emerald.Backdrop, undefined);
    for (const icon of ["monk", "procession", "scissors", "thread", "ring", "tea", "dinner", "party", "cake"] as const) assert.ok(SKIN_ORNAMENTS.kids.icons[icon], icon);
  });
  it("has every kids string in both languages", () => {
    const keys = Object.keys(SKIN_EN).filter((k) => k.startsWith("kids."));
    assert.ok(keys.length >= 20);
    for (const k of keys) assert.ok(SKIN_KH[k], `kh ${k}`);
  });
});

describe("kids components render", () => {
  for (const language of ["en", "kh"] as const) {
    it(`opening: name, guest, CTA marked as the primary open action, no missing keys (${language})`, () => {
      const html = render("opening", "opening_kids", language);
      assert.ok(html.includes("Morokod") && html.includes("Dara"));
      assert.ok(html.includes("data-mk-open"));
      assert.ok(!/kids\.[a-z]/.test(html.replace(/class="[^"]*"/g, "")), "no raw translation keys");
      assert.ok(html.includes(language === "kh" ? "សូមចុចទីនេះដើម្បីចូល" : "Click here to open"));
    });
    it(`hero: photo or the mascot fallback (${language})`, () => {
      assert.ok(render("hero", "hero_kids", language, { coverPhotoUrl: "https://x.test/p.jpg" }).includes('src="https://x.test/p.jpg"'));
      const empty = render("hero", "hero_kids", language, {});
      assert.ok(!empty.includes("<img") && empty.includes("Morokod"));
      assert.ok(!render("hero", "hero_kids", language, { coverPhotoUrl: "javascript:alert(1)" }).includes("javascript:"));
    });
  }
  it("invitation shows the child, hosts and the countdown shell; empty returns nothing", () => {
    const html = render("invitation", "invitation_kids", "en", { groom: { nameEn: "Morokod", fatherEn: "Sok", motherEn: "Dara" }, startsAt: "2026-01-20T17:00:00+07:00" });
    for (const needle of ["Morokod", "Mr. Sok &amp; Mrs. Dara", "TUESDAY 20th JANUARY 2026", "––", 'role="timer"']) assert.ok(html.includes(needle), needle);
    assert.equal(render("invitation", "invitation_kids", "en", {}, { couple: { partner1Name: "" } }), "");
  });
  it("agenda falls back to a friendly default title and drops empty content", () => {
    const html = render("agenda", "agenda_kids", "en", { days: [{ date: "2026-01-20", items: [{ time: "5:00 PM", icon: "cake" }, { time: "6:00 PM", titleEn: "Games" }] }] });
    assert.ok(html.includes("Blow out the candles") && html.includes("Games") && html.includes("Party plan"));
    assert.equal(render("agenda", "agenda_kids", "en", undefined), "");
  });
  it("details only links https maps and returns nothing when empty", () => {
    assert.ok(!render("details", "details_kids", "en", { ceremonyVenue: "Hall", mapUrl: "javascript:alert(1)" }).includes("javascript:"));
    assert.ok(render("details", "details_kids", "kh", { ceremonyVenue: "Hall", mapUrl: "https://maps.example.com/x" }).includes('href="https://maps.example.com/x"'));
    assert.equal(render("details", "details_kids", "en", {}), "");
  });
});
