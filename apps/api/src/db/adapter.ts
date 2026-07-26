import fs from "node:fs";
import path from "node:path";
import { createSheetAdapter } from "longcelot-sheet-db";
import { env } from "../env.js";
import usersSchema from "../../schemas/admin/users.js";
import credentialsSchema from "../../schemas/admin/credentials.js";
import schemaVersionsSchema from "../../schemas/admin/schema_versions.js";

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
});

adapter.registerSchemas([usersSchema, credentialsSchema, schemaVersionsSchema]);

export function adminContext() {
  return adapter.withContext({
    userId: "system",
    actor: "admin",
    actorSheetId: env.ADMIN_SHEET_ID,
  });
}
