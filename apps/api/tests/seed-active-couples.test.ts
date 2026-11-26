import test from "node:test";
import assert from "node:assert/strict";
import { selectSeedTargets, validateSeedData } from "../src/utils/seed-targets.js";

const tables = new Map([["guests", { guest_id: { unique: true }, name: {} }]]);

test("targets only active couples that have a sheet, once per sheet", () => {
  const targets = selectSeedTargets([
    { couple_id: "1", slug: "a", status: "active", actor_sheet_id: "s1" },
    { couple_id: "2", slug: "b", status: "suspended", actor_sheet_id: "s2" },
    { couple_id: "3", slug: "c", status: "pending", actor_sheet_id: "s3" },
    { couple_id: "4", slug: "d", status: "rejected", actor_sheet_id: "s4" },
    { couple_id: "5", slug: "e", status: "active", actor_sheet_id: "" },
    { couple_id: "6", slug: "f", status: "active" },
    { couple_id: "7", slug: "g", status: "active", actor_sheet_id: "s1" },
  ]);
  assert.deepEqual(targets.map((t) => t.actorSheetId), ["s1"]);
});

test("accepts couple rows keyed by a unique column", () => {
  const data = { guests: [{ guest_id: "g1", name: "A" }] };
  assert.equal(validateSeedData(data, tables), data);
});

test("rejects admin tables, non-arrays, empty files and unsafe match keys", () => {
  assert.throws(() => validateSeedData({ themes: [] }, tables), /not a couple table/);
  assert.throws(() => validateSeedData({ guests: {} }, tables), /array/);
  assert.throws(() => validateSeedData({}, tables), /must export/);
  assert.throws(() => validateSeedData({ guests: [{ name: "A", guest_id: "g1" }] }, tables), /unique column/);
  assert.throws(() => validateSeedData({ guests: [{ guest_id: "" }] }, tables), /unique column/);
});
