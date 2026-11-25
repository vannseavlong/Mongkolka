import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createTokenBox } from "../../utils/token-crypto.js";
import { createCoupleDriveCore, DRIVE_SCOPES, type ConnectionRow, type DriveModel } from "./couple-drive.core.js";

const SCOPE = `${DRIVE_SCOPES[0]} openid email`;

function setup(exchange: () => Promise<{ refreshToken?: string; email?: string; scope?: string }> = async () => ({ refreshToken: "1//rt", email: "a@b.c", scope: SCOPE })) {
  const rows = new Map<string, ConnectionRow>();
  const log = { changed: [] as string[], revoked: [] as string[] };
  const model: DriveModel = {
    async find(id) { return rows.get(id) ?? null; },
    async upsert(id, d) { rows.set(id, { couple_id: id, status: "active", _created_at: "2026-11-25", ...d }); },
    async setStatus(id, status) { const r = rows.get(id); if (r) r.status = status; },
    async remove(id) { rows.delete(id); },
  };
  const box = createTokenBox([randomBytes(32).toString("base64")]);
  const core = createCoupleDriveCore({
    model, box,
    oauth: { authUrl: (s) => `https://google.test/auth?state=${s}`, exchange, async revoke(t) { log.revoked.push(t); } },
    signState: (id) => `state-for-${id}`,
    verifyState: (s) => (s.startsWith("state-for-") ? s.slice("state-for-".length) : null),
    onChange: (id) => log.changed.push(id),
  });
  return { core, rows, log };
}

describe("couple drive core", () => {
  it("starts unconnected and builds a consent URL carrying the signed state", async () => {
    const { core } = setup();
    assert.equal((await core.status("c1")).status, "not_connected");
    assert.equal(core.startConnect("c1").url, "https://google.test/auth?state=state-for-c1");
  });

  it("connects, stores only an encrypted token, and drops cached clients", async () => {
    const { core, rows, log } = setup();
    assert.deepEqual(await core.finishConnect("code", "state-for-c1"), { ok: true, coupleId: "c1" });
    const row = rows.get("c1")!;
    assert.ok(!row.refresh_token_enc.includes("1//rt"));
    assert.deepEqual(log.changed, ["c1"]);
    const status = await core.status("c1");
    assert.deepEqual(status, { status: "active", google_email: "a@b.c", connected_at: "2026-11-25" });
    assert.ok(!JSON.stringify(status).includes("1//rt") && !JSON.stringify(status).includes(row.refresh_token_enc));
  });

  it("rejects a bad state, an exchange failure, a missing drive scope and a missing refresh token", async () => {
    assert.deepEqual(await setup().core.finishConnect("code", "forged"), { ok: false, error: "invalid_state" });
    const failing = setup(async () => { throw new Error("bad code"); });
    assert.deepEqual(await failing.core.finishConnect("c", "state-for-c1"), { ok: false, error: "exchange_failed" });
    const noScope = setup(async () => ({ refreshToken: "x", scope: "openid email" }));
    assert.deepEqual(await noScope.core.finishConnect("c", "state-for-c1"), { ok: false, error: "scope_missing" });
    assert.equal(noScope.rows.size, 0);
    const noRefresh = setup(async () => ({ scope: SCOPE }));
    assert.deepEqual(await noRefresh.core.finishConnect("c", "state-for-c1"), { ok: false, error: "no_refresh_token" });
  });

  it("reports needs_reconnect, and reconnecting makes it active again", async () => {
    const { core } = setup();
    await core.finishConnect("code", "state-for-c1");
    await core.markNeedsReconnect("c1", "revoked");
    assert.equal((await core.status("c1")).status, "needs_reconnect");
    await core.finishConnect("code", "state-for-c1");
    assert.equal((await core.status("c1")).status, "active");
  });

  it("disconnect removes the row, revokes the decrypted token and drops caches", async () => {
    const { core, rows, log } = setup();
    await core.finishConnect("code", "state-for-c1");
    await core.disconnect("c1");
    assert.equal(rows.size, 0);
    assert.deepEqual(log.revoked, ["1//rt"]);
    assert.equal(log.changed.length, 2);
    await core.disconnect("c1"); // already gone: no error
  });
});
