import assert from "node:assert/strict";
import type { AddressInfo } from "node:net";
import { after, before, describe, it } from "node:test";
import express from "express";
import { singleFileUpload, type MultipartRequest } from "./multipart-upload.middleware.js";

let server: ReturnType<ReturnType<typeof express>["listen"]>;
let base = "";

before(async () => {
  const app = express();
  app.post("/up", singleFileUpload("file", 1000), (req: MultipartRequest, res) => {
    res.json({ size: req.uploadedFile!.buffer.length, mime: req.uploadedFile!.mimeType });
  });
  server = app.listen(0);
  await new Promise((r) => server.once("listening", r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});
after(() => server.close());

const post = (form: FormData) => fetch(`${base}/up`, { method: "POST", body: form });
const file = (n: number, type = "image/png") => new Blob([new Uint8Array(n)], { type });

describe("singleFileUpload", () => {
  it("accepts one file part", async () => {
    const f = new FormData();
    f.set("file", file(500), "../../evil.png");
    const r = await post(f);
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { size: 500, mime: "image/png" });
  });
  it("rejects oversize with 413", async () => {
    const f = new FormData();
    f.set("file", file(5000), "a.png");
    assert.equal((await post(f)).status, 413);
  });
  it("rejects missing file and wrong field name with 400", async () => {
    const f = new FormData();
    f.set("other", file(10), "a.png");
    assert.equal((await post(f)).status, 400);
    assert.equal((await post(new FormData())).status, 400);
  });
  it("rejects two files with 400 and non-multipart with 415", async () => {
    const f = new FormData();
    f.append("file", file(10), "a.png");
    f.append("file", file(10), "b.png");
    assert.equal((await post(f)).status, 400);
    const r = await fetch(`${base}/up`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    assert.equal(r.status, 415);
  });
});
