import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { ASSIST_STORAGE_KEY, createAssistStore, endsAssist, minutesLeft, parseAssistToken, readAssistFragment } from "./assist-session";

const NOW = 1_800_000_000_000;
const make = (claims: Record<string, unknown>) => `h.${Buffer.from(JSON.stringify(claims)).toString("base64url")}.s`;
const GOOD = make({ role: "couple", assist: { request_id: "r" }, exp: NOW / 1000 + 3600 });
const at = (hash: string) => ({ hash, pathname: "/dashboard", search: "" });

function memory() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

describe("editor link", () => {
  it("reads only the assist fragment", () => {
    assert.equal(readAssistFragment("#assist=a.b.c"), "a.b.c");
    assert.equal(readAssistFragment("#members"), null);
    assert.equal(readAssistFragment(""), null);
    assert.equal(readAssistFragment("#assist=%"), "");
  });
  it("accepts only a couple token that carries the assist claim and an expiry", () => {
    assert.deepEqual(parseAssistToken(GOOD), { expiresAt: NOW + 3_600_000 });
    for (const bad of [
      make({ role: "couple", exp: 1 }),
      make({ role: "admin", assist: {}, exp: 1 }),
      make({ role: "couple", assist: {} }),
      make({ role: "couple", assist: "yes", exp: 1 }),
      "nonsense",
      "",
    ]) assert.equal(parseAssistToken(bad), null, bad);
  });
});

describe("help session store", () => {
  it("takes the token and strips it from the address before storing", () => {
    const storage = memory();
    const store = createAssistStore(() => storage, () => NOW);
    let url = "";
    assert.equal(store.capture(at(`#assist=${GOOD}`), (u) => (url = u)), true);
    assert.equal(url, "/dashboard");
    assert.equal(store.get().status, "active");
    assert.match(storage.data.get(ASSIST_STORAGE_KEY)!, /token/);
  });
  it("leaves other addresses alone", () => {
    const store = createAssistStore(() => memory(), () => NOW);
    assert.equal(store.capture(at("#members"), () => assert.fail("must not touch the address")), false);
    assert.equal(store.get().status, "none");
  });
  it("a broken or expired link still leaves the address and makes the tab an ended session, not a normal one", () => {
    for (const [token, reason] of [["junk", "invalid"], [make({ role: "couple", assist: {}, exp: 1 }), "expired"]] as const) {
      const store = createAssistStore(() => memory(), () => NOW);
      let replaced = false;
      store.capture(at(`#assist=${token}`), () => (replaced = true));
      assert.equal(replaced, true);
      assert.deepEqual(store.get(), { status: "ended", reason });
    }
  });
  it("ending drops the token but keeps the tab marked, also after a reload", () => {
    const storage = memory();
    const store = createAssistStore(() => storage, () => NOW);
    store.capture(at(`#assist=${GOOD}`), () => {});
    let told = 0;
    store.subscribe(() => told++);
    store.end("ended");
    assert.equal(told, 1);
    assert.doesNotMatch(storage.data.get(ASSIST_STORAGE_KEY)!, /token/);
    assert.deepEqual(createAssistStore(() => storage, () => NOW).get(), { status: "ended", reason: "ended" });
  });
  it("ends on its own when the time is up", () => {
    const storage = memory();
    let now = NOW;
    const store = createAssistStore(() => storage, () => now);
    store.capture(at(`#assist=${GOOD}`), () => {});
    now += 3_600_000;
    assert.deepEqual(store.get(), { status: "ended", reason: "expired" });
  });
  it("returns the same object until something changes", () => {
    const store = createAssistStore(() => memory(), () => NOW);
    assert.equal(store.get(), store.get());
    store.capture(at(`#assist=${GOOD}`), () => {});
    assert.equal(store.get(), store.get());
  });
  it("end does nothing in an ordinary tab, and forget returns a tab to normal", () => {
    const storage = memory();
    const store = createAssistStore(() => storage, () => NOW);
    store.end("exited");
    assert.equal(store.get().status, "none");
    store.capture(at("#assist=junk"), () => {});
    store.forget();
    assert.equal(store.get().status, "none");
    assert.equal(storage.data.size, 0);
  });
  it("works in memory when storage is blocked", () => {
    const store = createAssistStore(() => { throw new Error("blocked"); }, () => NOW);
    store.capture(at(`#assist=${GOOD}`), () => {});
    assert.equal(store.get().status, "active");
  });
});

describe("rules", () => {
  it("ends the session on 401 or the access-ended 403 only", () => {
    assert.equal(endsAssist(401, "Invalid or expired token"), true);
    assert.equal(endsAssist(403, "Assist access ended"), true);
    assert.equal(endsAssist(403, "Not available while Mongkolka is helping"), false);
    assert.equal(endsAssist(500, undefined), false);
  });
  it("counts minutes up, never below zero", () => {
    assert.equal(minutesLeft(NOW + 61_000, NOW), 2);
    assert.equal(minutesLeft(NOW - 1, NOW), 0);
  });
});
