import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { invitationToForm } from "./khmer-content";
import { hasInvitationContent, monogramFor, parseClockTime, prefillInvitation } from "./invitation-prefill";

const profile = { partner1_name: "Vutha", partner2_name: "សុនីតា", wedding_date: "2027-01-07T00:00:00.000Z", ceremony_time: "5:00pm" };

describe("clock times", () => {
  it("reads 12 and 24 hour times", () => {
    assert.equal(parseClockTime("5:00pm"), "17:00");
    assert.equal(parseClockTime("5 PM"), "17:00");
    assert.equal(parseClockTime("12:30 am"), "00:30");
    assert.equal(parseClockTime("12 pm"), "12:00");
    assert.equal(parseClockTime("17:45"), "17:45");
    assert.equal(parseClockTime("7.30 a.m."), "07:30");
  });
  it("rejects anything else", () => {
    for (const bad of ["", null, undefined, "evening", "25:00", "13pm", "5:75", "5pm sharp"]) assert.equal(parseClockTime(bad as string), null, String(bad));
  });
});

describe("monogram", () => {
  it("uses the first letter of each name", () => {
    assert.equal(monogramFor("vutha", "Sonita"), "V&S");
    assert.equal(monogramFor("Vutha", null), "V");
    assert.equal(monogramFor(null, null), "");
  });
});

describe("invitation prefill", () => {
  it("starts an empty invitation from the profile", () => {
    const out = prefillInvitation(invitationToForm(null), profile);
    assert.equal(out.groom.nameEn, "Vutha");
    assert.equal(out.bride.nameKh, "សុនីតា", "a Khmer name goes in the Khmer box");
    assert.equal(out.bride.nameEn, "");
    assert.equal(out.monogram, "V&ស");
    assert.equal(out.startsAt, "2027-01-07T17:00");
  });
  it("falls back to 09:00 when the ceremony time is not a clock time, and leaves the date empty without one", () => {
    assert.equal(prefillInvitation(invitationToForm(null), { ...profile, ceremony_time: "evening" }).startsAt, "2027-01-07T09:00");
    assert.equal(prefillInvitation(invitationToForm(null), { ...profile, wedding_date: null }).startsAt, "");
  });
  it("never overwrites what the couple already typed", () => {
    const typed = invitationToForm({ groom: { nameEn: "Mine" }, monogram: "XY", startsAt: "2030-05-05T10:00:00+07:00" });
    const out = prefillInvitation(typed, profile);
    assert.equal(out.groom.nameEn, "Mine");
    assert.equal(out.monogram, "XY");
    assert.equal(out.startsAt, typed.startsAt);
    assert.equal(out.bride.nameKh, "សុនីតា");
  });
  it("knows whether an invitation has any content", () => {
    assert.equal(hasInvitationContent(invitationToForm(null)), false);
    assert.equal(hasInvitationContent(invitationToForm({ greetingEn: "Welcome" })), true);
    assert.equal(hasInvitationContent(prefillInvitation(invitationToForm(null), profile)), true);
  });
});
