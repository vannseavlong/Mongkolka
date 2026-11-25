import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { toDriveConnection } from "./drive-api.js";

describe("toDriveConnection", () => {
  it("maps the API fields to the model", () => {
    const c = toDriveConnection({ enabled: true, status: "active", google_email: "a@b.c", connected_at: "2026-11-28T01:00:00Z" });
    assert.deepEqual([c.available, c.state, c.email], [true, "active", "a@b.c"]);
    assert.equal(c.connectedAt?.toISOString(), "2026-11-28T01:00:00.000Z");
  });
  it("tolerates a missing or bad date", () => {
    assert.equal(toDriveConnection({ enabled: true, status: "not_connected", google_email: null, connected_at: null }).connectedAt, null);
    assert.equal(toDriveConnection({ enabled: true, status: "active", google_email: null, connected_at: "nope" }).connectedAt, null);
  });
});
