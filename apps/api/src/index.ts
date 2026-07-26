import "dotenv/config";
import cors from "cors";
import express from "express";
import { adminAuth } from "./modules/auth/admin-auth.router.js";
import { coupleAuth } from "./modules/auth/couple-auth.router.js";
import { vendorAuth } from "./modules/auth/vendor-auth.router.js";
import { adminApiRouter } from "./routes/admin-api.routes.js";
import { vendorApiRouter } from "./routes/vendor-api.routes.js";
import { env } from "./config/env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(adminAuth.handler);
app.use(coupleAuth.handler);
app.use(vendorAuth.handler);

app.use("/admin/api", adminApiRouter);
app.use("/vendor/api", vendorApiRouter);

app.listen(env.PORT, () => {
  console.log(`api listening on port ${env.PORT}`);
});
