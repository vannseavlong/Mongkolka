import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { dotDate } from "./date-line";
import { OPEN_TIMELINE, guestName, openingTotalMs, phaseAt } from "./opening-logic";
import { creamPalette } from "./palette";
import { BASE_SCALE, wreathPlacements } from "./wreath";

describe("opening logic", () => {
  it("runs the five steps in order and ends after the zoom", () => {
    const t = OPEN_TIMELINE;
    assert.ok(t.seal.at < t.flap.at && t.flap.at < t.rise.at && t.rise.at < t.zoom.at);
    assert.ok(t.rise.at >= t.flap.at + t.flap.ms / 2, "the card rises once the flap has turned past halfway (and is behind it)");
    assert.ok(t.rise.at + t.rise.ms <= t.zoom.at + 1, "the zoom starts after the rise");
    assert.equal(openingTotalMs(), t.zoom.at + t.zoom.ms);
  });

  it("phaseAt walks closed -> unsealing -> flap -> rising -> zooming -> done", () => {
    const t = OPEN_TIMELINE;
    assert.equal(phaseAt(-1), "closed");
    assert.equal(phaseAt(0), "unsealing");
    assert.equal(phaseAt(t.flap.at), "flap");
    assert.equal(phaseAt(t.rise.at), "rising");
    assert.equal(phaseAt(t.zoom.at), "zooming");
    assert.equal(phaseAt(openingTotalMs()), "done");
  });

  it("guestName trims, collapses spaces and caps the length", () => {
    assert.equal(guestName("  Mr.   Dara "), "Mr. Dara");
    assert.equal(guestName("   "), null);
    assert.equal(guestName(undefined), null);
    const long = guestName("x".repeat(200), 40)!;
    assert.equal(Array.from(long).length, 40);
    assert.ok(long.endsWith("…"));
  });
});

describe("hero date line", () => {
  it("formats English and Khmer with dots", () => {
    assert.equal(dotDate("2026-05-29", "en"), "29 · MAY · 2026");
    assert.equal(dotDate("2026-05-05T10:00:00+07:00", "en"), "05 · MAY · 2026");
    assert.equal(dotDate("2026-05-29", "kh"), "២៩ · ឧសភា · ២០២៦");
  });
  it("returns null without a usable date", () => {
    assert.equal(dotDate(undefined, "en"), null);
    assert.equal(dotDate("not a date", "kh"), null);
  });
});

describe("wreath layout", () => {
  const items = wreathPlacements(180, 220, 126, 170, 18, 11);

  it("is deterministic (same server and client render)", () => {
    assert.deepEqual(items, wreathPlacements(180, 220, 126, 170, 18, 11));
    assert.notDeepEqual(items, wreathPlacements(180, 220, 126, 170, 18, 12));
  });

  it("puts one bloom and two leaves at each of the stations", () => {
    assert.equal(items.length, 54);
    assert.equal(items.filter((i) => i.kind === "leaf").length, 36);
    for (const i of items) {
      assert.ok(Number.isFinite(i.x) && Number.isFinite(i.y) && Number.isFinite(i.rot) && i.scale > 0);
    }
  });

  it("keeps everything near the oval and makes the bottom fuller than the crown", () => {
    for (const i of items) {
      const nx = (i.x - 180) / 126;
      const ny = (i.y - 220) / 170;
      assert.ok(Math.hypot(nx, ny) > 0.9 && Math.hypot(nx, ny) < 1.1, `bloom ${i.kind} sits on the oval`);
    }
    const flowers = items.filter((i) => i.kind !== "leaf");
    const avg = (xs: typeof flowers) => xs.reduce((s, i) => s + i.scale / BASE_SCALE[i.kind], 0) / xs.length;
    assert.ok(avg(flowers.filter((i) => i.y > 220)) > avg(flowers.filter((i) => i.y < 220)));
  });
});

describe("palette", () => {
  it("derives warm paper tones from the theme and keeps the gold stops ordered", () => {
    const p = creamPalette({ bg_color: "#f8f1e4", text_color: "#4a3418", accent_color: "#886420", font_style: "serif" });
    for (const c of [p.paper, p.paperDeep, p.champagne, p.goldHi, p.gold, p.goldLo]) assert.match(c, /^#[0-9a-f]{6}$/);
    assert.equal(p.gold, "#886420");
    assert.notEqual(p.goldHi, p.goldLo);
  });
});
