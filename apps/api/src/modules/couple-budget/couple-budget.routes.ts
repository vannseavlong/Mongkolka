import { Router } from "express";
import { requireAuth, requireRole } from "../../middlewares/auth.middleware.js";
import { requireActiveCouple } from "../../middlewares/couple-context.middleware.js";
import { CoupleBudgetController } from "./couple-budget.controller.js";

export const coupleBudgetRouter = Router();

coupleBudgetRouter.use(requireAuth(), requireRole("couple"), requireActiveCouple);
coupleBudgetRouter.get("/budget-categories", CoupleBudgetController.list);
coupleBudgetRouter.post("/budget-categories", CoupleBudgetController.create);
coupleBudgetRouter.patch("/budget-categories/:categoryId", CoupleBudgetController.update);
coupleBudgetRouter.delete("/budget-categories/:categoryId", CoupleBudgetController.remove);
