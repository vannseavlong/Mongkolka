interface Window {
  count: number;
  resetAt: number;
}

/**
 * Fixed-window counter keyed by an arbitrary string (e.g. `slug:ip`). In-memory and
 * per-process — adequate for one API instance; move to Redis if that changes.
 */
export class RateLimiter {
  private readonly windows = new Map<string, Window>();

  constructor(
    private readonly windowMs: number,
    private readonly maxKeys = 10_000,
  ) {}

  /** Records a hit; returns true if it's within `limit` for the current window. */
  hit(key: string, limit: number): boolean {
    const now = Date.now();
    let w = this.windows.get(key);
    if (!w || w.resetAt <= now) {
      if (this.windows.size >= this.maxKeys) this.sweep(now);
      w = { count: 0, resetAt: now + this.windowMs };
      this.windows.set(key, w);
    }
    w.count += 1;
    return w.count <= limit;
  }

  private sweep(now: number) {
    for (const [key, w] of this.windows) {
      if (w.resetAt <= now) this.windows.delete(key);
    }
    // Still full of live windows (an attack): drop everything rather than grow.
    if (this.windows.size >= this.maxKeys) this.windows.clear();
  }
}
