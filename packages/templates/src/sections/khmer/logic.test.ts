import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { agendaDayHeading, calendarParts, englishDateLine, khmerSolarLine, phnomPenhParts, timeLine } from "./date-lines";
import { buildFamily, englishParentsLine, khmerParentLine, orderedLanguages } from "./lineage";
import { buildAgenda } from "./agenda-logic";
import { skinFromComponents } from "./skin-resolve";
import { foilTextGradient, isDarkColor } from "./foil";

describe("date lines (Cambodia time)", () => {
  const p = phnomPenhParts("2026-05-29T17:00:00+07:00")!;
  it("reads wall-clock parts in Phnom Penh whatever the offset", () => {
    assert.deepEqual([p.year, p.month, p.day, p.weekday, p.hour, p.minute], [2026, 4, 29, 5, 17, 0]);
    const late = phnomPenhParts("2026-05-29T20:00:00Z")!; // 03:00 next day in Phnom Penh
    assert.equal(late.day, 30);
  });
  it("formats Khmer and English lines", () => {
    assert.equal(khmerSolarLine(p), "ត្រូវនឹងថ្ងៃទី២៩ ខែឧសភា ឆ្នាំ២០២៦");
    assert.equal(englishDateLine(p), "FRIDAY 29th MAY 2026");
    assert.equal(englishDateLine(phnomPenhParts("2025-01-16T17:00:00+07:00")!), "THURSDAY 16th JANUARY 2025");
    assert.equal(timeLine(p, "en"), "5:00 PM");
    assert.equal(timeLine(p, "kh"), "ម៉ោង ៥:០០ ល្ងាច");
  });
  it("ordinals handle 11-13 and 21-23", () => {
    for (const [d, w] of [[1, "1st"], [2, "2nd"], [3, "3rd"], [11, "11th"], [12, "12th"], [13, "13th"], [21, "21st"], [22, "22nd"], [30, "30th"]] as const) {
      const parts = calendarParts(`2026-03-${String(d).padStart(2, "0")}`)!;
      assert.ok(englishDateLine(parts).includes(` ${w} `), `${d} -> ${w}`);
    }
  });
  it("rejects bad input", () => {
    assert.equal(phnomPenhParts("nope"), null);
    assert.equal(phnomPenhParts(undefined), null);
    assert.equal(calendarParts("2026-02-31"), null);
    assert.equal(agendaDayHeading("garbage", "en"), "garbage");
  });
  it("agenda day heading", () => {
    assert.equal(agendaDayHeading("2026-05-29", "en"), "Friday, 29 May 2026");
    assert.equal(agendaDayHeading("2026-05-29", "kh"), "ថ្ងៃសុក្រ ២៩ ឧសភា ២០២៦");
  });
});

describe("lineage", () => {
  it("adds honorifics unless already typed", () => {
    assert.equal(khmerParentLine("ស៊ុន សម្បត្តិ", "father"), "លោក ស៊ុន សម្បត្តិ");
    assert.equal(khmerParentLine("ស៊ុន សម្បត្តិ", "mother"), "លោកស្រី ស៊ុន សម្បត្តិ");
    assert.equal(khmerParentLine("ឯកឧត្តម ស៊ុន", "father"), "ឯកឧត្តម ស៊ុន");
    assert.equal(khmerParentLine("  ", "father"), "");
    assert.equal(englishParentsLine("Sun Sambath", "Chea Sophea"), "Mr. Sun Sambath & Mrs. Chea Sophea");
    assert.equal(englishParentsLine("Dr. Sun", undefined), "Dr. Sun");
    assert.equal(englishParentsLine(undefined, "Chea"), "Mrs. Chea");
    assert.equal(englishParentsLine("", ""), "");
  });
  it("builds a family only when there is something to show", () => {
    assert.equal(buildFamily(undefined, "groom", "en"), null);
    assert.equal(buildFamily({ nameKh: "ចន្ថា" }, "groom", "en"), null);
    const f = buildFamily({ nameEn: "Chantha", fatherEn: "Sun", motherEn: "Chea" }, "groom", "en")!;
    assert.deepEqual(f.parents, ["Mr. Sun & Mrs. Chea"]);
    assert.equal(f.name, "Chantha");
  });
  it("orders languages viewer first and drops empty ones", () => {
    assert.deepEqual(orderedLanguages("kh", { kh: true, en: true }), ["kh", "en"]);
    assert.deepEqual(orderedLanguages("en", { kh: true, en: true }), ["en", "kh"]);
    assert.deepEqual(orderedLanguages("en", { kh: true, en: false }), ["kh"]);
    assert.deepEqual(orderedLanguages("en", { kh: false, en: false }), []);
  });
});

describe("agenda view-model", () => {
  const def = (i: string) => `default:${i}`;
  it("sorts days, numbers them and drops empty items and days", () => {
    const v = buildAgenda(
      {
        days: [
          { date: "2026-05-29", items: [{ time: "07:00", icon: "procession" }, { time: "09:00", titleEn: "Hair-cutting", titleKh: "កាត់សក់", icon: "scissors" }, { time: "10:00" }] },
          { date: "2026-05-28", items: [{ time: "15:00", titleEn: "Monk blessing" }] },
          { date: "2026-05-30", items: [{ time: "1" }] },
        ],
      },
      "en",
      def,
    );
    assert.deepEqual(v.map((d) => [d.date, d.number]), [["2026-05-28", 1], ["2026-05-29", 2]]);
    assert.equal(v[1]!.items.length, 2);
    assert.equal(v[1]!.items[0]!.title, "default:procession");
    assert.ok(v[1]!.items[0]!.usedDefault);
    assert.equal(v[1]!.items[1]!.title, "Hair-cutting");
    assert.equal(v[1]!.items[1]!.subtitle, "កាត់សក់");
  });
  it("handles missing content", () => {
    assert.deepEqual(buildAgenda(undefined, "kh", def), []);
  });
});

describe("skin resolve + foil", () => {
  it("reads the skin from opening/hero ids", () => {
    assert.equal(skinFromComponents({ opening: "opening_emerald" }), "emerald");
    assert.equal(skinFromComponents({ hero: "hero_kids" }), "kids");
    assert.equal(skinFromComponents({ opening: "opening_grace", hero: "hero_grace" }), null);
    assert.equal(skinFromComponents(undefined), null);
  });
  it("foil gradient differs on dark and light grounds", () => {
    assert.ok(isDarkColor("#0d2b1d"));
    assert.ok(!isDarkColor("#fbf1de"));
    assert.notEqual(foilTextGradient("#c9962e", "#0d2b1d"), foilTextGradient("#c9962e", "#fbf1de"));
  });
});
