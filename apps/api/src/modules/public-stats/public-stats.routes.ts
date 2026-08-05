import { Router } from "express";
import { PublicStatsController } from "./public-stats.controller.js";

export const publicStatsRouter = Router();

publicStatsRouter.get("/stats", PublicStatsController.list);
