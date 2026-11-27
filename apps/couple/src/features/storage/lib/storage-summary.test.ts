import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { DriveConnection } from "../data/drive-api";
import { summarizeStorage } from "./storage-summary";

const drive = (over: Partial<DriveConnection>): DriveConnection => ({
  available: true,
  state: "not_connected",
  email: null,
  connectedAt: null,
  ...over,
});

describe("summarizeStorage counts", () => {
  it("shows unknown values while the list has not loaded", () => {
    const s = summarizeStorage({ sizes: null, maxImages: 100, drive: null });
    assert.equal(s.count, null);
    assert.equal(s.totalLabel, "—");
    assert.equal(s.percent, 0);
    assert.equal(s.level, "ok");
  });
  it("adds sizes and formats the total", () => {
    const s = summarizeStorage({ sizes: [1024 * 1024, 1024 * 1024 * 2], maxImages: 100, drive: null });
    assert.equal(s.count, 2);
    assert.equal(s.totalLabel, "3.0 MB");
    assert.equal(s.percent, 2);
  });
  it("shows an empty library as 0 B, not unknown", () => {
    const s = summarizeStorage({ sizes: [], maxImages: 100, drive: null });
    assert.equal(s.count, 0);
    assert.equal(s.totalLabel, "0 B");
  });
  it("ignores a size that is not a number instead of printing NaN", () => {
    const s = summarizeStorage({ sizes: [1024, Number.NaN], maxImages: 100, drive: null });
    assert.equal(s.totalLabel, "1 KB");
  });
});

describe("summarizeStorage level", () => {
  const sizes = (n: number) => Array.from({ length: n }, () => 1);
  it("is ok below 90%, near from 90%, full at the limit", () => {
    assert.equal(summarizeStorage({ sizes: sizes(89), maxImages: 100, drive: null }).level, "ok");
    assert.equal(summarizeStorage({ sizes: sizes(90), maxImages: 100, drive: null }).level, "near");
    assert.equal(summarizeStorage({ sizes: sizes(100), maxImages: 100, drive: null }).level, "full");
  });
  it("never shows 100% before the library is full", () => {
    const s = summarizeStorage({ sizes: sizes(199), maxImages: 200, drive: null });
    assert.equal(s.percent, 99);
    assert.equal(s.level, "near");
  });
  it("caps the bar at 100% and survives a zero limit", () => {
    assert.equal(summarizeStorage({ sizes: sizes(120), maxImages: 100, drive: null }).percent, 100);
    const s = summarizeStorage({ sizes: sizes(1), maxImages: 0, drive: null });
    assert.equal(s.max, 1);
    assert.equal(s.level, "full");
  });
});

describe("summarizeStorage where files live", () => {
  const where = (d: DriveConnection | null) => summarizeStorage({ sizes: [], maxImages: 100, drive: d }).where;
  it("is unknown until the connection loads", () => {
    assert.equal(where(null).title, "—");
  });
  it("says Mongkolka when not connected or when Drive is not offered", () => {
    assert.equal(where(drive({})).title, "Mongkolka");
    assert.match(where(drive({})).detail, /Connect Google Drive/);
    assert.doesNotMatch(where(drive({ available: false })).detail, /Connect/);
  });
  it("names the Google account when connected", () => {
    const w = where(drive({ state: "active", email: "a@b.com" }));
    assert.deepEqual([w.title, w.detail, w.tone], ["Google Drive", "a@b.com", "ok"]);
  });
  it("falls back to a generic line when connected without an email", () => {
    assert.equal(where(drive({ state: "active", email: null })).detail, "Your own account");
  });
  it("warns when Google stopped access", () => {
    const w = where(drive({ state: "needs_reconnect" }));
    assert.equal(w.tone, "warn");
    assert.match(w.detail, /Mongkolka/);
  });
});
