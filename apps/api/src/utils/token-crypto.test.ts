import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createTokenBox } from "./token-crypto.js";

const k1 = randomBytes(32).toString("base64");
const k2 = randomBytes(32).toString("base64");

describe("token box", () => {
  it("round-trips and never stores the plain text", () => {
    const box = createTokenBox([k1]);
    const boxed = box.encrypt("1//refresh-token");
    assert.ok(!boxed.includes("refresh-token"));
    assert.equal(box.decrypt(boxed), "1//refresh-token");
  });

  it("uses a fresh IV each time", () => {
    const box = createTokenBox([k1]);
    assert.notEqual(box.encrypt("x"), box.encrypt("x"));
  });

  it("rejects tampered data and the wrong key", () => {
    const boxed = createTokenBox([k1]).encrypt("secret");
    const parts = boxed.split(".");
    parts[3] = Buffer.from("tampered").toString("base64");
    assert.throws(() => createTokenBox([k1]).decrypt(parts.join(".")));
    assert.throws(() => createTokenBox([k2]).decrypt(boxed));
  });

  it("decrypts old data after rotation but encrypts with the new key", () => {
    const old = createTokenBox([k1]).encrypt("secret");
    const rotated = createTokenBox([k2, k1]);
    assert.equal(rotated.decrypt(old), "secret");
    assert.throws(() => createTokenBox([k1]).decrypt(rotated.encrypt("secret")));
  });

  it("refuses a missing or short key", () => {
    assert.throws(() => createTokenBox([]));
    assert.throws(() => createTokenBox(["c2hvcnQ="]));
  });
});
