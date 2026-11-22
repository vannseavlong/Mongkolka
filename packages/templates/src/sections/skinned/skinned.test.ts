import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { contrastRatio } from "../../theme-presets";
import { sectionRegistry } from "../../registry";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import { mixHex } from "../../chrome/gold";
import type { SectionKey, Theme } from "../../types";
import { SKIN_IDS, type SkinId } from "../skins";
import { SkinProvider } from "../khmer/skin-context";
import { buildRsvpSubmission, clampGuests, isRsvpValid, rsvpErrors } from "./rsvp-logic";
import { footerHasBody, namesLine } from "./footer-logic";
import { paragraphsOf } from "./story-logic";
import { SKIN_UI, uiFor, DEFAULT_UI } from "./skin-ui";
import { onColor } from "./ui-shared";

/** The default palettes the six templates are seeded with (apps/api/seeds/site-templates.ts). */
const THEMES: Record<SkinId, Theme> = {
  emerald: { bg_color: "#0d2b1d", text_color: "#f3e5ab", accent_color: "#e5c07b", font_style: "serif" },
  garden: { bg_color: "#fdfbf7", text_color: "#3b3326", accent_color: "#8a6a2f", font_style: "serif" },
  cream: { bg_color: "#f8f1e4", text_color: "#4a3418", accent_color: "#886420", font_style: "serif" },
  sakura: { bg_color: "#f7d6e0", text_color: "#4a1230", accent_color: "#b01553", font_style: "serif" },
  fairytale: { bg_color: "#bfd7ea", text_color: "#1c2d5a", accent_color: "#2f4b8a", font_style: "sans" },
  kids: { bg_color: "#fff8f0", text_color: "#5a1630", accent_color: "#c82a62", font_style: "sans" },
};

function render(section: SectionKey, id: string, skin: SkinId, language: Language, props: Record<string, unknown>): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(SkinProvider, { skin, children: createElement(Component, { theme: THEMES[skin], ...props }) }),
    }),
  );
}

describe("paragraphsOf", () => {
  it("splits on blank lines and trims", () => {
    assert.deepEqual(paragraphsOf("One.\n\n  Two.  \n\n\nThree."), ["One.", "Two.", "Three."]);
  });
  it("keeps single newlines inside a paragraph", () => assert.deepEqual(paragraphsOf("a\nb"), ["a\nb"]));
  it("returns [] for empty input", () => {
    assert.deepEqual(paragraphsOf(""), []);
    assert.deepEqual(paragraphsOf("   \n\n "), []);
    assert.deepEqual(paragraphsOf(undefined), []);
  });
});

describe("rsvp logic", () => {
  it("clamps the guest count to 1..10 and survives junk", () => {
    assert.equal(clampGuests(0), 1);
    assert.equal(clampGuests(99), 10);
    assert.equal(clampGuests(3.9), 3);
    assert.equal(clampGuests(Number.NaN), 1);
  });
  it("needs a name and an attend choice", () => {
    assert.deepEqual(rsvpErrors({ name: "  ", attending: null }), { name: true, attending: true });
    assert.equal(isRsvpValid({ name: "Dara", attending: false }), true);
    assert.equal(isRsvpValid({ name: "Dara", attending: null }), false);
  });
  it("writes the party size only for a party of more than one that is attending", () => {
    assert.deepEqual(buildRsvpSubmission({ name: " Dara ", attending: true, guests: 3, message: " hi " }), {
      name: "Dara",
      attending: true,
      plusOne: true,
      message: "hi\nGuests: 3",
    });
    const one = buildRsvpSubmission({ name: "Dara", attending: true, guests: 1, message: "" });
    assert.equal(one.plusOne, false);
    assert.equal(one.message, undefined);
    const no = buildRsvpSubmission({ name: "Dara", attending: false, guests: 5, message: "sorry" });
    assert.deepEqual(no, { name: "Dara", attending: false, plusOne: false, message: "sorry" });
  });
  it("caps name and note length", () => {
    const s = buildRsvpSubmission({ name: "x".repeat(200), attending: true, guests: 1, message: "y".repeat(900) });
    assert.equal(s.name.length, 80);
    assert.equal(s.message?.length, 500);
  });
});

describe("footer logic", () => {
  it("joins names and knows when it has a body", () => {
    assert.equal(namesLine({ partner1Name: "A", partner2Name: "B" }), "A & B");
    assert.equal(namesLine({ partner1Name: "A" }), "A");
    assert.equal(namesLine(undefined), "");
    assert.equal(footerHasBody(undefined, undefined, null), false);
    assert.equal(footerHasBody(undefined, { hashtag: "#x" }, null), true);
    assert.equal(footerHasBody({ partner1Name: "A" }, undefined, null), true);
  });
});

describe("skin ui", () => {
  it("has one entry per skin and a default fallback", () => {
    for (const id of SKIN_IDS) assert.equal(uiFor(id).id, id);
    assert.equal(uiFor("nope"), DEFAULT_UI);
    assert.equal(uiFor(null), DEFAULT_UI);
  });
  it("button text reads (>= 3:1, large text) on the button's accent in every template", () => {
    for (const id of SKIN_IDS) {
      const theme = THEMES[id];
      const bg = String(SKIN_UI[id].button(theme).backgroundImage ?? "");
      assert.ok(bg.includes("gradient"), `${id} button has a gradient`);
      const text = String(SKIN_UI[id].button(theme).color);
      const ratio = contrastRatio(text, theme.accent_color);
      assert.ok(ratio !== null && ratio >= 3, `${id} button text ${text} on accent ${theme.accent_color} = ${ratio}`);
    }
  });
  it("onColor picks a readable text colour", () => {
    assert.equal(onColor("#0d2b1d"), "#ffffff");
    assert.equal(onColor("#fff8f0"), "#1b1408");
  });
  it("every skin has its own mark (no two skins share one)", () => {
    const marks = new Set(SKIN_IDS.map((id) => SKIN_UI[id].Mark));
    assert.equal(marks.size, SKIN_IDS.length);
  });
  it("styles fields differently per skin", () => {
    const radii = new Set(SKIN_IDS.map((id) => String(SKIN_UI[id].field(THEMES[id], false).borderRadius)));
    assert.ok(radii.size >= 4, `field radii: ${[...radii].join(",")}`);
    assert.equal(mixHex("#000000", "#ffffff", 50).length, 7);
  });
});

describe("skinned sections render in every skin, both languages", () => {
  const story = SAMPLE_CONTENT.story;
  const details = { ...(SAMPLE_CONTENT.details as object), mapUrl: "https://maps.example.com/x" };
  for (const skin of SKIN_IDS) {
    for (const lang of ["en", "kh"] as const) {
      it(`${skin} / ${lang}`, () => {
        const s = render("story", "story_skin", skin, lang, { content: story });
        assert.ok(s.includes("We met on a rainy afternoon"), "story text");
        assert.ok(s.includes('id="story"'));
        const d = render("details", "details_skin", skin, lang, { couple: SAMPLE_COUPLE, content: details });
        assert.ok(d.includes("Riverside Garden") && d.includes('href="https://maps.example.com/x"'));
        const r = render("rsvp", "rsvp_skin", skin, lang, { content: { customMessage: "See you!", deadline: "2026-11-01" }, onSubmit: async () => {} });
        assert.ok(r.includes("See you!") && r.includes("<form") && r.includes('id="sk-rsvp-name"'));
        const f = render("footer", "footer_skin", skin, lang, { couple: SAMPLE_COUPLE, content: { message: "Thank you.", hashtag: "#AlexAndSam" } });
        assert.ok(f.includes("Thank you.") && f.includes("#AlexAndSam") && f.includes("<footer"));
      });
    }
  }
  it("empty content renders nothing for story and details; footer keeps the credit link only when asked", () => {
    assert.equal(render("story", "story_skin", "garden", "en", { content: {} }), "");
    assert.equal(render("details", "details_skin", "garden", "en", { couple: SAMPLE_COUPLE, content: undefined }), "");
    assert.equal(render("footer", "footer_skin", "garden", "en", { couple: undefined, content: undefined }), "");
    const credit = render("footer", "footer_skin", "garden", "en", { couple: undefined, content: undefined, brandUrl: "https://example.com" });
    assert.ok(credit.includes('href="https://example.com"'));
  });
  it("never links a non-https map URL", () => {
    const d = render("details", "details_skin", "kids", "en", { couple: SAMPLE_COUPLE, content: { ceremonyVenue: "Hall", mapUrl: "javascript:alert(1)" } });
    assert.ok(!d.includes("javascript:"));
  });
});
