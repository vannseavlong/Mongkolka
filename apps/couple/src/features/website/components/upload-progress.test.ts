import { test } from "node:test";
import assert from "node:assert/strict";
import { summarize } from "./upload-progress";

test("summarize averages finished, running and waiting files", () => {
  const s = summarize([
    { status: "done", percent: 100 },
    { status: "uploading", percent: 50 },
    { status: "queued", percent: 0 },
    { status: "error", percent: 0 },
  ]);
  assert.deepEqual(s, { total: 4, done: 1, failed: 1, active: 2, percent: 63 });
});

test("an empty queue is 0 and not active", () => {
  assert.deepEqual(summarize([]), { total: 0, done: 0, failed: 0, active: 0, percent: 0 });
});
