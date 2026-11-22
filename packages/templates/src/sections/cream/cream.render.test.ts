import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import { AgendaKhmer } from "../khmer/Agenda";
import { LettersKhmer } from "../khmer/Letters";
import { SKIN_ORNAMENTS, ornamentsFor } from "../khmer/skin-ornaments";
import { SkinProvider } from "../khmer/skin-context";
import type { AgendaContent, LettersContent, Theme } from "../../types";
import { AGENDA_ICONS } from "../../types";
import { CreamHero } from "./Hero";
import { CreamOpening } from "./Opening";
import { CREAM_ORNAMENTS } from "./ornaments";

const theme: Theme = { bg_color: "#f8f1e4", text_color: "#4a3418", accent_color: "#886420", font_style: "serif" };

function render(node: React.ReactElement, language: Language): string {
  return renderToStaticMarkup(createElement(LanguageProvider, { initialLanguage: language, children: node }));
}

const opening = (language: Language, guest?: string, couple = SAMPLE_COUPLE) =>
  render(createElement(CreamOpening, { couple, theme, guestGreeting: guest, onOpen: () => undefined }), language);

describe("cream opening", () => {
  for (const language of ["en", "kh"] as const) {
    it(`renders the envelope, names, guest slot and an openable button (${language})`, () => {
      const html = opening(language, "Dara");
      assert.ok(html.includes("cr-flap") && html.includes("cr-card") && html.includes("cr-pocket"));
      assert.ok(html.includes("Alex") && html.includes("Dara"));
      assert.ok(html.includes("data-mk-open"), "the real button primes the music");
      assert.ok(html.includes("<button"));
      assert.ok(!html.includes("cream."), "no missing translation key");
      assert.ok(html.includes('role="img"'));
    });
  }

  it("shows the Khmer guest label in Khmer and the tagline instead when nobody is named", () => {
    assert.ok(opening("kh", "Dara").includes("ភ្ញៀវកិត្តិយស"));
    const noGuest = opening("en");
    assert.ok(!noGuest.includes("Honoured guest"));
    assert.ok(noGuest.includes("With love and gold"));
  });

  it("caps a very long guest name and does not render markup from it", () => {
    const html = opening("en", `<img src=x onerror=alert(1)>${"y".repeat(200)}`);
    assert.ok(!html.includes("<img src=x"));
    assert.ok(!html.includes("y".repeat(60)));
  });

  it("is closed until tapped (the CSS only animates when data-open is true)", () => {
    assert.ok(opening("en").includes('data-open="false"'));
  });
});

describe("cream hero", () => {
  it("shows the photo in the oval, the names and the dotted date", () => {
    const html = render(createElement(CreamHero, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.hero as { coverPhotoUrl: string } }), "en");
    assert.ok(html.includes("<img") && html.includes("Alex") && html.includes("12 · DEC · 2026"));
    assert.ok(!html.includes("cream."));
  });

  it("falls back to the shield monogram without a photo, in Khmer too", () => {
    const html = render(createElement(CreamHero, { couple: SAMPLE_COUPLE, theme }), "kh");
    assert.ok(!html.includes("<img"));
    assert.ok(html.includes("A &amp; S") && html.includes("១២ · ធ្នូ · ២០២៦"));
  });
});

describe("cream ornaments", () => {
  it("is the registered set for the cream skin and every other skin is untouched", () => {
    assert.equal(SKIN_ORNAMENTS.cream, CREAM_ORNAMENTS);
    assert.equal(ornamentsFor("cream").id, "cream");
    assert.notEqual(ornamentsFor("emerald").id, "cream");
  });

  it("has a distinct icon for each of the nine rituals", () => {
    const seen = new Set<unknown>();
    for (const key of AGENDA_ICONS) {
      const Icon = CREAM_ORNAMENTS.icons[key];
      assert.ok(Icon, key);
      seen.add(Icon);
      assert.ok(render(createElement(Icon, { color: "#886420", size: 40 }), "en").includes("<svg"));
    }
    assert.equal(seen.size, AGENDA_ICONS.length);
  });

  it("styles headings with Moul in Khmer and the script in English, as gold foil", () => {
    const kh = CREAM_ORNAMENTS.heading(theme, "kh");
    const en = CREAM_ORNAMENTS.heading(theme, "en");
    assert.match(String(kh.fontFamily), /moul/i);
    assert.match(String(en.fontFamily), /great vibes|font-script/i);
    assert.ok(String(en.backgroundImage).includes("linear-gradient"));
  });

  it("reaches the shared sections: agenda and letters render the cream skin (blush medallions, backdrop)", () => {
    const wrap = (node: React.ReactElement) => render(createElement(SkinProvider, { skin: "cream", children: node }), "en");
    const agenda = wrap(createElement(AgendaKhmer, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.agenda as AgendaContent }));
    assert.ok(agenda.includes("stroke-dasharray=\"0.1 3.2\""), "cream medallion icons");
    const letters = wrap(createElement(LettersKhmer, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.letters as LettersContent }));
    assert.ok(letters.includes("<svg") && letters.includes("filter="), "watercolour backdrop florals");
  });
});
