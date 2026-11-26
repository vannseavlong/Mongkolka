import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAssetLimits } from "../website-assets/website-assets.limits.js";
import { createPlatformSettingsCore, parseAssetLimitsInput, type SettingsStore } from "./platform-settings.core.js";

const MB = 1024 * 1024;
const defaults = buildAssetLimits({});

function setup(opts: { failReads?: boolean } = {}) {
  const data = new Map<string, string>();
  let reads = 0;
  let t = 0;
  const store: SettingsStore = {
    async get(k) {
      reads++;
      if (opts.failReads) throw new Error("sheets down");
      return data.get(k) ?? null;
    },
    async set(k, v) {
      data.set(k, v);
    },
  };
  const core = createPlatformSettingsCore({ store, defaults, ttlMs: 1000, now: () => t });
  return { core, data, tick: (ms: number) => (t += ms), reads: () => reads };
}

describe("parseAssetLimitsInput", () => {
  it("accepts numbers and null, ignores missing fields", () => {
    assert.deepEqual(parseAssetLimitsInput({ maxMb: 40, maxPerCouple: null }), { ok: true, patch: { maxMb: 40, maxPerCouple: null } });
  });
  it("rejects bad values and empty bodies", () => {
    for (const body of [{ maxMb: 0 }, { maxMb: 101 }, { maxMb: 1.5 }, { maxMb: "9" }, { maxDimension: 20000 }, {}, null, []]) {
      assert.equal(parseAssetLimitsInput(body).ok, false, JSON.stringify(body));
    }
  });
});

describe("platform settings core", () => {
  it("lets an admin change photo quality and resize, within range", async () => {
    const { core } = setup();
    assert.equal((await core.getAssetLimits()).webpQuality, 80);
    await core.updateAssetLimits({ webpQuality: 70, resizeTo: 1600 });
    const limits = await core.getAssetLimits();
    assert.equal(limits.webpQuality, 70);
    assert.equal(limits.resizeTo, 1600);
    for (const body of [{ webpQuality: 39 }, { webpQuality: 101 }, { resizeTo: 599 }, { resizeTo: 8001 }]) {
      assert.equal(parseAssetLimitsInput(body).ok, false, JSON.stringify(body));
    }
  });
  it("returns the env defaults when nothing is overridden", async () => {
    assert.deepEqual(await setup().core.getAssetLimits(), defaults);
  });
  it("applies an override and keeps the others at default", async () => {
    const { core } = setup();
    const view = await core.updateAssetLimits({ maxMb: 40 });
    assert.equal((await core.getAssetLimits()).maxBytes, 40 * MB);
    assert.equal((await core.getAssetLimits()).maxPerCouple, defaults.maxPerCouple);
    assert.deepEqual(view.overrides, { maxMb: 40 });
    assert.equal(view.defaults.maxMb, 8);
    assert.equal(view.effective.maxMb, 40);
  });
  it("clears an override with null and merges across updates", async () => {
    const { core } = setup();
    await core.updateAssetLimits({ maxMb: 40 });
    await core.updateAssetLimits({ maxPerCouple: 300 });
    assert.deepEqual((await core.getAssetLimitsView()).overrides, { maxMb: 40, maxPerCouple: 300 });
    await core.updateAssetLimits({ maxMb: null });
    assert.deepEqual((await core.getAssetLimitsView()).overrides, { maxPerCouple: 300 });
    assert.equal((await core.getAssetLimits()).maxBytes, 8 * MB);
  });
  it("caches reads until the ttl passes", async () => {
    const { core, tick, reads } = setup();
    await core.getAssetLimits();
    await core.getAssetLimits();
    assert.equal(reads(), 1);
    tick(1500);
    await core.getAssetLimits();
    assert.equal(reads(), 2);
  });
  it("falls back to defaults when the store fails, and never throws", async () => {
    assert.deepEqual(await setup({ failReads: true }).core.getAssetLimits(), defaults);
  });
  it("ignores corrupt stored values", async () => {
    const { core, data, tick } = setup();
    data.set("asset_limits", "{not json");
    assert.deepEqual(await core.getAssetLimits(), defaults);
    tick(2000);
    data.set("asset_limits", JSON.stringify({ maxMb: "big", maxDimension: 99999 }));
    assert.equal((await core.getAssetLimits()).maxDimension, 16383);
  });
});
