import { test } from "node:test";
import assert from "node:assert/strict";
import { accountNumberDigits, copyText, safeImageUrl, toGiftView } from "./khqr-gift-logic";

test("toGiftView: nothing to show returns null", () => {
  assert.equal(toGiftView(undefined), null);
  assert.equal(toGiftView({ links: [] }), null);
  assert.equal(toGiftView({ links: [], bank: "ABA" }), null);
});

test("toGiftView: trims, keeps display grouping, copies digits only", () => {
  const v = toGiftView({ links: [], bank: " ABA ", accountName: " Sun Chantha ", accountNumber: " 000 123-456 " });
  assert.deepEqual(v, {
    imageUrl: undefined,
    bank: "ABA",
    accountName: "Sun Chantha",
    accountNumberDisplay: "000 123-456",
    accountNumberCopy: "000123456",
  });
});

test("toGiftView: an image alone is enough", () => {
  assert.equal(toGiftView({ links: [], khqrImageUrl: "https://x.test/q.png" })?.imageUrl, "https://x.test/q.png");
});

test("safeImageUrl: blocks script and protocol-relative urls", () => {
  assert.equal(safeImageUrl("javascript:alert(1)"), undefined);
  assert.equal(safeImageUrl("//evil.test/a.png"), undefined);
  assert.equal(safeImageUrl("http://x.test/a.png"), undefined);
  assert.equal(safeImageUrl("data:text/html;base64,AAAA"), undefined);
  assert.equal(safeImageUrl("/uploads/qr.png"), "/uploads/qr.png");
  assert.equal(safeImageUrl("HTTPS://x.test/a.png"), "HTTPS://x.test/a.png");
});

test("accountNumberDigits strips spaces and hyphens", () => {
  assert.equal(accountNumberDigits("1 2-3  4"), "1234");
});

test("copyText: async clipboard, legacy fallback, failure", async () => {
  let got = "";
  assert.equal(await copyText("123", { writeText: async (t) => void (got = t) }), "copied");
  assert.equal(got, "123");
  assert.equal(await copyText("1", { writeText: async () => Promise.reject(new Error("no")), legacyCopy: () => true }), "copied");
  assert.equal(await copyText("1", { writeText: async () => Promise.reject(new Error("no")) }), "failed");
  assert.equal(await copyText("1", { legacyCopy: () => { throw new Error("x"); } }), "failed");
});
