import assert from "node:assert/strict";
import { test } from "node:test";
import { GALLERY_PREVIEW, hiddenCount, mosaicCell, mosaicGrid, visibleCount } from "./gallery-logic";

test("gallery: preview cap, expand, hidden count", () => {
  assert.equal(visibleCount(5, false), 5);
  assert.equal(visibleCount(20, false), GALLERY_PREVIEW);
  assert.equal(visibleCount(20, true), 20);
  assert.equal(hiddenCount(20, false), 20 - GALLERY_PREVIEW);
  assert.equal(hiddenCount(20, true), 0);
});

test("gallery: small sets stay a calm grid, big sets get a feature tile", () => {
  assert.match(mosaicGrid(3), /grid-cols-2/);
  assert.equal(mosaicCell(0, 3), "aspect-[4/5]");
  assert.equal(mosaicCell(0, 9), "col-span-2 row-span-2");
  assert.equal(mosaicCell(7, 9), "col-span-2");
  assert.equal(mosaicCell(1, 9), "");
});
