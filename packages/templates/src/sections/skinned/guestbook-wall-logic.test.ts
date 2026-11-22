import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { GuestbookData } from "../../types";
import { aspectFor, buildWall, firstInvalid, formErrors } from "./guestbook-wall-logic";

const data: GuestbookData = {
  photos: [
    { photo_id: "p1", url: "https://x/1.jpg", uploader_name: "Dara" },
    { photo_id: "p2", url: "https://x/2.jpg", uploader_name: null },
    { photo_id: "p3", url: "https://x/3.jpg", uploader_name: "Mey" },
  ],
  wishes: [
    { wish_id: "w1", name: "Sok", message: "Congrats", photo_id: "p1" },
    { wish_id: "w2", name: "Vira", message: "Be happy", photo_id: null },
    { wish_id: "w3", name: "Lina", message: null, photo_id: "missing" },
  ],
};

describe("buildWall", () => {
  it("lists wishes first, each with its own photo, then photos nobody attached a wish to", () => {
    const wall = buildWall(data);
    assert.deepEqual(wall.map((i) => i.key), ["w-w1", "w-w2", "w-w3", "p-p2", "p-p3"]);
    const first = wall[0]!;
    assert.equal(first.kind === "wish" && first.photo?.photo_id, "p1");
  });
  it("never shows a photo twice and ignores a wish pointing at a missing photo", () => {
    const wall = buildWall(data);
    const ids = wall.map((i) => (i.photo ? i.photo.photo_id : null)).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length);
    const w3 = wall.find((i) => i.key === "w-w3");
    assert.equal(w3 && w3.kind === "wish" && w3.photo, undefined);
  });
  it("is empty for no data", () => {
    assert.deepEqual(buildWall(undefined), []);
    assert.deepEqual(buildWall({ photos: [], wishes: [] }), []);
  });
});

describe("aspectFor", () => {
  it("depends only on the id", () => {
    assert.equal(aspectFor("abc"), aspectFor("abc"));
    assert.match(aspectFor("w-9"), /^aspect-/);
  });
});

describe("form validation", () => {
  it("shows errors only after the first attempt", () => {
    const empty = { name: "", message: "", hasPhoto: false };
    assert.deepEqual(formErrors(empty, false), { name: false, empty: false });
    assert.deepEqual(formErrors(empty, true), { name: true, empty: true });
  });
  it("accepts a photo or a wish on its own, but always needs a name", () => {
    assert.deepEqual(formErrors({ name: "A", message: "", hasPhoto: true }, true), { name: false, empty: false });
    assert.deepEqual(formErrors({ name: "A", message: "hi", hasPhoto: false }, true), { name: false, empty: false });
    assert.deepEqual(formErrors({ name: "  ", message: "hi", hasPhoto: false }, true), { name: true, empty: false });
  });
  it("sends focus to the first field that needs attention", () => {
    assert.equal(firstInvalid({ name: "", message: "", hasPhoto: false }), "name");
    assert.equal(firstInvalid({ name: "A", message: " ", hasPhoto: false }), "wish");
    assert.equal(firstInvalid({ name: "A", message: "", hasPhoto: true }), null);
  });
});
