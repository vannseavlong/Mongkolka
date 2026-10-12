interface Entry<V> {
  value: V;
  expiresAt: number;
}

/**
 * Tiny in-process TTL cache with in-flight de-duplication: concurrent misses for
 * the same key share one loader call instead of each hitting Sheets. Bounded by
 * `maxEntries` (oldest-inserted evicted first) so random keys can't grow it
 * without limit. Single-process only — see docs/tasks/guest-photos.md for what
 * changes if the API is ever run as more than one instance.
 */
export class TtlCache<V> {
  private readonly entries = new Map<string, Entry<V>>();
  private readonly inflight = new Map<string, Promise<V>>();
  /** Bumped by delete/clear so a load that started before an invalidation can't re-fill the cache. */
  private generation = 0;

  constructor(
    private readonly ttlMs: number,
    private readonly maxEntries = 500,
  ) {}

  get(key: string): V | undefined {
    const hit = this.entries.get(key);
    if (!hit) return undefined;
    if (hit.expiresAt <= Date.now()) {
      this.entries.delete(key);
      return undefined;
    }
    return hit.value;
  }

  set(key: string, value: V, ttlMs = this.ttlMs): void {
    this.entries.delete(key);
    this.entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    while (this.entries.size > this.maxEntries) {
      const oldest = this.entries.keys().next().value;
      if (oldest === undefined) break;
      this.entries.delete(oldest);
    }
  }

  /**
   * Returns the cached value or runs `loader` once for all concurrent callers.
   * `ttlFor` lets the caller pick a shorter TTL for particular results (e.g.
   * negative lookups).
   */
  async getOrLoad(key: string, loader: () => Promise<V>, ttlFor?: (value: V) => number): Promise<V> {
    const cached = this.get(key);
    if (cached !== undefined) return cached;

    const pending = this.inflight.get(key);
    if (pending) return pending;

    const startedAt = this.generation;
    const promise = loader()
      .then((value) => {
        if (startedAt === this.generation) this.set(key, value, ttlFor?.(value));
        return value;
      })
      .finally(() => {
        if (this.inflight.get(key) === promise) this.inflight.delete(key);
      });
    this.inflight.set(key, promise);
    return promise;
  }

  delete(key: string): void {
    this.generation++;
    this.entries.delete(key);
    this.inflight.delete(key);
  }

  /** Deletes every entry whose value matches. Cheap: the cache is small and bounded. */
  deleteWhere(predicate: (value: V, key: string) => boolean): void {
    this.generation++;
    for (const [key, entry] of this.entries) {
      if (predicate(entry.value, key)) this.entries.delete(key);
    }
    this.inflight.clear();
  }

  clear(): void {
    this.generation++;
    this.entries.clear();
    this.inflight.clear();
  }
}
