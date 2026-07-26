export const env = {
  PORT: process.env.PORT ?? "4000",

  JWT_SECRET: process.env.JWT_SECRET ?? "",

  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  // Redirect URI for the backend's own Sheets/Drive OAuth (same one used by `lsdb sync`) —
  // distinct from the three portal login redirect URIs below.
  GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI ?? "http://localhost:3000/auth/callback",

  ADMIN_SHEET_ID: process.env.ADMIN_SHEET_ID ?? "",

  ADMIN_GOOGLE_REDIRECT_URI:
    process.env.ADMIN_GOOGLE_REDIRECT_URI ?? "http://localhost:4000/admin/auth/callback",
  COUPLE_GOOGLE_REDIRECT_URI:
    process.env.COUPLE_GOOGLE_REDIRECT_URI ?? "http://localhost:4000/couple/auth/callback",
  VENDOR_GOOGLE_REDIRECT_URI:
    process.env.VENDOR_GOOGLE_REDIRECT_URI ?? "http://localhost:4000/vendor/auth/callback",

  ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL ?? "http://localhost:3001",
  COUPLE_FRONTEND_URL: process.env.COUPLE_FRONTEND_URL ?? "http://localhost:3002",
  VENDOR_FRONTEND_URL: process.env.VENDOR_FRONTEND_URL ?? "http://localhost:3003",

  LSDB_TOKENS_FILE: process.env.LSDB_TOKENS_FILE ?? ".lsdb-tokens.json",
};
