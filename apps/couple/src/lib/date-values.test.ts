import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { parseDateValue, toDateValue } from "@mongkolka/ui/date-picker";
import { joinDateTime, splitDateTime, TIME_SLOTS } from "@mongkolka/ui/date-time-picker";

describe("date picker values", () => {
  it("round-trips YYYY-MM-DD on the local calendar day, with no timezone shift", () => {
    for (const v of ["2027-01-07", "2024-02-29", "2026-12-31", "2026-01-01"]) assert.equal(toDateValue(parseDateValue(v)!), v);
  });
  it("accepts an ISO timestamp by its date part and rejects junk and impossible dates", () => {
    assert.equal(toDateValue(parseDateValue("2027-01-07T00:00:00.000Z")!), "2027-01-07");
    for (const bad of ["", null, undefined, "07/01/2027", "2027-02-31", "2027-13-01", "tomorrow"]) assert.equal(parseDateValue(bad as string), undefined, String(bad));
  });
});

describe("date and time values", () => {
  it("splits and joins a datetime-local value", () => {
    assert.deepEqual(splitDateTime("2026-05-29T17:00"), { date: "2026-05-29", time: "17:00" });
    assert.deepEqual(splitDateTime("2026-05-29"), { date: "2026-05-29", time: "" });
    assert.deepEqual(splitDateTime(""), { date: "", time: "" });
    assert.equal(joinDateTime("2026-05-29", "17:00"), "2026-05-29T17:00");
  });
  it("no date means no value; a date alone gets a default time", () => {
    assert.equal(joinDateTime("", "17:00"), "");
    assert.equal(joinDateTime("2026-05-29", ""), "2026-05-29T09:00");
  });
  it("offers every half hour of the day", () => {
    assert.equal(TIME_SLOTS.length, 48);
    assert.equal(TIME_SLOTS[0], "00:00");
    assert.equal(TIME_SLOTS[47], "23:30");
  });
});
