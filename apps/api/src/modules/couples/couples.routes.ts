import { Router } from "express";
import { CouplesController } from "./couples.controller.js";

export const couplesRouter = Router();

couplesRouter.get("/couples", CouplesController.list);
couplesRouter.post("/couples/:coupleId/suspend", CouplesController.suspend);
couplesRouter.post("/couples/:coupleId/reactivate", CouplesController.reactivate);
