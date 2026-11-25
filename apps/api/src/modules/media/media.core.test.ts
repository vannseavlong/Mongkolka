import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { createMediaCore } from "./media.core.js";

const FILE = "1AbCdEfGhIjKlMnOp";

/** couple "a" owns FILE; any other couple's token cannot see it, like a real drive.file grant. */
function setup(mime = "image/jpeg") {
  const reads: string[] = [];
  const serve = createMediaCore({
    isConnected: async (c) => c === "a" || c === "b",
    drive: {
      async stat(c, id) { return c === "a" && id === FILE ? { mimeType: mime, size: 3, etag: "md5x" } : null; },
      async read(c, id) { reads.push(`${c}/${id}`); return Readable.from([Buffer.from("abc")]); },
    },
  });
  return { serve, reads };
}

describe("media core", () => {
  it("streams the owner's image with its ETag", async () => {
    const { serve } = setup();
    const r = await serve("a", FILE);
    assert.equal(r.status, 200);
    if (r.status === 200) assert.deepEqual([r.mimeType, r.size, r.etag], ["image/jpeg", 3, '"md5x"']);
  });

  it("answers 304 without reading the file when the ETag matches", async () => {
    const { serve, reads } = setup();
    assert.equal((await serve("a", FILE, '"md5x"')).status, 304);
    assert.equal(reads.length, 0);
  });

  it("does not let couple B read couple A's file", async () => {
    const { serve, reads } = setup();
    assert.equal((await serve("b", FILE)).status, 404);
    assert.equal(reads.length, 0);
  });

  it("404s unknown ids, unconnected couples, malformed ids and non-image files", async () => {
    const { serve } = setup();
    assert.equal((await serve("a", "1UnknownUnknown00")).status, 404);
    assert.equal((await serve("nobody", FILE)).status, 404);
    assert.equal((await serve("a", "../etc/passwd")).status, 404);
    assert.equal((await serve("a/../b", FILE)).status, 404);
    assert.equal((await setup("text/html").serve("a", FILE)).status, 404);
    assert.equal((await setup("application/pdf").serve("a", FILE)).status, 404);
  });
});
