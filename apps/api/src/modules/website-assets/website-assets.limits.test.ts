import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ASSET_CEILINGS, buildAssetLimits } from "./website-assets.limits.js";

describe("buildAssetLimits", () => {
  it("uses defaults when unset or blank", () => {
    assert.deepEqual(buildAssetLimits({}), { maxPerCouple: 100, maxBytes: 8 * 1024 * 1024, maxDimension: 12000, webpQuality: 80, resizeTo: 2048 });
    assert.equal(buildAssetLimits({ ASSET_MAX_MB: "  " }).maxBytes, 8 * 1024 * 1024);
  });
  it("reads values from config", () => {
    const l = buildAssetLimits({ ASSET_MAX_MB: "30", ASSET_MAX_PER_COUPLE: "250", ASSET_MAX_DIMENSION: "9000" });
    assert.deepEqual(l, { maxPerCouple: 250, maxBytes: 30 * 1024 * 1024, maxDimension: 9000, webpQuality: 80, resizeTo: 2048 });
  });
  it("ignores junk and clamps to ceilings", () => {
    assert.equal(buildAssetLimits({ ASSET_MAX_MB: "abc" }).maxBytes, 8 * 1024 * 1024);
    assert.equal(buildAssetLimits({ ASSET_MAX_MB: "9999" }).maxBytes, ASSET_CEILINGS.maxMb * 1024 * 1024);
    assert.equal(buildAssetLimits({ ASSET_MAX_MB: "0" }).maxBytes, 1024 * 1024);
    assert.equal(buildAssetLimits({ ASSET_MAX_DIMENSION: "99999" }).maxDimension, ASSET_CEILINGS.maxDimension);
  });
});
