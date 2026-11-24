import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { OPENING_DEFAULTS, OPENING_FIELDS, openingToContent, openingToForm } from "./opening-content";

describe("opening content mapping", () => {
  it("fills every field from stored content, empty when missing or not a string", () => {
    const form = openingToForm({ blessingEn: "Grace", openKh: 5, junk: "x" });
    assert.equal(form.blessingEn, "Grace");
    assert.equal(form.openKh, "");
    assert.deepEqual(Object.keys(form), [...OPENING_FIELDS]);
    assert.equal(openingToForm(null).blessingKh, "");
  });
  it("saves trimmed values and drops empty ones so a cleared field returns to the default", () => {
    const form = openingToForm(null);
    form.inviteKh = "  ជូនពរ  ";
    form.openEn = "   ";
    assert.deepEqual(openingToContent(form), { inviteKh: "ជូនពរ" });
  });
  it("has a built-in wording placeholder for every wording field (event details fall back to the profile)", () => {
    for (const f of OPENING_FIELDS) {
      if (f in OPENING_DEFAULTS) assert.ok(OPENING_DEFAULTS[f as keyof typeof OPENING_DEFAULTS].length > 0, f);
    }
    assert.ok(!("date" in OPENING_DEFAULTS) && !("name1En" in OPENING_DEFAULTS));
  });
  it("saves event details with the wording", () => {
    const form = openingToForm({ name1En: "Vutha", date: "2027-01-07", time: "5:00 PM", venue: "Sen Sok City" });
    assert.deepEqual(openingToContent(form), { name1En: "Vutha", date: "2027-01-07", time: "5:00 PM", venue: "Sen Sok City" });
  });
});
