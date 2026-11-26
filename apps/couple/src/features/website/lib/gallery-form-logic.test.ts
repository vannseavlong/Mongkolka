import { test } from "node:test";
import assert from "node:assert/strict";
import { photoName, stackFromForm, stackToForm } from "./gallery-form-logic";

test("photoName: path, full address, query and encoding", () => {
  assert.equal(photoName("/uploads/couples/vutha-nita/IMG_0012.jpg"), "IMG_0012.jpg");
  assert.equal(photoName("https://mongkolka-api.onrender.com/uploads/a/b.webp?x=1"), "b.webp");
  assert.equal(photoName("/uploads/a/my%20photo.jpg"), "my photo.jpg");
});
test("stack round trip keeps layout and count, drops empty and unknown", () => {
  const rows = stackToForm([{ layout: "gallery_masonry", count: 4 }, { layout: "gallery_carousel" }, { layout: "other" }]);
  assert.deepEqual(rows, [{ layout: "gallery_masonry", count: "4" }, { layout: "gallery_carousel", count: "" }]);
  assert.deepEqual(stackFromForm(rows), [{ layout: "gallery_masonry", count: 4 }, { layout: "gallery_carousel" }]);
});
test("stackFromForm: no rows means no stack", () => {
  assert.equal(stackFromForm([]), undefined);
});

import { isPhotoLink } from "./gallery-form-logic";
test("isPhotoLink accepts https and own paths only", () => {
  assert.ok(isPhotoLink("https://x.com/a.jpg"));
  assert.ok(isPhotoLink("/uploads/couples/a.jpg"));
  assert.ok(!isPhotoLink("hello"));
  assert.ok(!isPhotoLink("http://x.com/a.jpg"));
});
