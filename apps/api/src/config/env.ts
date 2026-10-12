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

  // Guest photo storage. "local" writes under PHOTO_LOCAL_DIR and serves /uploads from this
  // API (fine for dev/pilot, single instance); "s3" targets any S3-compatible bucket (R2, S3).
  PHOTO_STORAGE: (process.env.PHOTO_STORAGE ?? "local") as "local" | "s3",
  PHOTO_LOCAL_DIR: process.env.PHOTO_LOCAL_DIR ?? "uploads",
  // Public base URL of this API, used to build local photo URLs.
  PUBLIC_API_URL: process.env.PUBLIC_API_URL ?? `http://localhost:${process.env.PORT ?? "4000"}`,
  S3_ENDPOINT: process.env.S3_ENDPOINT ?? "",
  S3_REGION: process.env.S3_REGION ?? "auto",
  S3_BUCKET: process.env.S3_BUCKET ?? "",
  S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID ?? "",
  S3_SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY ?? "",
  // Public/CDN base URL objects are readable from, e.g. https://photos.example.com
  S3_PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL ?? "",

  LSDB_TOKENS_FILE: process.env.LSDB_TOKENS_FILE ?? ".lsdb-tokens.json",
};
