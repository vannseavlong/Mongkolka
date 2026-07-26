import "dotenv/config";
import cors from "cors";
import express from "express";
import { adminAuth } from "./auth/admin.js";
import { coupleAuth } from "./auth/couple.js";
import { vendorAuth } from "./auth/vendor.js";
import { adminRouter } from "./routes/admin.js";
import { env } from "./env.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(adminAuth.handler);
app.use(coupleAuth.handler);
app.use(vendorAuth.handler);

app.use("/admin/api", adminRouter);

app.listen(env.PORT, () => {
  console.log(`api listening on port ${env.PORT}`);
});
