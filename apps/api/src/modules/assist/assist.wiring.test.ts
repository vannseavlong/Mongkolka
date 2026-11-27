import { describe, it } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

// env.ts reads the environment when it is first imported, so set it before anything loads it.
process.env.JWT_SECRET = "wiring-test-secret";

const { requireAuth } = await import("../../middlewares/auth.middleware.js");
const { assistPolicy } = await import("./assist.session.core.js");

function run(handler: ReturnType<typeof requireAuth>, token?: string) {
  const res = { code: 0, body: undefined as unknown, status(c: number) { this.code = c; return this; }, json(b: unknown) { this.body = b; return this; } };
  const req = { headers: token ? { authorization: `Bearer ${token}` } : {} } as { headers: Record<string, string>; user?: Record<string, unknown> };
  let nexted = false;
  handler(req as never, res as never, () => { nexted = true; });
  return { nexted, res, req };
}

const sign = (payload: Record<string, unknown>) => jwt.sign(payload, "wiring-test-secret", { expiresIn: 60 });
const ordinary = () => sign({ user_id: "p1", role: "couple" });
const assisted = () => sign({ user_id: "p1", role: "couple", assist: { request_id: "r1", admin_id: "a1", couple_id: "c1" } });

describe("requireAuth and assisted tokens", () => {
  it("refuses an assisted token by default, so a route that only checks the role is closed to it", () => {
    const r = run(requireAuth(), assisted());
    assert.equal(r.nexted, false);
    assert.equal(r.res.code, 403);
    assert.deepEqual(r.res.body, { error: "Not available while Mongkolka is helping" });
  });
  it("lets it through only where a route opts in", () => {
    const r = run(requireAuth({ allowAssist: true }), assisted());
    assert.equal(r.nexted, true);
    assert.equal((r.req.user?.assist as { request_id: string }).request_id, "r1");
  });
  it("refuses a claim that is present but empty or malformed, not only a well formed one", () => {
    for (const assist of [null, "", 0, false, {}]) {
      const r = run(requireAuth(), sign({ user_id: "p1", role: "couple", assist }));
      assert.equal(r.nexted, false, JSON.stringify(assist));
    }
  });
  it("leaves ordinary tokens alone, with or without the option", () => {
    assert.equal(run(requireAuth(), ordinary()).nexted, true);
    assert.equal(run(requireAuth({ allowAssist: true }), ordinary()).nexted, true);
  });
  it("still answers 401 for a missing, forged or expired token", () => {
    assert.equal(run(requireAuth()).res.code, 401);
    assert.equal(run(requireAuth(), jwt.sign({ user_id: "p1" }, "other-secret")).res.code, 401);
    assert.equal(run(requireAuth(), jwt.sign({ user_id: "p1" }, "wiring-test-secret", { expiresIn: -10 })).res.code, 401);
  });
});

// ---- route inventory ----

interface Layer {
  route?: { path: string | string[]; methods: Record<string, boolean> };
  name?: string;
  handle?: { stack?: Layer[] };
}

function routesOf(stack: Layer[], prefix = ""): Array<{ method: string; path: string }> {
  const out: Array<{ method: string; path: string }> = [];
  for (const layer of stack) {
    if (layer.route) {
      const paths = Array.isArray(layer.route.path) ? layer.route.path : [layer.route.path];
      for (const p of paths) for (const m of Object.keys(layer.route.methods)) out.push({ method: m.toUpperCase(), path: prefix + p });
    } else if (layer.name === "router" && layer.handle?.stack) {
      out.push(...routesOf(layer.handle.stack, prefix));
    }
  }
  return out;
}

/** Routes an admin must NOT reach with an assisted token. Everything else on the couple API must be allowed. */
const CLOSED_TO_ADMINS = new Set([
  "POST /members/invite",
  "DELETE /members/:memberId",
  "DELETE /drive",
  "POST /drive/connect",
  "POST /assist",
  "POST /assist/cancel",
  "POST /assist/revoke",
]);

describe("couple API route inventory", () => {
  it("accounts for every route: each is either deliberately closed to admins or allowed, so none falls through unnoticed", async () => {
    const { coupleApiRouter } = await import("../../routes/couple-api.routes.js");
    const routes = routesOf((coupleApiRouter as unknown as { stack: Layer[] }).stack);
    assert.ok(routes.length > 40, `found ${routes.length} routes; the walk probably missed some`);
    const problems: string[] = [];
    for (const { method, path } of routes) {
      const verdict = assistPolicy(method, `/couple/api${path}`);
      const closed = CLOSED_TO_ADMINS.has(`${method} ${path}`);
      if (closed && verdict !== "deny") problems.push(`${method} ${path} should be closed to admins but the policy allows it`);
      if (!closed && verdict !== "allow") problems.push(`${method} ${path} is refused by the policy: decide whether admins may use it (add the segment to POLICY, or list it in CLOSED_TO_ADMINS)`);
    }
    assert.deepEqual(problems, []);
  });

  it("finds the routes we know exist, so the walk itself is trustworthy", async () => {
    const { coupleApiRouter } = await import("../../routes/couple-api.routes.js");
    const have = new Set(routesOf((coupleApiRouter as unknown as { stack: Layer[] }).stack).map((r) => `${r.method} ${r.path}`));
    for (const known of ["PATCH /profile", "POST /members/invite", "GET /drive", "POST /assist/revoke", "PATCH /website/sections/:sectionId", "DELETE /website/assets/:id", "GET /session"]) {
      assert.ok(have.has(known), `missing ${known}`);
    }
  });
});
