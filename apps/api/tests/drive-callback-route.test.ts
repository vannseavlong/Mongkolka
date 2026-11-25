import { describe, it } from "node:test";
import assert from "node:assert/strict";
import express from "express";
import type { AddressInfo } from "node:net";
import { coupleApiRouter } from "../src/routes/couple-api.routes.js";

// Google redirects the browser to /couple/api/drive/callback with no login token. Every other couple route needs
// one, and the routers before it in the chain used to answer this request with 401 "Missing bearer token".
async function get(path: string): Promise<{ status: number; location: string | null }> {
  const app = express();
  app.use("/couple/api", coupleApiRouter);
  const server = app.listen(0);
  try {
    const { port } = server.address() as AddressInfo;
    const res = await fetch(`http://127.0.0.1:${port}${path}`, { redirect: "manual" });
    return { status: res.status, location: res.headers.get("location") };
  } finally {
    server.close();
  }
}

describe("drive callback route", () => {
  it("is reachable without a login token (it redirects back to the portal, it does not answer 401)", async () => {
    const res = await get("/couple/api/drive/callback?state=x&code=y");
    assert.notEqual(res.status, 401);
    assert.equal(res.status, 302);
    assert.match(res.location ?? "", /\/settings\/storage\?drive=/);
  });
  it("a denied consent comes back as a redirect too", async () => {
    const res = await get("/couple/api/drive/callback?error=access_denied");
    assert.equal(res.status, 302);
  });
  it("the other Drive routes still need a login token", async () => {
    for (const path of ["/couple/api/drive", "/couple/api/website/settings"]) assert.equal((await get(path)).status, 401, path);
  });
});
