import { beforeEach, describe, it } from "node:test";
import assert from "node:assert/strict";
import { assistSession } from "./assist-session";
// Both modules read `window` only when called, so the stand-in below is in place in time.
import { clearToken, getToken, handleAuthFailure, setToken } from "./auth";

function memory() {
  const data = new Map<string, string>();
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
  };
}

const local = memory();
const redirects: string[] = [];
(globalThis as Record<string, unknown>).window = {
  localStorage: local,
  sessionStorage: memory(),
  location: { pathname: "/guests", assign: (u: string) => redirects.push(u) },
};


const GOOD = `h.${Buffer.from(JSON.stringify({ role: "couple", assist: {}, exp: Date.now() / 1000 + 3600 })).toString("base64url")}.s`;
const open = () => assistSession.capture({ hash: `#assist=${GOOD}`, pathname: "/dashboard", search: "" }, () => {});

describe("token source", () => {
  beforeEach(() => {
    assistSession.forget();
    local.setItem("mongkolka_couple_token", "own-login");
    redirects.length = 0;
  });

  it("prefers the assist token and never falls back to the couple login after it ends", () => {
    assert.equal(getToken(), "own-login");
    open();
    assert.equal(getToken(), GOOD);
    clearToken();
    assert.equal(getToken(), null);
    assert.equal(local.getItem("mongkolka_couple_token"), "own-login");
  });
  it("on a rejected assist token ends the session without redirecting or touching the couple login", () => {
    open();
    handleAuthFailure(403, "Not available while Mongkolka is helping");
    assert.equal(getToken(), GOOD);
    handleAuthFailure(403, "Assist access ended");
    handleAuthFailure(401, "Invalid or expired token");
    assert.equal(getToken(), null);
    assert.deepEqual(redirects, []);
    assert.equal(local.getItem("mongkolka_couple_token"), "own-login");
  });
  it("keeps the ordinary sign-out on 401, and ignores other failures", () => {
    handleAuthFailure(403, "Forbidden");
    assert.equal(getToken(), "own-login");
    handleAuthFailure(401, "Invalid or expired token");
    assert.equal(getToken(), null);
    assert.deepEqual(redirects, ["/"]);
  });
  it("an ordinary sign-in turns the tab back to normal", () => {
    open();
    setToken("new-login");
    assert.equal(getToken(), "new-login");
  });
});
