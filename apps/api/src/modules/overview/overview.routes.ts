import { Router } from "express";
import { OverviewController } from "./overview.controller.js";

export const overviewRouter = Router();

overviewRouter.get("/overview", OverviewController.get);
