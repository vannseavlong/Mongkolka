import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { driveResultMessage } from "./drive-result.js";

describe("driveResultMessage", () => {
  it("returns nothing when the page was opened normally", () => {
    assert.equal(driveResultMessage(null), null);
  });
  it("marks a successful connection as success and everything else as an error", () => {
    assert.equal(driveResultMessage("connected")?.kind, "success");
    for (const code of ["denied", "scope_missing", "no_refresh_token", "invalid_state", "drive_not_configured"]) {
      assert.equal(driveResultMessage(code)?.kind, "error", code);
    }
  });
  it("never shows a raw or unknown code to the couple", () => {
    const m = driveResultMessage("exchange_failed");
    assert.equal(m?.kind, "error");
    assert.ok(!m?.text.includes("exchange_failed"));
  });
});
