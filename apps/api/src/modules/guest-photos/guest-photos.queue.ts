import { GuestPhotosModel } from "./guest-photos.model.js";

type Row = Record<string, unknown> & { photo_id: string };

interface Bucket {
  rows: Row[];
  timer: NodeJS.Timeout | null;
  attempts: number;
  flushing: boolean;
}

const FLUSH_INTERVAL_MS = 3_000;
const MAX_ATTEMPTS = 6;

/**
 * Write-behind queue for guest photo metadata. Guests upload in bursts and Sheets
 * allows roughly 60 writes/min per OAuth user, so rows are buffered per couple and
 * appended with one createMany() every few seconds — a couple's sheet sees at most
 * ~20 writes/min however many guests upload at once. Failed flushes retry with
 * exponential backoff; rows stay in memory (and visible via `pending()`) meanwhile.
 *
 * Known limit: rows live only in this process. A crash loses un-flushed metadata
 * (the files already exist in storage) — `flushAll()` runs on shutdown to narrow it.
 */
const buckets = new Map<string, Bucket>();

function bucketFor(actorSheetId: string): Bucket {
  let b = buckets.get(actorSheetId);
  if (!b) {
    b = { rows: [], timer: null, attempts: 0, flushing: false };
    buckets.set(actorSheetId, b);
  }
  return b;
}

function schedule(actorSheetId: string, b: Bucket, delayMs: number) {
  if (b.timer) return;
  b.timer = setTimeout(() => {
    b.timer = null;
    void flush(actorSheetId);
  }, delayMs);
  b.timer.unref?.();
}

async function flush(actorSheetId: string): Promise<void> {
  const b = buckets.get(actorSheetId);
  if (!b || b.flushing || b.rows.length === 0) return;

  b.flushing = true;
  const batch = b.rows.splice(0, b.rows.length);
  try {
    await GuestPhotosModel.createMany(actorSheetId, batch);
    b.attempts = 0;
  } catch (err) {
    b.attempts += 1;
    // Put the batch back in front of anything queued while we were writing.
    b.rows.unshift(...batch);
    if (b.attempts >= MAX_ATTEMPTS) {
      console.error(
        `[guest-photos] giving up flushing ${b.rows.length} rows for ${actorSheetId} after ${b.attempts} attempts`,
        err,
      );
      b.rows = [];
      b.attempts = 0;
    } else {
      schedule(actorSheetId, b, Math.min(30_000, FLUSH_INTERVAL_MS * 2 ** b.attempts));
    }
  } finally {
    b.flushing = false;
    if (b.rows.length > 0 && !b.timer) schedule(actorSheetId, b, FLUSH_INTERVAL_MS);
    if (b.rows.length === 0 && !b.timer) buckets.delete(actorSheetId);
  }
}

export const GuestPhotosQueue = {
  enqueue(actorSheetId: string, row: Row) {
    const b = bucketFor(actorSheetId);
    b.rows.push(row);
    schedule(actorSheetId, b, FLUSH_INTERVAL_MS);
  },

  /** Rows accepted but not yet written — merged into the couple's list and per-guest counts. */
  pending(actorSheetId: string): Row[] {
    return [...(buckets.get(actorSheetId)?.rows ?? [])];
  },

  /** Removes a not-yet-written row. Returns it (so the caller can delete its file) or null. */
  cancel(actorSheetId: string, photoId: string): Row | null {
    const b = buckets.get(actorSheetId);
    if (!b) return null;
    const i = b.rows.findIndex((r) => r.photo_id === photoId);
    if (i === -1) return null;
    const [row] = b.rows.splice(i, 1);
    return row ?? null;
  },

  /** Applies a status change to a queued row. Returns true if it was queued. */
  updateStatus(actorSheetId: string, photoId: string, status: string): boolean {
    const row = buckets.get(actorSheetId)?.rows.find((r) => r.photo_id === photoId);
    if (!row) return false;
    row.status = status;
    return true;
  },

  async flushAll() {
    await Promise.all([...buckets.keys()].map((id) => flush(id)));
  },
};
