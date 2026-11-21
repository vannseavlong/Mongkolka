import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import { SAMPLE_COUPLE } from "../../sample-content";
import type { SectionKey, Theme } from "../../types";
import { SkinProvider } from "./skin-context";
import { SKIN_ORNAMENTS } from "./skin-ornaments";
import { DEFAULT_ORNAMENTS } from "./ornaments/default-ornaments";
import type { SkinOrnaments } from "./skin-ornament-types";

const dark: Theme = { bg_color: "#0d2b1d", text_color: "#f3e5ab", accent_color: "#e5c07b", font_style: "serif" };
const light: Theme = { bg_color: "#fbf1de", text_color: "#4a0e1a", accent_color: "#8a5a10", font_style: "serif" };

function render(section: SectionKey, id: string, language: Language, content: unknown, theme: Theme = dark, skin?: SkinOrnaments): string {
  const Component = sectionRegistry[section][id]!;
  const inner = createElement(Component, { couple: SAMPLE_COUPLE, theme, content });
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: skin ? createElement(SkinProvider, { skin: "emerald", children: inner }) : inner,
    }),
  );
}

const invitation = {
  groom: { nameKh: "ចន្ថា", nameEn: "Chantha", fatherKh: "ស៊ុន សម្បត្តិ", fatherEn: "Sun Sambath", motherKh: "ជា សុភា", motherEn: "Chea Sophea" },
  bride: { nameKh: "ឆារី", nameEn: "Chhary", fatherEn: "Chham Vuthy", motherEn: "Ly Sreyneang" },
  monogram: "C & C",
  lunarKh: "ថ្ងៃសុក្រ ៣កើត ខែភទ្របទ",
  startsAt: "2026-05-29T17:00:00+07:00",
};

describe("invitation_khmer", () => {
  it("shows both families, lunar + derived solar date, English date and monogram", () => {
    const html = render("invitation", "invitation_khmer", "kh", invitation);
    for (const needle of ["លោក ស៊ុន សម្បត្តិ", "លោកស្រី ជា សុភា", "កូនប្រុសនាម", "ថ្ងៃសុក្រ ៣កើត ខែភទ្របទ", "ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦", "FRIDAY 29th MAY 2026", "Mr. Chham Vuthy &amp; Mrs. Ly Sreyneang", "C &amp; C", "ម៉ោង ៥:០០ ល្ងាច"]) {
      assert.ok(html.includes(needle), `missing: ${needle}`);
    }
  });
  it("puts the viewer's language first", () => {
    const kh = render("invitation", "invitation_khmer", "kh", invitation);
    const en = render("invitation", "invitation_khmer", "en", invitation);
    assert.ok(kh.indexOf("កូនប្រុសនាម") < kh.indexOf("Mr. Sun"));
    assert.ok(en.indexOf("Mr. Sun") < en.indexOf("កូនប្រុសនាម"));
  });
  it("renders the countdown shell on the server (no clock yet) and nothing when empty", () => {
    assert.ok(render("invitation", "invitation_khmer", "en", invitation).includes("––"));
    assert.equal(render("invitation", "invitation_khmer", "en", {}), "");
    assert.equal(render("invitation", "invitation_khmer", "en", { groom: {} }), "");
  });
  it("shows a free-text greeting even without families, on a light theme", () => {
    const html = render("invitation", "invitation_khmer", "en", { greetingEn: "Join us", lunarKh: "ថ្ងៃពុធ" }, light);
    assert.ok(html.includes("Join us") && html.includes("ថ្ងៃពុធ"));
  });
});

describe("agenda_khmer", () => {
  const agenda = {
    days: [
      { date: "2026-05-28", items: [{ time: "15:00", icon: "monk" }] },
      { date: "2026-05-29", items: [{ time: "07:00", icon: "procession" }, { time: "09:00", icon: "scissors", titleKh: "កាត់សក់", titleEn: "Hair-cutting" }] },
    ],
  };
  it("renders default ritual names, day numbers and icons", () => {
    const kh = render("agenda", "agenda_khmer", "kh", agenda);
    assert.ok(kh.includes("ពិធីហែជំនូន") && kh.includes("ពិធីសូត្រមន្តបួងសួង") && kh.includes("ថ្ងៃទី ១") && kh.includes("ថ្ងៃទី ២"));
    assert.ok((kh.match(/<svg/g) ?? []).length >= 3 + 4, "icons present");
    const en = render("agenda", "agenda_khmer", "en", agenda);
    assert.ok(en.includes("Procession of gifts") && en.includes("Hair-cutting") && en.includes("Friday, 29 May 2026"));
  });
  it("is empty without items", () => {
    assert.equal(render("agenda", "agenda_khmer", "en", { days: [{ date: "2026-05-29", items: [] }] }), "");
  });
});

describe("letters_khmer", () => {
  it("renders gratitude and apology as separate cards, both languages", () => {
    const html = render("letters", "letters_khmer", "en", { gratitudeEn: "Thank you.\n\nWith love.", gratitudeKh: "អរគុណ", apologyKh: "សូមអភ័យទោស" });
    assert.ok(html.includes("Letter of gratitude") && html.includes("Thank you.") && html.includes("អរគុណ"));
    assert.ok(html.includes('id="letters-apology"') && html.includes("សូមអភ័យទោស"));
  });
  it("omits a letter that was not written", () => {
    const html = render("letters", "letters_khmer", "en", { gratitudeEn: "Thanks" });
    assert.ok(!html.includes("letters-apology"));
  });
});

describe("details_khmer", () => {
  it("shows cards, dress code and only an https map link", () => {
    const html = render("details", "details_khmer", "en", { ceremonyVenue: "Hall", ceremonyTime: "9:00", dressCode: "Formal", mapUrl: "https://maps.example/x", venueImageUrl: "http://insecure/x.jpg" });
    assert.ok(html.includes("Hall") && html.includes("Formal") && html.includes('href="https://maps.example/x"'));
    assert.ok(!html.includes("insecure"), "non-https venue image is dropped");
  });
});

describe("skin ornaments", () => {
  it("a skin that registers its own set replaces the default look in the shared sections", () => {
    const Marker = () => createElement("i", { "data-skin-marker": "1" });
    const original = SKIN_ORNAMENTS.emerald;
    const content = { gratitudeEn: "x" };
    try {
      assert.ok(!render("letters", "letters_khmer", "en", content, dark, original).includes("data-skin-marker"));
      SKIN_ORNAMENTS.emerald = { ...DEFAULT_ORNAMENTS, id: "custom", Divider: Marker };
      assert.ok(render("letters", "letters_khmer", "en", content, dark, SKIN_ORNAMENTS.emerald).includes("data-skin-marker"));
    } finally {
      SKIN_ORNAMENTS.emerald = original;
    }
  });
});
