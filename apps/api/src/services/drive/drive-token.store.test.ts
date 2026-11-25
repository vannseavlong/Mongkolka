import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createTokenBox } from "../../utils/token-crypto.js";
import { DriveNotConnectedError, isNotFound, isRevokedGrant } from "./drive-errors.js";
import { createDriveTokenStore, driveActorId } from "./drive-token.store.js";

const box = createTokenBox([randomBytes(32).toString("base64")]);
const rows: Record<string, { status: string; refresh_token_enc: string }> = {
  ok: { status: "active", refresh_token_enc: box.encrypt("1//good") },
  stale: { status: "needs_reconnect", refresh_token_enc: box.encrypt("1//old") },
};
const store = createDriveTokenStore({ find: async (id) => rows[id] ?? null, box });

describe("drive token store", () => {
  it("returns the decrypted refresh token for an active connection", async () => {
    assert.deepEqual(await store.get(driveActorId("ok")), { refresh_token: "1//good" });
  });

  it("throws instead of returning null, so lsdb can never fall back to the admin Drive", async () => {
    await assert.rejects(store.get(driveActorId("missing")), DriveNotConnectedError);
    await assert.rejects(store.get(driveActorId("stale")), DriveNotConnectedError);
  });

  it("stays out of the way for ordinary user ids", async () => {
    assert.equal(await store.get("user_123"), null);
  });
});

describe("drive errors", () => {
  it("recognises a revoked grant", () => {
    assert.ok(isRevokedGrant(new Error("invalid_grant")));
    assert.ok(isRevokedGrant({ response: { data: { error: "invalid_grant" } } }));
    assert.ok(isRevokedGrant(new DriveNotConnectedError("c")));
    assert.ok(!isRevokedGrant(new Error("rate limit exceeded")));
  });
  it("recognises a missing file", () => {
    assert.ok(isNotFound({ code: 404 }));
    assert.ok(!isNotFound({ code: 403 }));
  });
});
