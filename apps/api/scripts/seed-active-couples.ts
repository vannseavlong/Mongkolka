/**
 * Seeds couple sheets for ACTIVE couples only (`lsdb seed --all-actors` cannot filter).
 *
 *   pnpm --filter api exec tsx scripts/seed-active-couples.ts <seed-file>            # dry run, writes nothing
 *   pnpm --filter api exec tsx scripts/seed-active-couples.ts <seed-file> --apply    # insert missing rows
 *   ... --apply --upsert                                                             # also overwrite existing rows
 *
 * The seed file has the `lsdb seed` shape, with couple tables only. The first column of each row is
 * the match key and must be unique. Writes to the sheets of the ADMIN_SHEET_ID in `.env`.
 */
import "dotenv/config";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { env } from "../src/config/env.js";
import { coupleContext } from "../src/config/database.js";
import { CouplesModel } from "../src/modules/couples/couples.model.js";
import { selectSeedTargets, validateSeedData, type SeedData } from "../src/utils/seed-targets.js";

import profile from "../schemas/couple/profile.js";
import websiteSections from "../schemas/couple/website_sections.js";
import guests from "../schemas/couple/guests.js";
import budgetCategories from "../schemas/couple/budget_categories.js";
import checklistItems from "../schemas/couple/checklist_items.js";
import milestones from "../schemas/couple/milestones.js";
import guestPhotos from "../schemas/couple/guest_photos.js";
import guestWishes from "../schemas/couple/guest_wishes.js";
import websiteAssets from "../schemas/couple/website_assets.js";

const COUPLE_TABLES = new Map(
  [profile, websiteSections, guests, budgetCategories, checklistItems, milestones, guestPhotos, guestWishes, websiteAssets].map(
    (s) => [s.name, s.columns],
  ),
);

async function loadSeed(file: string): Promise<SeedData> {
  const mod = await import(pathToFileURL(path.resolve(file)).href);
  const exported = mod.default ?? mod;
  return validateSeedData(typeof exported === "function" ? await exported(process.env) : exported, COUPLE_TABLES);
}

async function main() {
  const args = process.argv.slice(2);
  const unknown = args.filter((a) => a.startsWith("--") && a !== "--apply" && a !== "--upsert");
  const file = args.find((a) => !a.startsWith("--"));
  if (!file || unknown.length) throw new Error("usage: seed-active-couples.ts <seed-file> [--apply] [--upsert]");
  const apply = args.includes("--apply");
  const upsert = args.includes("--upsert");

  const data = await loadSeed(file);
  const couples = await CouplesModel.findMany();
  const targets = selectSeedTargets(couples);
  const rowCount = Object.values(data).reduce((n, rows) => n + rows.length, 0);

  console.log(`admin sheet: ${env.ADMIN_SHEET_ID}`);
  console.log(`${targets.length} active couples of ${couples.length}; ${rowCount} rows each`);
  for (const t of targets) console.log(`  ${t.slug} (${t.coupleId})`);
  if (!apply) {
    console.log("dry run: nothing written. Add --apply to seed.");
    return;
  }

  let failed = 0;
  for (const t of targets) {
    const ctx = coupleContext(t.actorSheetId);
    const done = { inserted: 0, upserted: 0, skipped: 0 };
    for (const [table, rows] of Object.entries(data)) {
      for (const row of rows) {
        const key = Object.keys(row)[0]!;
        try {
          if (upsert) {
            await ctx.table(table).upsert({ where: { [key]: row[key] }, data: row, skipFKValidation: true });
            done.upserted++;
          } else {
            await ctx.table(table).create(row, { skipFKValidation: true });
            done.inserted++;
          }
        } catch (err) {
          const message = (err as Error).message;
          if (!upsert && message.includes("Unique constraint")) done.skipped++;
          else {
            failed++;
            console.error(`  ${t.slug} ${table}: ${message}`);
          }
        }
      }
    }
    console.log(`${t.slug}: ${done.inserted} inserted, ${done.upserted} upserted, ${done.skipped} skipped`);
  }
  if (failed) throw new Error(`${failed} rows failed`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error((err as Error).message);
    process.exit(1);
  });
