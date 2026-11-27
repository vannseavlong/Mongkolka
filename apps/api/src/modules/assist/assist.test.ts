import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ASSIST_DAYS, effectiveStatus, isLive, plan, validateNote, validateReason, type AssistRow } from "./assist.core.js";
import { createAssistRateLimit, requirePartner } from "./assist.guard.js";
import { createAssistService, type AssistModelPort } from "./assist.service.js";

const T0 = new Date("2026-12-01T10:00:00.000Z");
const later = (ms: number) => new Date(T0.getTime() + ms);
const DAY = 24 * 60 * 60 * 1000;

function memoryModel(couples: Record<string, { status: string }> = { c1: { status: "active" }, c2: { status: "active" } }) {
  const rows: AssistRow[] = [];
  const logs: Record<string, unknown>[] = [];
  const model = {
    listByCouple: async (id: string) => rows.filter((r) => r.couple_id === id),
    list: async () => [...rows],
    findById: async (id: string) => rows.find((r) => r.request_id === id) ?? null,
    create: async (r: Record<string, unknown>) => void rows.push({ ...(r as unknown as AssistRow) }),
    update: async (id: string, d: Record<string, unknown>) => void Object.assign(rows.find((r) => r.request_id === id)!, d),
    appendLog: async (r: Record<string, unknown>) => void logs.push(r),
    logByCouple: async (id: string) => logs.filter((l) => l.couple_id === id) as never,
    findCouple: async (id: string) => (couples[id] ? { couple_id: id, ...couples[id] } : null),
    listCouples: async () => Object.entries(couples).map(([couple_id, c]) => ({ couple_id, slug: couple_id, ...c })),
  } as unknown as AssistModelPort;
  return { model, rows, logs };
}
const NOTE = "Please help me add my photos";

describe("assist core", () => {
  it("validates the note length and trims it", () => {
    assert.equal(validateNote("   hi  ").ok, false);
    assert.equal(validateNote(undefined).ok, false);
    assert.equal(validateNote("x".repeat(501)).ok, false);
    const ok = validateNote("  Help me please  ");
    assert.ok(ok.ok && ok.value === "Help me please");
  });
  it("requires a decline reason", () => {
    assert.equal(validateReason("  ").ok, false);
    assert.equal(validateReason("x".repeat(301)).ok, false);
    assert.equal(validateReason("Not now").ok, true);
  });
  it("derives expired from expires_at and never for other states", () => {
    const base = { expires_at: later(DAY).toISOString() };
    assert.equal(effectiveStatus({ status: "approved", ...base }, T0), "approved");
    assert.equal(effectiveStatus({ status: "approved", ...base }, later(DAY)), "expired", "expiry instant is already expired");
    assert.equal(effectiveStatus({ status: "revoked", ...base }, later(2 * DAY)), "revoked");
  });
  it("fails closed: an approval with no readable expiry is expired, never live", () => {
    for (const expires_at of [null, undefined, "", "not a date"]) {
      assert.equal(effectiveStatus({ status: "approved", expires_at }, T0), "expired", String(expires_at));
    }
    assert.equal(isLive({ status: "approved", expires_at: null } as AssistRow, T0), false);
  });
  it("plans every transition: apply, repeat or conflict", () => {
    const row = (status: string, expires_at?: string) => ({ status, expires_at }) as AssistRow;
    assert.deepEqual(plan("accept", row("pending"), T0), { ok: true, value: "apply" });
    assert.deepEqual(plan("accept", row("approved", later(DAY).toISOString()), T0), { ok: true, value: "repeat" });
    assert.equal(plan("accept", row("declined"), T0).ok, false);
    assert.equal(plan("accept", row("cancelled"), T0).ok, false);
    assert.equal(plan("revoke", row("pending"), T0).ok, false, "pending is cancelled, not revoked");
    assert.deepEqual(plan("revoke", row("revoked"), T0), { ok: true, value: "repeat" });
    assert.equal(plan("revoke", row("approved", T0.toISOString()), T0).ok, false, "an expired approval cannot be revoked");
    assert.deepEqual(plan("cancel", row("cancelled"), T0), { ok: true, value: "repeat" });
    assert.equal(plan("cancel", row("approved", later(DAY).toISOString()), T0).ok, false);
    assert.deepEqual(plan("decline", row("declined"), T0), { ok: true, value: "repeat" });
  });
});

describe("assist service", () => {
  it("creates one request per couple and logs it", async () => {
    const { model, logs } = memoryModel();
    const s = createAssistService(model);
    const first = await s.create("c1", "u1", NOTE, T0);
    assert.ok(first.ok && first.value.status === "pending");
    const second = await s.create("c1", "u1", NOTE, T0);
    assert.ok(!second.ok && second.code === "conflict");
    assert.equal((await s.create("c2", "u2", NOTE, T0)).ok, true, "another couple is independent");
    assert.equal(logs[0]!.action, "requested");
  });

  it("rate limits after 3 requests a day, counting only valid ones", async () => {
    const { model } = memoryModel();
    const s = createAssistService(model);
    for (let i = 0; i < 5; i++) await s.create("c1", "u1", "no", T0); // invalid: not counted
    for (let i = 0; i < 3; i++) {
      assert.equal((await s.create("c1", "u1", NOTE, T0)).ok, true);
      await s.cancel("c1", "u1", undefined, T0);
    }
    const blocked = await s.create("c1", "u1", NOTE, T0);
    assert.ok(!blocked.ok && blocked.code === "rate_limited");
  });

  it("accept sets a 7 day expiry, is idempotent, and logs once", async () => {
    const { model, rows, logs } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    const id = made.value.request_id;
    const a = await s.accept("admin1", id, T0);
    assert.ok(a.ok && a.value.status === "approved");
    assert.equal(rows[0]!.expires_at, new Date(T0.getTime() + ASSIST_DAYS * DAY).toISOString());
    const again = await s.accept("admin2", id, later(DAY));
    assert.ok(again.ok);
    assert.equal(rows[0]!.expires_at, new Date(T0.getTime() + ASSIST_DAYS * DAY).toISOString(), "a retry does not extend access");
    assert.equal(rows[0]!.decided_by, "admin1");
    assert.equal(logs.filter((l) => l.action === "accepted").length, 1);
  });

  it("cannot accept a suspended couple, a declined request or an unknown id", async () => {
    const couples = { c1: { status: "active" }, c2: { status: "active" } };
    const { model } = memoryModel(couples);
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    couples.c1.status = "suspended"; // suspended after asking
    const r1 = await s.accept("a", made.value.request_id, T0);
    assert.ok(!r1.ok && r1.code === "conflict");
    const m2 = await s.create("c2", "u2", NOTE, T0);
    assert.ok(m2.ok);
    assert.equal((await s.decline("a", m2.value.request_id, "", T0)).ok, false, "reason required");
    assert.equal((await s.decline("a", m2.value.request_id, "Out of scope", T0)).ok, true);
    const r2 = await s.accept("a", m2.value.request_id, T0);
    assert.ok(!r2.ok && r2.code === "conflict");
    const r3 = await s.accept("a", "nope", T0);
    assert.ok(!r3.ok && r3.code === "not_found");
  });

  it("revoke ends access, is idempotent and a new request is allowed after", async () => {
    const { model } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    await s.accept("a", made.value.request_id, T0);
    const blocked = await s.create("c1", "u1", NOTE, later(DAY));
    assert.ok(!blocked.ok && blocked.code === "conflict", "approved and live counts as open");
    assert.ok((await s.revoke("c1", "u1", undefined, later(DAY))).ok);
    assert.ok((await s.revoke("c1", "u1", undefined, later(DAY))).ok, "second revoke is a no-op");
    assert.ok((await s.create("c1", "u1", NOTE, later(DAY))).ok);
  });

  it("an expired approval no longer blocks a new request", async () => {
    const { model } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    await s.accept("a", made.value.request_id, T0);
    const after = later((ASSIST_DAYS + 1) * DAY);
    assert.equal((await s.getForCouple("c1", after)).request?.status, "expired");
    assert.ok((await s.create("c1", "u1", NOTE, after)).ok);
  });

  it("cancel and revoke only touch the caller's own couple", async () => {
    const { model, rows } = memoryModel();
    const s = createAssistService(model);
    await s.create("c1", "u1", NOTE, T0);
    const none = await s.cancel("c2", "u2", undefined, T0);
    assert.ok(!none.ok && none.code === "not_found");
    assert.equal(rows[0]!.status, "pending");
  });

  it("the couple's activity hides admin ids", async () => {
    const { model } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    await s.accept("secret-admin-id", made.value.request_id, later(1000));
    const { activity } = await s.getForCouple("c1", later(2000));
    assert.deepEqual(activity.map((a) => a.action), ["accepted", "requested"]);
    assert.ok(!JSON.stringify(activity).includes("secret-admin-id"));
  });

  it("admin list filters on derived status, pages by cursor and caps the limit", async () => {
    const { model } = memoryModel();
    const s = createAssistService(model);
    for (let i = 0; i < 3; i++) {
      const made = await s.create(`c${(i % 2) + 1}`, "u", NOTE, later(i * 1000));
      assert.ok(made.ok);
      await s.cancel(`c${(i % 2) + 1}`, "u", undefined, later(i * 1000));
    }
    const list = async (o: Parameters<typeof s.listForAdmin>[0]) => {
      const r = await s.listForAdmin(o, later(10_000));
      assert.ok(r.ok);
      return r.value;
    };
    const all = await list({ limit: 2 });
    assert.equal(all.requests.length, 2);
    assert.ok(all.next_cursor);
    const rest = await list({ limit: 2, cursor: all.next_cursor! });
    assert.equal(rest.requests.length, 1);
    assert.equal(rest.next_cursor, null);
    assert.equal((await list({ status: "pending" })).requests.length, 0);
    assert.equal((await list({ limit: 9999 })).requests.length, 3);
  });

  it("rejects an unknown status or a bad cursor instead of returning arbitrary rows", async () => {
    const s = createAssistService(memoryModel().model);
    for (const o of [{ status: "bogus" }, { cursor: "not-a-date" }]) {
      const r = await s.listForAdmin(o, T0);
      assert.ok(!r.ok && r.code === "invalid");
    }
    assert.ok((await s.listForAdmin({ status: "expired" }, T0)).ok);
  });

  it("a suspended couple cannot send a request", async () => {
    const s = createAssistService(memoryModel({ c1: { status: "suspended" } }).model);
    const r = await s.create("c1", "u1", NOTE, T0);
    assert.ok(!r.ok && r.code === "forbidden");
  });

  it("a delayed duplicate cancel with the old id cannot cancel a newer request", async () => {
    const { model, rows } = memoryModel();
    const s = createAssistService(model);
    const first = await s.create("c1", "u1", NOTE, T0);
    assert.ok(first.ok);
    await s.cancel("c1", "u1", first.value.request_id, T0);
    const second = await s.create("c1", "u1", NOTE, later(1000));
    assert.ok(second.ok);
    const dup = await s.cancel("c1", "u1", first.value.request_id, later(2000));
    assert.ok(dup.ok && dup.value.status === "cancelled", "the old request is already cancelled: a no-op");
    assert.equal(rows.find((r) => r.request_id === second.value.request_id)!.status, "pending");
  });

  it("cancel with another couple's id is not found", async () => {
    const { model } = memoryModel();
    const s = createAssistService(model);
    const other = await s.create("c2", "u2", NOTE, T0);
    assert.ok(other.ok);
    const r = await s.cancel("c1", "u1", other.value.request_id, T0);
    assert.ok(!r.ok && r.code === "not_found");
  });

  it("a retry writes the audit row that a failed log write left out", async () => {
    const { model, logs } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    const realAppend = model.appendLog;
    model.appendLog = async () => {
      throw new Error("sheets quota");
    };
    await assert.rejects(s.accept("a1", made.value.request_id, T0));
    model.appendLog = realAppend;
    assert.equal(logs.filter((l) => l.action === "accepted").length, 0, "the change landed but its audit row did not");
    assert.ok((await s.accept("a1", made.value.request_id, later(1000))).ok);
    assert.equal(logs.filter((l) => l.action === "accepted").length, 1);
    await s.accept("a1", made.value.request_id, later(2000));
    assert.equal(logs.filter((l) => l.action === "accepted").length, 1, "and is not written twice");
  });

  it("parallel calls on one request are serialised: one accept wins, one audit row", async () => {
    const { model, logs } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    const id = made.value.request_id;
    const [a, b] = await Promise.all([s.accept("a1", id, T0), s.accept("a2", id, T0)]);
    assert.ok(a.ok && b.ok);
    assert.equal(logs.filter((l) => l.action === "accepted").length, 1);
    const [acc, can] = await Promise.all([s.accept("a1", id, T0), s.cancel("c1", "u1", id, T0)]);
    assert.ok(acc.ok);
    assert.ok(!can.ok && can.code === "conflict", "approved first, so the later cancel is refused");
  });

  it("an admin can revoke an approved request early, once, and it is logged as an admin action", async () => {
    const { model, logs } = memoryModel();
    const s = createAssistService(model);
    const made = await s.create("c1", "u1", NOTE, T0);
    assert.ok(made.ok);
    const id = made.value.request_id;
    const early = await s.adminRevoke("a1", id, T0);
    assert.ok(!early.ok && early.code === "conflict", "a pending request is declined, not revoked");
    await s.accept("a1", id, T0);
    const r = await s.adminRevoke("a1", id, later(1000));
    assert.ok(r.ok && r.value.status === "revoked");
    assert.ok((await s.adminRevoke("a2", id, later(2000))).ok, "second revoke is a no-op");
    assert.deepEqual(logs.filter((l) => l.action === "revoked").map((l) => l.actor_role), ["admin"]);
    assert.ok((await s.create("c1", "u1", NOTE, later(3000))).ok, "the couple can ask again");
  });

  it("a create whose audit write failed is repaired on retry, credited to the requester", async () => {
    const { model, logs } = memoryModel();
    const s = createAssistService(model);
    const realAppend = model.appendLog;
    model.appendLog = async () => {
      throw new Error("sheets quota");
    };
    await assert.rejects(s.create("c1", "u1", NOTE, T0));
    model.appendLog = realAppend;
    assert.equal(logs.length, 0);
    const retry = await s.create("c1", "u1", NOTE, later(5000));
    assert.ok(!retry.ok && retry.code === "conflict");
    assert.equal(logs.length, 1);
    assert.equal(logs[0]!.action, "requested");
    assert.equal(logs[0]!.actor_id, "u1");
    assert.equal(logs[0]!.at, T0.toISOString(), "the row carries when the request was made");
    await s.create("c1", "u1", NOTE, later(6000));
    assert.equal(logs.length, 1, "not written twice");
  });
});

function fakeRes() {
  const res = { code: 0, body: undefined as unknown, status(c: number) { this.code = c; return this; }, json(b: unknown) { this.body = b; return this; } };
  return res;
}

describe("assist guards", () => {
  it("only a partner passes requirePartner; a collaborator or a missing role gets 403", () => {
    for (const [role, allowed] of [["partner", true], ["collaborator", false], [undefined, false], ["", false]] as const) {
      const res = fakeRes();
      let called = false;
      requirePartner({ memberRole: role } as never, res as never, () => { called = true; });
      assert.equal(called, allowed, String(role));
      if (!allowed) assert.equal(res.code, 403);
    }
  });

  it("the per-user limit answers 429 after the allowance, per user and not across users", () => {
    const limit = createAssistRateLimit(3, 60_000);
    const hit = (user: string) => {
      const res = fakeRes();
      let passed = false;
      limit({ user: { user_id: user } } as never, res as never, () => { passed = true; });
      return { passed, code: res.code };
    };
    assert.deepEqual([hit("a"), hit("a"), hit("a")].map((r) => r.passed), [true, true, true]);
    assert.deepEqual(hit("a"), { passed: false, code: 429 });
    assert.equal(hit("b").passed, true);
  });
});
