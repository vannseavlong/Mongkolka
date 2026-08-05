import { Router } from "express";
import { StatsController } from "./stats.controller.js";

export const statsRouter = Router();

statsRouter.get("/stats", StatsController.list);
statsRouter.post("/stats", StatsController.create);
statsRouter.patch("/stats/:statId", StatsController.update);
statsRouter.delete("/stats/:statId", StatsController.remove);
