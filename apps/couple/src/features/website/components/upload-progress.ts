/** Pure maths for the upload queue's overall progress. No React, no network. */

export interface QueueItem {
  status: "queued" | "uploading" | "done" | "error";
  percent: number;
}

export interface QueueSummary {
  total: number;
  done: number;
  failed: number;
  /** Still waiting or uploading. */
  active: number;
  /** 0-100 across the whole batch; finished files (done or failed) count as complete. */
  percent: number;
}

export function summarize(items: readonly QueueItem[]): QueueSummary {
  const total = items.length;
  const done = items.filter((i) => i.status === "done").length;
  const failed = items.filter((i) => i.status === "error").length;
  const active = total - done - failed;
  if (total === 0) return { total, done, failed, active, percent: 0 };
  const sum = items.reduce((acc, i) => acc + (i.status === "done" || i.status === "error" ? 100 : i.status === "uploading" ? i.percent : 0), 0);
  return { total, done, failed, active, percent: Math.round(sum / total) };
}
