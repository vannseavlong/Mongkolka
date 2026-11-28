import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { toAssistRequest } from "../data/schema";
import { actionsFor, countLabel, currentStatus, isSafeEditorUrl, reasonError, timeLeft } from "./assist-rules";
import { openInNewTab, type EditorTab } from "./open-editor";
import { toRequestRow } from "./request-rows";

const NOW = new Date("2026-11-27T10:00:00.000Z");
const approved = (expiresAt: string | null) => ({ status: "approved" as const, expiresAt });
const live = approved("2026-12-01T10:00:00.000Z");

describe("status and actions", () => {
  it("treats an approval that ran out, or has no readable expiry, as expired", () => {
    for (const end of ["2026-11-27T10:00:00.000Z", null, "soon"]) {
      assert.equal(currentStatus(approved(end), NOW), "expired");
      assert.deepEqual(actionsFor(approved(end), NOW), { accept: false, decline: false, openEditor: false, revoke: false });
    }
  });
  it("offers accept and decline only while pending", () => {
    assert.deepEqual(actionsFor({ status: "pending", expiresAt: null }, NOW), { accept: true, decline: true, openEditor: false, revoke: false });
  });
  it("offers the editor and ending access only while approved and live", () => {
    assert.deepEqual(actionsFor(live, NOW), { accept: false, decline: false, openEditor: true, revoke: true });
    for (const status of ["declined", "revoked", "cancelled", "expired"] as const) {
      assert.equal(actionsFor({ status, expiresAt: live.expiresAt }, NOW).openEditor, false);
    }
  });
});

describe("words", () => {
  it("rounds the time left down", () => {
    assert.equal(timeLeft("2026-12-04T09:00:00.000Z", NOW), "6 days left");
    assert.equal(timeLeft("2026-11-28T10:00:00.000Z", NOW), "1 day left");
    assert.equal(timeLeft("2026-11-27T11:30:00.000Z", NOW), "1 hour left");
    assert.equal(timeLeft("2026-11-27T10:20:00.000Z", NOW), "less than an hour left");
    assert.equal(timeLeft("2026-11-27T09:00:00.000Z", NOW), "");
  });
  it("needs a decline reason of 1 to 300 characters, ignoring outer spaces", () => {
    assert.ok(reasonError("   "));
    assert.ok(reasonError("a".repeat(301)));
    assert.equal(reasonError(` ${"a".repeat(300)} `), null);
  });
  it("labels the pending count", () => {
    assert.equal(countLabel(0, false), undefined);
    assert.equal(countLabel(3, false), "3");
    assert.equal(countLabel(50, true), "50+");
  });
});

describe("editor link", () => {
  it("accepts a fragment token on https, or http on this machine", () => {
    assert.equal(isSafeEditorUrl("https://couple-mongkolka.web.app/dashboard#assist=abc"), true);
    assert.equal(isSafeEditorUrl("http://localhost:3002/dashboard#assist=abc"), true);
  });
  it("refuses a token in the query, other schemes and plain http", () => {
    for (const url of [
      "https://x.test/dashboard?assist=abc",
      "https://x.test/dashboard?t=1#assist=abc",
      "https://u:p@x.test/#assist=abc",
      "http://x.test/#assist=abc",
      "javascript:alert(1)#assist=abc",
      "https://x.test/dashboard#assist=",
      "/dashboard#assist=abc",
      "",
    ]) assert.equal(isSafeEditorUrl(url), false, url);
  });
});

function fakeTab() {
  const seen = { url: "", closed: false };
  const tab: EditorTab = { opener: {}, location: { replace: (url) => (seen.url = url) }, close: () => (seen.closed = true) };
  return { tab, seen };
}

describe("openInNewTab", () => {
  const good = "https://x.test/dashboard#assist=abc";
  it("asks for no session when the browser blocks the tab", async () => {
    let asked = false;
    const outcome = await openInNewTab(() => null, async () => ((asked = true), good));
    assert.equal(outcome, "blocked");
    assert.equal(asked, false);
  });
  it("cuts the opener before sending the tab to the editor", async () => {
    const { tab, seen } = fakeTab();
    assert.equal(await openInNewTab(() => tab, async () => good), "opened");
    assert.equal(tab.opener, null);
    assert.equal(seen.url, good);
  });
  it("closes the tab on an unsafe link or a failed call", async () => {
    const unsafe = fakeTab();
    assert.equal(await openInNewTab(() => unsafe.tab, async () => "https://x.test/?token=abc"), "unsafe");
    assert.deepEqual(unsafe.seen, { url: "", closed: true });
    const failed = fakeTab();
    await assert.rejects(openInNewTab(() => failed.tab, async () => { throw new Error("409"); }), /409/);
    assert.equal(failed.seen.closed, true);
  });
});

describe("toAssistRequest", () => {
  it("maps the API row", () => {
    const mapped = toAssistRequest({
      request_id: "r1", couple_id: "c1", couple_name: "A & B", note: "help", status: "pending",
      requested_at: NOW.toISOString(), decided_at: null, decline_reason: null, expires_at: null, revoked_at: null,
    });
    assert.equal(mapped.id, "r1");
    assert.equal(mapped.coupleName, "A & B");
    assert.equal(mapped.requestedAt, NOW.toISOString());
  });
});

describe("toRequestRow", () => {
  const base = {
    id: "r1", coupleName: "A & B", note: "help", requestedAt: NOW.toISOString(), decidedAt: null,
    declineReason: null, expiresAt: "2026-12-01T10:00:00.000Z", revokedAt: null,
  };
  it("shows when live access ends and how long is left", () => {
    const row = toRequestRow({ ...base, status: "approved" }, NOW);
    assert.deepEqual([row.status, row.accessEndsAt, row.accessLeft], ["approved", base.expiresAt, "4 days left"]);
  });
  it("turns a run-out approval into expired, so the status filter finds it", () => {
    const row = toRequestRow({ ...base, status: "approved" }, new Date("2026-12-02T00:00:00.000Z"));
    assert.deepEqual([row.status, row.accessEndsAt, row.accessLeft], ["expired", base.expiresAt, ""]);
  });
  it("uses the revoke time for revoked access, and no date when access never started", () => {
    const revokedAt = "2026-11-27T09:00:00.000Z";
    assert.equal(toRequestRow({ ...base, status: "revoked", revokedAt }, NOW).accessEndsAt, revokedAt);
    for (const status of ["pending", "declined", "cancelled"] as const) {
      assert.equal(toRequestRow({ ...base, status }, NOW).accessEndsAt, null);
    }
  });
});
