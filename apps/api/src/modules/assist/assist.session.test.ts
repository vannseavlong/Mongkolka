import { describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import type { AssistRow } from "./assist.core.js";
import { AUDIT_PATH_MAX_SEGMENTS, MAX_TOKEN_SECONDS, assistPolicy, auditPath, pickActingMember, readClaim, tokenTtlSeconds } from "./assist.session.core.js";
import { VIEW_THROTTLE_MS, createAssistTrafficLimit, createCheckAssist } from "./assist.session.guard.js";
import { createAssistSessionService } from "./assist.session.service.js";
import type { AssistModelPort } from "./assist.service.js";

const T0 = new Date("2026-12-01T10:00:00.000Z");
const later = (ms: number) => new Date(T0.getTime() + ms);
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

describe("readClaim", () => {
  const claim = { request_id: "r1", admin_id: "a1", couple_id: "c1" };
  it("treats a token without the claim as an ordinary login", () => {
    assert.deepEqual(readClaim({ user_id: "u" }), { kind: "none" });
    assert.deepEqual(readClaim(undefined), { kind: "none" });
  });
  it("reads a complete claim", () => {
    assert.deepEqual(readClaim({ assist: claim }), { kind: "claim", claim });
  });
  it("refuses a malformed claim rather than treating it as an ordinary login", () => {
    for (const assist of [null, "yes", 5, [], {}, { ...claim, admin_id: "" }, { ...claim, couple_id: 3 }, { request_id: "r1" }]) {
      assert.equal(readClaim({ assist }).kind, "invalid", JSON.stringify(assist));
    }
  });
});

describe("tokenTtlSeconds", () => {
  it("is an hour, or less when the request ends sooner", () => {
    assert.equal(tokenTtlSeconds(T0, later(7 * DAY).toISOString()), MAX_TOKEN_SECONDS);
    assert.equal(tokenTtlSeconds(T0, later(10 * 60_000).toISOString()), 600);
    assert.equal(tokenTtlSeconds(T0, later(1500).toISOString()), 1, "rounded down to whole seconds");
  });
  it("is null when there is no time left or the expiry is unreadable", () => {
    for (const v of [T0.toISOString(), later(-1000).toISOString(), later(900).toISOString(), "", null, undefined, "garbage"]) {
      assert.equal(tokenTtlSeconds(T0, v as string), null, String(v));
    }
  });
});

describe("pickActingMember", () => {
  const m = (user_id: string, member_role: string, joined_at: string | null) => ({ user_id, member_role, joined_at });
  it("takes the partner who joined first and never a collaborator", () => {
    const members = [m("c", "collaborator", "2026-01-01T00:00:00Z"), m("p2", "partner", "2026-03-01T00:00:00Z"), m("p1", "partner", "2026-02-01T00:00:00Z")];
    assert.equal(pickActingMember(members)?.user_id, "p1");
  });
  it("puts a partner with no join time last, and breaks a tie by user id", () => {
    assert.equal(pickActingMember([m("b", "partner", null), m("a", "partner", "2026-02-01T00:00:00Z")])?.user_id, "a");
    assert.equal(pickActingMember([m("z", "partner", null), m("y", "partner", null)])?.user_id, "y");
    assert.equal(pickActingMember([m("z", "partner", "x"), m("y", "partner", "x")])?.user_id, "y");
  });
  it("is null when there is no partner", () => {
    assert.equal(pickActingMember([]), null);
    assert.equal(pickActingMember([m("c", "collaborator", null)]), null);
  });
});

describe("assistPolicy", () => {
  const allow = (method: string, url: string) => assert.equal(assistPolicy(method, url), "allow", `${method} ${url}`);
  const deny = (method: string, url: string) => assert.equal(assistPolicy(method, url), "deny", `${method} ${url}`);

  it("lets an admin edit the site, profile and lists", () => {
    allow("PATCH", "/couple/api/profile");
    allow("POST", "/couple/api/website/template");
    allow("DELETE", "/couple/api/website/assets/abc");
    allow("PATCH", "/couple/api/website/sections/1");
    allow("POST", "/couple/api/guests");
    allow("PATCH", "/couple/api/budget-categories/1");
    allow("DELETE", "/couple/api/checklist-items/1");
    allow("POST", "/couple/api/milestones");
    allow("POST", "/couple/api/photos/bulk-delete");
    allow("POST", "/couple/api/wishes/1/record-gift");
  });
  it("only reads people, Drive and help-request routes", () => {
    allow("GET", "/couple/api/members");
    allow("GET", "/couple/api/drive");
    allow("GET", "/couple/api/assist");
    deny("POST", "/couple/api/members/invite");
    deny("DELETE", "/couple/api/members/abc");
    deny("POST", "/couple/api/drive/connect");
    deny("DELETE", "/couple/api/drive");
    deny("POST", "/couple/api/assist");
    deny("POST", "/couple/api/assist/cancel");
    deny("POST", "/couple/api/assist/revoke");
  });
  it("refuses a route nobody listed, so new routes start closed", () => {
    deny("GET", "/couple/api/account");
    deny("POST", "/couple/api/password");
    deny("GET", "/couple/api/some-new-thing");
    deny("GET", "/couple/api");
    deny("GET", "/couple/api/");
  });
  it("cannot be slipped past with case, slashes, a query string or a hash", () => {
    deny("POST", "/Couple/API/Members/invite");
    deny("POST", "/couple/api//members/invite");
    deny("POST", "/couple/api/members/invite/");
    deny("POST", "/couple/api/members/invite?x=/couple/api/profile");
    deny("POST", "/couple/api/members/invite#/couple/api/profile");
    deny("DELETE", "/COUPLE/API/DRIVE");
    allow("PATCH", "/Couple/Api/Profile?x=1");
  });
  it("refuses anything outside the couple API", () => {
    deny("GET", "/admin/api/couples");
    deny("GET", "/vendor/api/profile");
    deny("GET", "/public/api/site/abc");
    deny("GET", "/profile");
  });
  it("ignores the method's case", () => {
    allow("get", "/couple/api/members");
    deny("post", "/couple/api/members/invite");
  });
});

describe("auditPath", () => {
  it("replaces ids, keeps fixed words and drops the query string", () => {
    assert.equal(auditPath("/couple/api/website/assets/6f1c2d3e-aaaa-bbbb-cccc-111122223333?token=secret"), "/couple/api/website/assets/:id");
    assert.equal(auditPath("/couple/api/guests/12345"), "/couple/api/guests/:id");
    assert.equal(auditPath("/Couple/API/Photos/bulk-delete"), "/couple/api/photos/bulk-delete");
    assert.equal(auditPath("/couple/api/website/sections/reorder"), "/couple/api/website/sections/reorder");
    assert.equal(auditPath("/couple/api/profile?partner1_name=Someone#x"), "/couple/api/profile");
  });
  it("treats anything that is not a plain route word as a value, so a client cannot write its own text into the log", () => {
    assert.equal(auditPath("/couple/api/guests/Some%20Name"), "/couple/api/guests/:id");
    assert.equal(auditPath("/couple/api/guests/=HYPERLINK(x)"), "/couple/api/guests/:id");
    assert.equal(auditPath("/couple/api/guests/" + "a".repeat(40)), "/couple/api/guests/:id");
  });
  it("caps the number of segments and the total length", () => {
    const long = auditPath("/couple/api/website/assets/x/usage/more/and/more/and/more");
    assert.equal(long.split("/").filter(Boolean).length, AUDIT_PATH_MAX_SEGMENTS);
    assert.ok(auditPath("/" + "a/".repeat(500)).length <= AUDIT_PATH_MAX_SEGMENTS * 25);
  });
});

// ---- service ----

interface World {
  requests: AssistRow[];
  couples: Record<string, { status: string }>;
  users: Record<string, { user_id: string; role: string; status: string; email: string }>;
  members: Record<string, Array<{ user_id: string; member_role: string; joined_at: string | null }>>;
  logs: Array<Record<string, unknown>>;
}

function world(over: Partial<World> = {}): World {
  return {
    requests: [
      { request_id: "r1", couple_id: "c1", note: "help", status: "approved", requested_by: "p1", requested_at: T0.toISOString(), expires_at: later(7 * DAY).toISOString() },
    ],
    couples: { c1: { status: "active" }, c2: { status: "active" } },
    users: {
      p1: { user_id: "p1", role: "couple", status: "active", email: "p1@x.com" },
      collab: { user_id: "collab", role: "couple", status: "active", email: "c@x.com" },
      a1: { user_id: "a1", role: "admin", status: "active", email: "a1@x.com" },
    },
    members: { c1: [{ user_id: "collab", member_role: "collaborator", joined_at: "2026-01-01T00:00:00Z" }, { user_id: "p1", member_role: "partner", joined_at: "2026-02-01T00:00:00Z" }] },
    logs: [],
    ...over,
  };
}

function modelOf(w: World) {
  return {
    findById: async (id: string) => w.requests.find((r) => r.request_id === id) ?? null,
    findCouple: async (id: string) => (w.couples[id] ? { couple_id: id, ...w.couples[id] } : null),
    findUser: async (id: string) => w.users[id] ?? null,
    listMembers: async (id: string) => w.members[id] ?? [],
    appendLog: async (r: Record<string, unknown>) => void w.logs.push(r),
  } as unknown as AssistModelPort;
}

function serviceOf(w: World) {
  const signed: Array<{ payload: Record<string, unknown>; ttl: number; logsAtSign: number }> = [];
  const service = createAssistSessionService({
    model: modelOf(w),
    sign: (payload, ttl) => {
      signed.push({ payload, ttl, logsAtSign: w.logs.length });
      return `token-${signed.length}`;
    },
  });
  return { service, signed };
}

describe("openSession", () => {
  it("issues a token that acts as the first partner, for an hour, after writing the audit row", async () => {
    const w = world();
    const { service, signed } = serviceOf(w);
    const r = await service.openSession("a1", "r1", T0);
    assert.ok(r.ok);
    assert.equal(r.value.token, "token-1");
    assert.equal(r.value.expires_at, later(HOUR).toISOString());
    const [s] = signed;
    assert.equal(s!.ttl, 3600);
    assert.equal(s!.logsAtSign, 1, "the open row was written before the token was signed");
    assert.deepEqual(s!.payload, { user_id: "p1", role: "couple", email: "p1@x.com", status: "active", assist: { request_id: "r1", admin_id: "a1", couple_id: "c1" } });
    assert.deepEqual([w.logs[0]!.action, w.logs[0]!.actor_role, w.logs[0]!.actor_id], ["open", "admin", "a1"]);
  });

  it("never outlives the request: a request with 10 minutes left gives a 10 minute token", async () => {
    const w = world();
    w.requests[0]!.expires_at = later(10 * 60_000).toISOString();
    const { service, signed } = serviceOf(w);
    const r = await service.openSession("a1", "r1", T0);
    assert.ok(r.ok);
    assert.equal(signed[0]!.ttl, 600);
    assert.equal(r.value.expires_at, later(600_000).toISOString());
  });

  it("refuses everything that is not a live approval, writing no row and signing nothing", async () => {
    const cases: Array<[string, (w: World) => void, string]> = [
      ["unknown request", () => undefined, "nope"],
      ["pending", (w) => void (w.requests[0]!.status = "pending"), "r1"],
      ["declined", (w) => void (w.requests[0]!.status = "declined"), "r1"],
      ["revoked", (w) => void (w.requests[0]!.status = "revoked"), "r1"],
      ["expired", (w) => void (w.requests[0]!.expires_at = later(-1).toISOString()), "r1"],
      ["approved with no expiry", (w) => void (w.requests[0]!.expires_at = null), "r1"],
      ["suspended couple", (w) => void (w.couples.c1 = { status: "suspended" }), "r1"],
      ["no partner", (w) => void (w.members.c1 = [{ user_id: "collab", member_role: "collaborator", joined_at: null }]), "r1"],
      ["partner suspended", (w) => void (w.users.p1!.status = "suspended"), "r1"],
    ];
    for (const [name, mutate, id] of cases) {
      const w = world();
      mutate(w);
      const { service, signed } = serviceOf(w);
      const r = await service.openSession("a1", id, T0);
      assert.ok(!r.ok, name);
      assert.ok(r.code === "conflict" || r.code === "not_found", name);
      assert.equal(w.logs.length, 0, `${name}: no audit row`);
      assert.equal(signed.length, 0, `${name}: nothing signed`);
    }
  });

  it("issues no token when the audit row cannot be written", async () => {
    const w = world();
    const model = modelOf(w);
    model.appendLog = async () => {
      throw new Error("sheets quota");
    };
    const signed: string[] = [];
    const failing = createAssistSessionService({ model, sign: () => (signed.push("signed"), "t") });
    await assert.rejects(failing.openSession("a1", "r1", T0));
    assert.deepEqual(signed, [], "the signer was never called");
  });
});

describe("checkAccess", () => {
  const claim = { request_id: "r1", admin_id: "a1", couple_id: "c1" };
  const ctx = { coupleId: "c1", coupleStatus: "active" };

  it("passes while everything still holds", async () => {
    assert.ok((await serviceOf(world()).service.checkAccess(claim, ctx, later(HOUR))).ok);
  });

  const ends: Array<[string, (w: World) => void]> = [
    ["revoked: access ends on the very next request", (w) => void (w.requests[0]!.status = "revoked")],
    ["request expired", (w) => void (w.requests[0]!.expires_at = later(HOUR - 1).toISOString())],
    ["expiry unreadable", (w) => void (w.requests[0]!.expires_at = "garbage")],
    ["request deleted", (w) => void (w.requests.length = 0)],
    ["request belongs to another couple", (w) => void (w.requests[0]!.couple_id = "c2")],
    ["admin demoted to a couple user", (w) => void (w.users.a1!.role = "couple")],
    ["admin suspended", (w) => void (w.users.a1!.status = "suspended")],
    ["admin removed", (w) => void delete w.users.a1],
  ];
  for (const [name, mutate] of ends) {
    it(`fails closed when ${name}`, async () => {
      const w = world();
      mutate(w);
      const r = await serviceOf(w).service.checkAccess(claim, ctx, later(HOUR));
      assert.ok(!r.ok && r.code === "forbidden" && r.message === "Assist access ended");
    });
  }

  it("fails closed when the couple was suspended after the approval (the caller passes the couple's fresh status)", async () => {
    const r = await serviceOf(world()).service.checkAccess(claim, { coupleId: "c1", coupleStatus: "suspended" }, later(HOUR));
    assert.ok(!r.ok && r.code === "forbidden");
    assert.ok(!(await serviceOf(world()).service.checkAccess(claim, { coupleId: "c1", coupleStatus: undefined }, later(HOUR))).ok, "an unreadable status is not active");
  });

  it("a token for couple A cannot be used as couple B", async () => {
    const w = world();
    const r = await serviceOf(w).service.checkAccess(claim, { coupleId: "c2", coupleStatus: "active" }, later(1000));
    assert.ok(!r.ok);
    const r2 = await serviceOf(w).service.checkAccess({ ...claim, couple_id: "c2" }, { coupleId: "c2", coupleStatus: "active" }, later(1000));
    assert.ok(!r2.ok, "a forged couple id in the claim does not help: the request belongs to c1");
  });
});

// ---- guard ----

function fakeRes() {
  return { code: 0, body: undefined as unknown, status(c: number) { this.code = c; return this; }, json(b: unknown) { this.body = b; return this; } };
}
function reqOf(method: string, url: string, user: Record<string, unknown>) {
  return { method, originalUrl: url, user } as never;
}

describe("assisted request guard", () => {
  const user = { user_id: "p1", role: "couple", assist: { request_id: "r1", admin_id: "a1", couple_id: "c1" } };
  const ctx = { coupleId: "c1", coupleStatus: "active" };
  const NOW = later(HOUR); // a fixed clock, so these tests do not depend on today's date
  const setup = (w = world(), clock = () => NOW) => ({ w, check: createCheckAssist(serviceOf(w).service, clock) });
  const actions = (w: World) => w.logs.map((l) => l.action);

  it("leaves an ordinary couple token alone: no checks, no log", async () => {
    const { w, check } = setup();
    const res = fakeRes();
    assert.equal(await check(reqOf("PATCH", "/couple/api/profile", { user_id: "p1", role: "couple" }), res as never, ctx), true);
    assert.equal(w.logs.length, 0);
    assert.equal(res.code, 0);
  });

  it("refuses a malformed claim", async () => {
    const { check } = setup();
    const res = fakeRes();
    assert.equal(await check(reqOf("GET", "/couple/api/profile", { user_id: "p1", assist: "yes" }), res as never, ctx), false);
    assert.equal(res.code, 403);
  });

  it("a read is allowed and logged once per area per five minutes, not once per request", async () => {
    let now = NOW;
    const { w, check } = setup(world(), () => now);
    for (let i = 0; i < 5; i++) assert.equal(await check(reqOf("GET", "/couple/api/guests", user), fakeRes() as never, ctx), true);
    assert.deepEqual(actions(w), ["view"]);
    assert.deepEqual([w.logs[0]!.method, w.logs[0]!.path], ["GET", "/couple/api/guests"]);
    await check(reqOf("GET", "/couple/api/wishes", user), fakeRes() as never, ctx);
    assert.deepEqual(actions(w), ["view", "view"], "another area is its own row");
    now = new Date(NOW.getTime() + VIEW_THROTTLE_MS);
    await check(reqOf("GET", "/couple/api/guests", user), fakeRes() as never, ctx);
    assert.equal(w.logs.length, 3, "after the window the same area is logged again");
  });

  it("a read that cannot be logged is refused, and tried again on the next read", async () => {
    const w = world();
    const model = modelOf(w);
    const real = model.appendLog;
    const check = createCheckAssist(createAssistSessionService({ model, sign: () => "t" }), () => NOW);
    model.appendLog = async () => {
      throw new Error("sheets quota");
    };
    const res = fakeRes();
    assert.equal(await check(reqOf("GET", "/couple/api/guests", user), res as never, ctx), false);
    assert.equal(res.code, 500);
    model.appendLog = real;
    assert.equal(await check(reqOf("GET", "/couple/api/guests", user), fakeRes() as never, ctx), true);
    assert.deepEqual(actions(w), ["view"]);
  });

  it("a change is logged before it runs: method and path pattern only, never the query string", async () => {
    const { w, check } = setup();
    const req = reqOf("PATCH", "/couple/api/website/sections/6f1c2d3e-aaaa-bbbb-cccc-111122223333?token=SECRET", user);
    assert.equal(await check(req, fakeRes() as never, ctx), true);
    assert.equal(w.logs.length, 1);
    assert.deepEqual([w.logs[0]!.action, w.logs[0]!.method, w.logs[0]!.path, w.logs[0]!.actor_id, w.logs[0]!.actor_role], ["edit", "PATCH", "/couple/api/website/sections/:id", "a1", "admin"]);
    assert.ok(!JSON.stringify(w.logs).includes("SECRET"));
  });

  it("several routers running the guard for one request log it once", async () => {
    const { w, check } = setup();
    const req = reqOf("POST", "/couple/api/guests", user);
    for (let i = 0; i < 4; i++) assert.equal(await check(req, fakeRes() as never, ctx), true);
    assert.equal(w.logs.length, 1);
  });

  it("refuses sensitive routes, and leaves a `blocked` row (once per path) instead of an edit", async () => {
    const { w, check } = setup();
    for (const [m, u] of [["POST", "/couple/api/members/invite"], ["DELETE", "/couple/api/members/abc"], ["POST", "/couple/api/drive/connect"], ["DELETE", "/couple/api/drive"], ["POST", "/couple/api/assist/revoke"], ["GET", "/couple/api/unlisted"]] as const) {
      const res = fakeRes();
      assert.equal(await check(reqOf(m, u, user), res as never, ctx), false, `${m} ${u}`);
      assert.equal(res.code, 403);
    }
    assert.equal(actions(w).filter((a) => a === "edit").length, 0);
    assert.equal(actions(w).filter((a) => a === "blocked").length, 6);
    for (let i = 0; i < 5; i++) await check(reqOf("POST", "/couple/api/members/invite", user), fakeRes() as never, ctx);
    assert.equal(w.logs.length, 6, "probing the same route again adds nothing");
  });

  it("a refused attempt is still refused when the blocked row cannot be written", async () => {
    const w = world();
    const model = modelOf(w);
    const check = createCheckAssist(createAssistSessionService({ model, sign: () => "t" }), () => NOW);
    model.appendLog = async () => {
      throw new Error("sheets quota");
    };
    const res = fakeRes();
    assert.equal(await check(reqOf("POST", "/couple/api/members/invite", user), res as never, ctx), false);
    assert.equal(res.code, 403, "a 403, not a 500");
  });

  it("revoke cuts access on the next request, and expiry does too", async () => {
    const { w, check } = setup();
    assert.equal(await check(reqOf("PATCH", "/couple/api/profile", user), fakeRes() as never, ctx), true);
    w.requests[0]!.status = "revoked";
    const res = fakeRes();
    assert.equal(await check(reqOf("PATCH", "/couple/api/profile", user), res as never, ctx), false);
    assert.deepEqual([res.code, res.body], [403, { error: "Assist access ended" }]);

    const w2 = world();
    w2.requests[0]!.expires_at = later(HOUR - 1000).toISOString();
    const res2 = fakeRes();
    assert.equal(await createCheckAssist(serviceOf(w2).service, () => NOW)(reqOf("GET", "/couple/api/profile", user), res2 as never, ctx), false);
    assert.equal(res2.code, 403);
  });

  it("refuses to run a change it cannot record", async () => {
    const w = world();
    const model = modelOf(w);
    const check = createCheckAssist(createAssistSessionService({ model, sign: () => "t" }), () => NOW);
    model.appendLog = async () => {
      throw new Error("sheets quota");
    };
    const res = fakeRes();
    assert.equal(await check(reqOf("DELETE", "/couple/api/guests/1", user), res as never, ctx), false);
    assert.equal(res.code, 500);
    assert.ok(!JSON.stringify(res.body).includes("quota"), "no internals in the error");
  });
});

describe("assisted traffic limit", () => {
  const claimUser = (id: string) => ({ user_id: "p1", assist: { request_id: id, admin_id: "a1", couple_id: "c1" } });
  const req = (user: Record<string, unknown>) => ({ user }) as never;

  it("stops a looping client with a 429 before any sheet read, per request id", () => {
    const limit = createAssistTrafficLimit(3, 60_000);
    for (let i = 0; i < 3; i++) assert.equal(limit(req(claimUser("r1")), fakeRes() as never), true);
    const res = fakeRes();
    assert.equal(limit(req(claimUser("r1")), res as never), false);
    assert.equal(res.code, 429);
    assert.equal(limit(req(claimUser("r2")), fakeRes() as never), true, "another request has its own allowance");
  });
  it("counts a request once even though several routers run the guard", () => {
    const limit = createAssistTrafficLimit(2, 60_000);
    const one = req(claimUser("r1"));
    for (let i = 0; i < 6; i++) assert.equal(limit(one, fakeRes() as never), true);
    assert.equal(limit(req(claimUser("r1")), fakeRes() as never), true);
    assert.equal(limit(req(claimUser("r1")), fakeRes() as never), false);
  });
  it("does not touch ordinary couple tokens", () => {
    const limit = createAssistTrafficLimit(1, 60_000);
    for (let i = 0; i < 10; i++) assert.equal(limit(req({ user_id: "p1", role: "couple" }), fakeRes() as never), true);
  });
});

describe("token round trip with the real JWT library", () => {
  const SECRET = "test-secret";
  const real = (w: World) => createAssistSessionService({ model: modelOf(w), sign: (payload, ttl) => jwt.sign(payload, SECRET, { expiresIn: ttl }) });

  it("expires when the request does: a 10 minute request gives a token that is dead after 10 minutes", async () => {
    const w = world();
    w.requests[0]!.expires_at = new Date(Date.now() + 10 * 60_000).toISOString();
    const r = await real(w).openSession("a1", "r1", new Date());
    assert.ok(r.ok);
    const p = jwt.verify(r.value.token, SECRET) as jwt.JwtPayload;
    assert.ok(p.exp! - p.iat! <= 600 && p.exp! - p.iat! >= 599);
    assert.throws(() => jwt.verify(r.value.token, SECRET, { clockTimestamp: p.exp! + 1 }), /expired/);
  });

  it("carries only what is needed: the acting user, the role and the claim", async () => {
    const r = await real(world()).openSession("a1", "r1", new Date());
    assert.ok(r.ok);
    const p = jwt.decode(r.value.token) as Record<string, unknown>;
    assert.deepEqual(Object.keys(p).sort(), ["assist", "email", "exp", "iat", "role", "status", "user_id"]);
    assert.equal(p.role, "couple", "never an admin role: it cannot reach admin routes");
    assert.equal(readClaim(p).kind, "claim");
  });

  it("is not accepted under another secret", async () => {
    const r = await real(world()).openSession("a1", "r1", new Date());
    assert.ok(r.ok);
    assert.throws(() => jwt.verify(r.value.token, "other-secret"), /invalid signature/);
  });
});
