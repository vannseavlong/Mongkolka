import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { LanguageProvider, type Language } from "../../i18n";
import { sectionRegistry } from "../../registry";
import { SAMPLE_CONTENT, SAMPLE_COUPLE } from "../../sample-content";
import { AGENDA_ICONS, type Theme } from "../../types";
import { ornamentsFor, SKIN_ORNAMENTS } from "../khmer/skin-ornaments";
import { sakuraPalette } from "./palette";
import { branchesSvg, bedSvg, archGarlandSvg, hallwaySvg, doveSvg } from "./art/scenes";
import { heroNames, heroPhoto } from "./hero-logic";
import { SAKURA_ORNAMENTS } from "./ornaments";

const theme: Theme = { bg_color: "#f7d6e0", text_color: "#4a1230", accent_color: "#b01553", font_style: "serif" };

function render(section: "opening" | "hero", id: string, language: Language, content?: unknown, guest?: string): string {
  const Component = sectionRegistry[section][id]!;
  return renderToStaticMarkup(
    createElement(LanguageProvider, {
      initialLanguage: language,
      children: createElement(Component, { couple: SAMPLE_COUPLE, theme, content, guestGreeting: guest, onOpen: () => undefined }),
    }),
  );
}

describe("sakura opening", () => {
  for (const language of ["en", "kh"] as const) {
    it(`renders the gate with names, guest, medallion and a keyboard-operable open button (${language})`, () => {
      const html = render("opening", "opening_sakura", language, undefined, "Dara");
      assert.ok(html.includes("Alex") && html.includes("Sam"));
      assert.ok(html.includes("Dara"), "greets the guest");
      assert.ok(/<button[^>]*type="button"[^>]*data-mk-open/.test(html), "the one button primes music");
      assert.ok(html.includes('data-phase="idle"'));
      assert.ok(html.includes("sk-burst") && html.includes("sk-flash") && html.includes("sk-hall"), "burst, flash and hallway layers");
      assert.ok(html.includes('aria-label="A &amp; S"'), "medallion is labelled");
      assert.ok(!html.includes("sakura."), "no missing translation key");
    });
  }
  it("renders without a guest name", () => {
    assert.ok(!render("opening", "opening_sakura", "en").includes("Dear"));
  });
});

describe("sakura hero", () => {
  it("shows the portrait, names and tagline", () => {
    const html = render("hero", "hero_sakura", "en", SAMPLE_CONTENT.hero);
    assert.ok(html.includes("<img") && html.includes("Alex") && html.includes("Save the Date"));
    assert.ok(html.includes("sk-garland"));
  });
  it("falls back to the monogram medallion with no photo", () => {
    const html = render("hero", "hero_sakura", "kh", {});
    assert.ok(!html.includes("<img"));
    assert.ok(html.includes('aria-label="A &amp; S"'));
  });
  it("heroPhoto only accepts https or site-relative images", () => {
    assert.equal(heroPhoto("https://x.com/a.jpg"), "https://x.com/a.jpg");
    assert.equal(heroPhoto("/uploads/a.jpg"), "/uploads/a.jpg");
    assert.equal(heroPhoto("//evil.com/a.jpg"), null);
    assert.equal(heroPhoto("javascript:alert(1)"), null);
    assert.equal(heroPhoto("http://x.com/a.jpg"), null);
    assert.equal(heroPhoto(undefined), null);
    assert.deepEqual(heroNames({ partner1Name: " A ", partner2Name: "" }), ["A"]);
  });
});

describe("sakura ornaments and art", () => {
  it("registers its set for the sakura skin only and covers all nine ritual icons", () => {
    assert.equal(SKIN_ORNAMENTS.sakura, SAKURA_ORNAMENTS);
    assert.equal(ornamentsFor("sakura").id, "sakura");
    assert.notEqual(SKIN_ORNAMENTS.emerald, SAKURA_ORNAMENTS);
    for (const icon of AGENDA_ICONS) assert.ok(SAKURA_ORNAMENTS.icons[icon], icon);
  });
  it("draws well-formed, deterministic, bounded SVG for every scene", () => {
    const p = sakuraPalette(theme);
    for (const [name, fn, max] of [["branches", branchesSvg, 40_000], ["bed", bedSvg, 60_000], ["garland", archGarlandSvg, 45_000], ["hallway", hallwaySvg, 60_000], ["dove", doveSvg, 2_000]] as const) {
      const a = fn(p);
      assert.ok(a.startsWith("<svg") && a.endsWith("</svg>"), name);
      assert.equal(a, fn(p), `${name} is deterministic`);
      assert.ok(a.length < max, `${name} is ${a.length} bytes`);
      assert.ok(!/<script|javascript:|onload=/i.test(a), name);
    }
  });
  it("blossoms recolour with the accent", () => {
    assert.notEqual(branchesSvg(sakuraPalette(theme)), branchesSvg(sakuraPalette({ ...theme, accent_color: "#2f6a96" })));
  });
  it("shared Khmer sections render with the sakura ornaments (cards carry the art vars)", () => {
    const Invitation = sectionRegistry.invitation.invitation_khmer!;
    const html = renderToStaticMarkup(createElement(LanguageProvider, { initialLanguage: "en", children: createElement(Invitation, { couple: SAMPLE_COUPLE, theme, content: SAMPLE_CONTENT.invitation }) }));
    assert.ok(html.length > 200);
  });
});
