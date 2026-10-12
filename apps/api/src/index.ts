import "dotenv/config";
import cors from "cors";
import express from "express";
// Express 4 doesn't catch rejected promises thrown from async route handlers —
// without this, any async error (a Sheets API rate limit, a bad ref lookup, etc.)
// becomes an unhandled rejection that crashes the whole process. Must be
// imported before any routes are registered.
import "express-async-errors";
import { adminAuth } from "./modules/auth/admin-auth.router.js";
import { coupleAuth } from "./modules/auth/couple-auth.router.js";
import { vendorAuth } from "./modules/auth/vendor-auth.router.js";
import { passwordAuthRouter } from "./modules/auth/password-auth.routes.js";
import { registrationRouter } from "./modules/auth/registration.routes.js";
import { adminApiRouter } from "./routes/admin-api.routes.js";
import { coupleApiRouter } from "./routes/couple-api.routes.js";
import { vendorApiRouter } from "./routes/vendor-api.routes.js";
import { publicApiRouter } from "./routes/public-api.routes.js";
import { env } from "./config/env.js";
import { localUploadsRoot } from "./services/storage/local.driver.js";
import { GuestPhotosQueue } from "./modules/guest-photos/guest-photos.queue.js";
import { GuestWishesQueue } from "./modules/guest-wishes/guest-wishes.queue.js";

const app = express();

app.use(cors());
app.use(express.json());

if (env.PHOTO_STORAGE === "local") {
  // Keys are random UUIDs and never change, so cache aggressively; nosniff stops a
  // mislabelled upload from being interpreted as HTML/script.
  app.use(
    "/uploads",
    express.static(localUploadsRoot(env.PHOTO_LOCAL_DIR), {
      maxAge: "365d",
      immutable: true,
      index: false,
      setHeaders: (res) => res.set("X-Content-Type-Options", "nosniff"),
    }),
  );
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(adminAuth.handler);
app.use(coupleAuth.handler);
app.use(vendorAuth.handler);
app.use(passwordAuthRouter("admin"));
app.use(passwordAuthRouter("couple"));
app.use(passwordAuthRouter("vendor"));
app.use(registrationRouter);

app.use("/admin/api", adminApiRouter);
app.use("/couple/api", coupleApiRouter);
app.use("/vendor/api", vendorApiRouter);
app.use("/public/api", publicApiRouter);

// Express identifies error-handling middleware by arity; `next` must stay unused.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  // body-parser errors (payload too large, malformed JSON) carry their own 4xx status.
  const status = (err as { status?: number; statusCode?: number })?.status ?? (err as { statusCode?: number })?.statusCode;
  if (typeof status === "number" && status >= 400 && status < 500) {
    res.status(status).json({ error: status === 413 ? "too_large" : "bad_request" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const server = app.listen(env.PORT, () => {
  console.log(`api listening on port ${env.PORT}`);
});

// Un-flushed guest photo metadata lives in memory; write it out before exiting.
for (const signal of ["SIGINT", "SIGTERM"] as const) {
  process.on(signal, () => {
    server.close();
    Promise.all([GuestPhotosQueue.flushAll(), GuestWishesQueue.flushAll()])
      .catch((err) => console.error("[guest-photos] flush on shutdown failed", err))
      .finally(() => process.exit(0));
  });
}
