type Row = Record<string, unknown>;

interface Bucket<R extends Row> {
  rows: R[];
  timer: NodeJS.Timeout | null;
  attempts: number;
  flushing: boolean;
}

export interface WriteBehindOptions<R extends Row> {
  /** Name of the unique id field on each row (used for cancel/status updates). */
  idField: keyof R & string;
  /** Appends a batch to the store in one call. */
  write: (bucketKey: string, rows: R[]) => Promise<unknown>;
  flushIntervalMs?: number;
  maxAttempts?: number;
  label: string;
}

/**
 * Buffers rows per bucket (e.g. per couple sheet) and appends them in batches, so a
 * burst of guests costs a handful of Sheets writes instead of one each. Failed
 * flushes retry with exponential backoff; rows stay readable via `pending()` until
 * written. Rows live only in this process — `flushAll()` on shutdown narrows (but
 * can't eliminate) the loss window on a crash.
 */
export class WriteBehindQueue<R extends Row> {
  private readonly buckets = new Map<string, Bucket<R>>();
  private readonly flushIntervalMs: number;
  private readonly maxAttempts: number;

  constructor(private readonly options: WriteBehindOptions<R>) {
    this.flushIntervalMs = options.flushIntervalMs ?? 3_000;
    this.maxAttempts = options.maxAttempts ?? 6;
  }

  enqueue(bucketKey: string, row: R) {
    const b = this.bucketFor(bucketKey);
    b.rows.push(row);
    this.schedule(bucketKey, b, this.flushIntervalMs);
  }

  pending(bucketKey: string): R[] {
    return [...(this.buckets.get(bucketKey)?.rows ?? [])];
  }

  /** Removes a not-yet-written row and returns it, or null if it isn't queued. */
  cancel(bucketKey: string, id: string): R | null {
    const b = this.buckets.get(bucketKey);
    if (!b) return null;
    const i = b.rows.findIndex((r) => r[this.options.idField] === id);
    if (i === -1) return null;
    return b.rows.splice(i, 1)[0] ?? null;
  }

  /** Patches a queued row in place; returns false if it isn't queued. */
  patch(bucketKey: string, id: string, data: Partial<R>): boolean {
    const row = this.buckets.get(bucketKey)?.rows.find((r) => r[this.options.idField] === id);
    if (!row) return false;
    Object.assign(row, data);
    return true;
  }

  async flushAll() {
    await Promise.all([...this.buckets.keys()].map((key) => this.flush(key)));
  }

  private bucketFor(key: string): Bucket<R> {
    let b = this.buckets.get(key);
    if (!b) {
      b = { rows: [], timer: null, attempts: 0, flushing: false };
      this.buckets.set(key, b);
    }
    return b;
  }

  private schedule(key: string, b: Bucket<R>, delayMs: number) {
    if (b.timer) return;
    b.timer = setTimeout(() => {
      b.timer = null;
      void this.flush(key);
    }, delayMs);
    b.timer.unref?.();
  }

  private async flush(key: string): Promise<void> {
    const b = this.buckets.get(key);
    if (!b || b.flushing || b.rows.length === 0) return;

    b.flushing = true;
    const batch = b.rows.splice(0, b.rows.length);
    try {
      await this.options.write(key, batch);
      b.attempts = 0;
    } catch (err) {
      b.attempts += 1;
      b.rows.unshift(...batch);
      if (b.attempts >= this.maxAttempts) {
        console.error(
          `[${this.options.label}] giving up flushing ${b.rows.length} rows for ${key} after ${b.attempts} attempts`,
          err,
        );
        b.rows = [];
        b.attempts = 0;
      } else {
        this.schedule(key, b, Math.min(30_000, this.flushIntervalMs * 2 ** b.attempts));
      }
    } finally {
      b.flushing = false;
      if (b.rows.length > 0 && !b.timer) this.schedule(key, b, this.flushIntervalMs);
      if (b.rows.length === 0 && !b.timer) this.buckets.delete(key);
    }
  }
}
