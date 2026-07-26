import { Router } from "express";
import { coupleOverviewRouter } from "../modules/couple-overview/couple-overview.routes.js";
import { coupleProfileRouter } from "../modules/couple-profile/couple-profile.routes.js";
import { coupleMembersRouter } from "../modules/couple-members/couple-members.routes.js";
import { coupleGuestsRouter } from "../modules/couple-guests/couple-guests.routes.js";
import { coupleBudgetRouter } from "../modules/couple-budget/couple-budget.routes.js";
import { coupleChecklistRouter } from "../modules/couple-checklist/couple-checklist.routes.js";
import { coupleMilestonesRouter } from "../modules/couple-milestones/couple-milestones.routes.js";
import { coupleWebsiteRouter } from "../modules/couple-website/couple-website.routes.js";

export const coupleApiRouter = Router();

coupleApiRouter.use(coupleOverviewRouter);
coupleApiRouter.use(coupleProfileRouter);
coupleApiRouter.use(coupleMembersRouter);
coupleApiRouter.use(coupleGuestsRouter);
coupleApiRouter.use(coupleBudgetRouter);
coupleApiRouter.use(coupleChecklistRouter);
coupleApiRouter.use(coupleMilestonesRouter);
coupleApiRouter.use(coupleWebsiteRouter);
