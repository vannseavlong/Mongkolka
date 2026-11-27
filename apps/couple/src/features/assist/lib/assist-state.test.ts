import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { Assist, AssistActivity, AssistRequest, AssistStatus } from "../data/assist-api";
import { toAssist } from "../data/assist-api";
import { activityText, areaOf, assistView, canAsk, noteError, timeLeft } from "./assist-state";

const NOW = new Date("2026-12-01T10:00:00.000Z");
const at = (ms: number) => new Date(NOW.getTime() + ms);
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function req(status: AssistStatus, over: Partial<AssistRequest> = {}): Assist {
  return {
    request: { id: "r1", note: "help please", status, requestedAt: NOW, expiresAt: null, declineReason: null, ...over },
    activity: [],
  };
}

describe("assistView", () => {
  it("is none without a request", () => {
    assert.equal(assistView(null, NOW).kind, "none");
    assert.equal(assistView({ request: null, activity: [] }, NOW).kind, "none");
  });
  it("shows pending as is", () => {
    assert.equal(assistView(req("pending"), NOW).kind, "pending");
  });
  it("shows a live approval with the time left", () => {
    const v = assistView(req("approved", { expiresAt: at(3 * DAY + HOUR) }), NOW);
    assert.equal(v.kind, "approved");
    if (v.kind === "approved") assert.equal(v.left, "3 days");
  });
  it("treats an approval whose time ran out while the page was open as expired", () => {
    const v = assistView(req("approved", { expiresAt: at(-1) }), NOW);
    assert.deepEqual([v.kind, v.kind === "ended" && v.why], ["ended", "expired"]);
  });
  it("fails closed: an approval with no expiry is not shown as live", () => {
    assert.equal(assistView(req("approved", { expiresAt: null }), NOW).kind, "ended");
  });
  it("carries the decline reason, and maps revoked, cancelled and expired to ended", () => {
    const d = assistView(req("declined", { declineReason: "Out of scope" }), NOW);
    assert.ok(d.kind === "declined" && d.reason === "Out of scope");
    for (const s of ["revoked", "cancelled", "expired"] as const) {
      const v = assistView(req(s), NOW);
      assert.ok(v.kind === "ended" && v.why === s, s);
    }
  });
});

describe("canAsk", () => {
  it("allows a new request only when none is open", () => {
    for (const [status, asks] of [["pending", false], ["approved", false], ["declined", true], ["revoked", true], ["cancelled", true]] as const) {
      const exp = status === "approved" ? at(DAY) : null;
      assert.equal(canAsk(assistView(req(status, { expiresAt: exp }), NOW)), asks, status);
    }
    assert.equal(canAsk(assistView(null, NOW)), true);
  });
});

describe("timeLeft", () => {
  it("rounds down so it never promises more time than there is", () => {
    assert.equal(timeLeft(at(7 * DAY - 1), NOW), "6 days");
    assert.equal(timeLeft(at(DAY), NOW), "1 day");
    assert.equal(timeLeft(at(DAY - 1), NOW), "23 hours");
    assert.equal(timeLeft(at(HOUR), NOW), "1 hour");
    assert.equal(timeLeft(at(HOUR - 1), NOW), "under an hour");
    assert.equal(timeLeft(at(-5), NOW), "under an hour");
  });
});

describe("noteError", () => {
  it("counts trimmed characters", () => {
    assert.ok(noteError("     hi     "));
    assert.equal(noteError("  hello  "), null);
    assert.equal(noteError("x".repeat(500)), null);
    assert.ok(noteError("x".repeat(501)));
    assert.ok(noteError(""));
  });
});

describe("activityText", () => {
  const row = (action: string, by: "couple" | "admin", path: string | null = null): AssistActivity => ({ at: NOW, by, action, path });
  it("says who ended access", () => {
    assert.equal(activityText(row("revoked", "couple")), "You ended Mongkolka's access");
    assert.equal(activityText(row("revoked", "admin")), "Mongkolka ended its access");
  });
  it("names the area an edit touched, never the URL", () => {
    assert.equal(activityText(row("edit", "admin", "/couple/api/website/assets/abc")), "Mongkolka changed your photos");
    assert.equal(activityText(row("edit", "admin", "/couple/api/website/sections/1")), "Mongkolka changed your website");
    assert.equal(areaOf("/couple/api/profile"), "your profile");
    assert.equal(areaOf("/couple/api/unknown"), "your site");
    assert.equal(areaOf(null), "your site");
  });
  it("has a plain sentence for every action the API logs", () => {
    assert.equal(activityText(row("requested", "couple")), "You asked Mongkolka for help");
    assert.equal(activityText(row("cancelled", "couple")), "You cancelled the request");
    assert.equal(activityText(row("accepted", "admin")), "Mongkolka accepted your request");
    assert.equal(activityText(row("declined", "admin")), "Mongkolka declined your request");
    assert.equal(activityText(row("open", "admin")), "Mongkolka opened your site editor");
    assert.equal(activityText(row("edit", "admin", null)), "Mongkolka changed your site");
  });
  it("has wording for the later audit actions: viewed, blocked, recorded late", () => {
    assert.equal(activityText(row("view", "admin", "/couple/api/guests")), "Mongkolka looked at your guest list");
    assert.equal(activityText(row("view", "admin", "/couple/api/wishes")), "Mongkolka looked at your guests' wishes");
    assert.match(activityText(row("blocked", "admin", "/couple/api/members/invite")), /stopped/);
    assert.equal(activityText(row("reconciled", "admin")), "An earlier update was recorded late");
  });
  it("has a sentence for an action it does not know", () => {
    assert.equal(activityText(row("something-new", "admin")), "Mongkolka made an update");
  });
});

describe("toAssist", () => {
  it("maps the API shape, dropping rows with an unreadable time", () => {
    const m = toAssist({
      request: { request_id: "r1", note: "n", status: "approved", requested_at: "2026-12-01T10:00:00Z", decided_at: null, decline_reason: "", expires_at: "garbage", revoked_at: null },
      activity: [
        { at: "2026-12-01T10:00:00Z", actor_role: "admin", action: "accepted", method: null, path: null },
        { at: "nope", actor_role: "admin", action: "open", method: null, path: null },
      ],
    });
    assert.equal(m.request?.expiresAt, null);
    assert.equal(m.request?.declineReason, null);
    assert.equal(m.activity.length, 1);
  });
  it("keeps a decline reason and maps a missing request", () => {
    const m = toAssist({
      request: { request_id: "r1", note: "n", status: "declined", requested_at: "2026-12-01T10:00:00Z", decided_at: null, decline_reason: "Fully booked", expires_at: null, revoked_at: null },
      activity: [],
    });
    assert.equal(m.request?.declineReason, "Fully booked");
    assert.equal(toAssist({ request: null, activity: [] }).request, null);
  });
});
