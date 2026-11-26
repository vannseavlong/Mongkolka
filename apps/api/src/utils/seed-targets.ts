export type CoupleRow = Record<string, unknown>;
export type SeedTarget = { coupleId: string; slug: string; actorSheetId: string };
export type SeedData = Record<string, Record<string, unknown>[]>;
type Columns = Record<string, { unique?: boolean }>;

/** Only `active` couples that already have a sheet, one entry per sheet. */
export function selectSeedTargets(couples: CoupleRow[]): SeedTarget[] {
  const targets = new Map<string, SeedTarget>();
  for (const c of couples) {
    const actorSheetId = String(c.actor_sheet_id ?? "");
    if (c.status !== "active" || !actorSheetId) continue;
    targets.set(actorSheetId, { coupleId: String(c.couple_id), slug: String(c.slug ?? ""), actorSheetId });
  }
  return [...targets.values()];
}

/**
 * Rejects a seed file before anything is written: couple tables only, and every row must start with a
 * unique column (the match key, as in `lsdb seed`) so running it twice cannot duplicate rows.
 */
export function validateSeedData(data: unknown, tables: Map<string, Columns>): SeedData {
  if (!data || typeof data !== "object" || Object.keys(data).length === 0) {
    throw new Error("seed file must export { table_name: rows[] }");
  }
  for (const [table, rows] of Object.entries(data)) {
    const columns = tables.get(table);
    if (!columns) throw new Error(`"${table}" is not a couple table`);
    if (!Array.isArray(rows)) throw new Error(`"${table}" must be an array of rows`);
    for (const row of rows) {
      const key = Object.keys(row ?? {})[0];
      if (!key || !columns[key]?.unique || row[key] === undefined || row[key] === "") {
        throw new Error(`every "${table}" row must start with a unique column that has a value`);
      }
    }
  }
  return data as SeedData;
}
