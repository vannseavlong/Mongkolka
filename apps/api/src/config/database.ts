import fs from "node:fs";
import path from "node:path";
import { createSheetAdapter } from "longcelot-sheet-db";
import { env } from "./env.js";

import usersSchema from "../../schemas/admin/users.js";
import credentialsSchema from "../../schemas/admin/credentials.js";
import schemaVersionsSchema from "../../schemas/admin/schema_versions.js";
import couplesSchema from "../../schemas/admin/couples.js";
import coupleMembersSchema from "../../schemas/admin/couple_members.js";
import vendorsSchema from "../../schemas/admin/vendors.js";
import vendorCategoriesSchema from "../../schemas/admin/vendor_categories.js";
import siteTemplatesSchema from "../../schemas/admin/site_templates.js";
import themesSchema from "../../schemas/admin/themes.js";
import statsSchema from "../../schemas/admin/stats.js";
import contactMessagesSchema from "../../schemas/admin/contact_messages.js";
import sectionComponentsSchema from "../../schemas/admin/section_components.js";
import bookingsSchema from "../../schemas/admin/bookings.js";

import coupleProfileSchema from "../../schemas/couple/profile.js";
import websiteSectionsSchema from "../../schemas/couple/website_sections.js";
import guestsSchema from "../../schemas/couple/guests.js";
import budgetCategoriesSchema from "../../schemas/couple/budget_categories.js";
import checklistItemsSchema from "../../schemas/couple/checklist_items.js";
import milestonesSchema from "../../schemas/couple/milestones.js";

import vendorProfileSchema from "../../schemas/vendor/profile.js";
import portfolioItemsSchema from "../../schemas/vendor/portfolio_items.js";
import servicesSchema from "../../schemas/vendor/services.js";

function loadTokens(): unknown {
  const tokenFile = path.resolve(process.cwd(), env.LSDB_TOKENS_FILE);
  if (!fs.existsSync(tokenFile)) return undefined;
  return JSON.parse(fs.readFileSync(tokenFile, "utf-8"));
}

export const adapter = createSheetAdapter({
  adminSheetId: env.ADMIN_SHEET_ID,
  credentials: {
    clientId: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    redirectUri: env.GOOGLE_REDIRECT_URI,
  },
  tokens: loadTokens(),
  onSchemaMismatch: "warn",
  // Default is 2s; every authenticated request re-resolves its actor via 2-3
  // reads of the same admin tables (users/couples/couple_members/vendors),
  // which burns through Sheets' per-minute read quota fast under normal
  // traffic. Widening this is the package's own recommended fix for a
  // read-heavy app (see README "Read caching"); writes still invalidate the
  // affected tab immediately, so this only delays visibility of changes made
  // outside this adapter instance (e.g. a human editing the sheet directly).
  cache: { ttlMs: 15_000 },
});

adapter.registerSchemas([
  usersSchema,
  credentialsSchema,
  schemaVersionsSchema,
  couplesSchema,
  coupleMembersSchema,
  vendorsSchema,
  vendorCategoriesSchema,
  siteTemplatesSchema,
  themesSchema,
  statsSchema,
  contactMessagesSchema,
  sectionComponentsSchema,
  bookingsSchema,
  coupleProfileSchema,
  websiteSectionsSchema,
  guestsSchema,
  budgetCategoriesSchema,
  checklistItemsSchema,
  milestonesSchema,
  vendorProfileSchema,
  portfolioItemsSchema,
  servicesSchema,
]);

export function adminContext() {
  return adapter.withContext({
    userId: "system",
    actor: "admin",
    actorSheetId: env.ADMIN_SHEET_ID,
  });
}

export function coupleContext(actorSheetId: string) {
  return adapter.withContext({
    userId: "system",
    actor: "couple",
    actorSheetId,
  });
}

export function vendorContext(actorSheetId: string) {
  return adapter.withContext({
    userId: "system",
    actor: "vendor",
    actorSheetId,
  });
}
