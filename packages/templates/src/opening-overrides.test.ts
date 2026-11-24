import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { applyOpeningOverrides } from "./opening-overrides";
import type { CoupleInfo, DetailsContent } from "./types";

const couple: CoupleInfo = { partner1Name: "Sok", partner1NameKh: "សុខ", partner2Name: "Dara", weddingDate: "2027-01-07" };
const details: DetailsContent = { ceremonyTime: "9:00", ceremonyVenue: "Hall A", ceremonyAddress: "Phnom Penh" };

describe("opening overrides", () => {
  it("changes nothing when there is no content or it is empty", () => {
    assert.deepEqual(applyOpeningOverrides(couple, details, undefined), { couple, details });
    const out = applyOpeningOverrides(couple, details, { name1En: "  ", date: "" });
    assert.equal(out.couple.partner1Name, "Sok");
    assert.equal(out.couple.partner1NameKh, "សុខ");
    assert.equal(out.couple.weddingDate, "2027-01-07");
    assert.equal(out.details, details);
  });
  it("uses typed names, date, time and venue over the profile", () => {
    const out = applyOpeningOverrides(couple, details, { name1En: "Vutha", name1Kh: "វុធ្ថា", name2En: "Sonita", date: "2028-02-02", time: "5:00 PM", venue: "Sen Sok City" });
    assert.equal(out.couple.partner1Name, "Vutha");
    assert.equal(out.couple.partner1NameKh, "វុធ្ថា");
    assert.equal(out.couple.partner2Name, "Sonita");
    assert.equal(out.couple.weddingDate, "2028-02-02");
    assert.equal(out.details?.ceremonyTime, "5:00 PM");
    assert.equal(out.details?.ceremonyVenue, "Sen Sok City");
    assert.equal(out.details?.ceremonyAddress, undefined, "the profile address is dropped when a venue is typed");
  });
  it("a name typed only in English replaces the profile's stale Khmer spelling", () => {
    assert.equal(applyOpeningOverrides(couple, details, { name1En: "Vutha" }).couple.partner1NameKh, undefined);
  });
  it("a name typed only in Khmer is used for English too, so nothing is blank", () => {
    assert.equal(applyOpeningOverrides(couple, details, { name2Kh: "ដារ៉ា" }).couple.partner2Name, "ដារ៉ា");
  });
  it("keeps the profile's venue when only the time is typed", () => {
    const out = applyOpeningOverrides(couple, details, { time: "6:00 PM" });
    assert.equal(out.details?.ceremonyVenue, "Hall A");
    assert.equal(out.details?.ceremonyTime, "6:00 PM");
  });
  it("works when the profile has no details at all", () => {
    assert.deepEqual(applyOpeningOverrides(couple, undefined, { venue: "Hall B" }).details, { ceremonyVenue: "Hall B", ceremonyAddress: undefined });
  });
});
