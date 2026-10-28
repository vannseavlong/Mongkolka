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
  it("rejects a declared Content-Length far over the cap before reading the body", async () => {
    const f = new FormData();
    f.set("file", file(200_000), "a.png");
    const r = await post(f);
    assert.equal(r.status, 413);
    assert.deepEqual(await r.json(), { error: "too_large" });
  });
  it("stops at the limit on a chunked body without waiting for the rest", async () => {
    // No Content-Length (chunked): a 2 MB-ish stream must be cut off at 1000 bytes + boundary.
    const boundary = "xBOUNDARYx";
    const head = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.png"\r\nContent-Type: image/png\r\n\r\n`;
    let sent = 0;
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(new TextEncoder().encode(head));
      },
      async pull(c) {
        await new Promise((r) => setTimeout(r, 1));
        if (sent > 2_000_000) return c.close();
        sent += 10_000;
        c.enqueue(new Uint8Array(10_000));
      },
    });
    const r = await fetch(`${base}/up`, {
      method: "POST",
      headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
      body,
      duplex: "half",
    } as RequestInit);
    assert.equal(r.status, 413);
    assert.ok(sent < 2_000_000, `client streamed ${sent} bytes; server should cut it off early`);
  });
  it("survives a client abort mid-upload and keeps serving", async () => {
    const boundary = "yBOUNDARYy";
    const ac = new AbortController();
    const body = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(new TextEncoder().encode(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="a.png"\r\nContent-Type: image/png\r\n\r\nabc`));
        setTimeout(() => ac.abort(), 20);
      },
    });
    await assert.rejects(
      fetch(`${base}/up`, {
        method: "POST",
        headers: { "content-type": `multipart/form-data; boundary=${boundary}` },
        body,
        duplex: "half",
        signal: ac.signal,
      } as RequestInit),
    );
    const f = new FormData();
    f.set("file", file(10), "a.png");
    assert.equal((await post(f)).status, 200);
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
