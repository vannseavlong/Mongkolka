import { Router } from "express";
import { requireAuth, requireRole } from "../middlewares/auth.middleware.js";
import { overviewRouter } from "../modules/overview/overview.routes.js";
import { usersRouter } from "../modules/users/users.routes.js";
import { couplesRouter } from "../modules/couples/couples.routes.js";
import { vendorsRouter } from "../modules/vendors/vendors.routes.js";
import { vendorCategoriesRouter } from "../modules/vendor-categories/vendor-categories.routes.js";
import { siteTemplatesRouter } from "../modules/site-templates/site-templates.routes.js";
import { sectionComponentsRouter } from "../modules/section-components/section-components.routes.js";

export const adminApiRouter = Router();

adminApiRouter.use(requireAuth(), requireRole("admin"));

adminApiRouter.use(overviewRouter);
adminApiRouter.use(usersRouter);
adminApiRouter.use(couplesRouter);
adminApiRouter.use(vendorsRouter);
adminApiRouter.use(vendorCategoriesRouter);
adminApiRouter.use(siteTemplatesRouter);
adminApiRouter.use(sectionComponentsRouter);
