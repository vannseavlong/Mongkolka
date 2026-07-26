import { Router } from "express";
import { adapter, adminContext } from "../db/adapter.js";
import { requireAuth, requireRole } from "../auth/verifyJwt.js";

export const adminRouter = Router();

adminRouter.use(requireAuth(), requireRole("admin"));

adminRouter.get("/users", async (req, res) => {
  const status = typeof req.query.status === "string" ? req.query.status : undefined;
  const users = await adminContext()
    .table("users")
    .findMany({ where: status ? { status } : undefined });
  res.json({ users });
});

adminRouter.post("/users/:userId/approve", async (req, res) => {
  const ctx = adminContext();
  const user = await ctx.table("users").findOne({ where: { user_id: req.params.userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  if (user.status === "active") {
    res.json({ user });
    return;
  }

  const actorSheetId = await adapter.createUserSheet(
    user.user_id as string,
    user.role as string,
    user.email as string,
  );
  await ctx.table("users").update({
    where: { user_id: user.user_id },
    data: { status: "active", actor_sheet_id: actorSheetId },
  });
  const updated = await ctx.table("users").findOne({ where: { user_id: user.user_id } });
  res.json({ user: updated });
});

adminRouter.post("/users/:userId/reject", async (req, res) => {
  const ctx = adminContext();
  await ctx.table("users").update({
    where: { user_id: req.params.userId },
    data: { status: "inactive" },
  });
  const updated = await ctx.table("users").findOne({ where: { user_id: req.params.userId } });
  if (!updated) {
    res.status(404).json({ error: "User not found" });
    return;
  }
  res.json({ user: updated });
});
