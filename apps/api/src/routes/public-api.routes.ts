import { Router } from "express";
import { publicSiteRouter } from "../modules/public-site/public-site.routes.js";
import { publicMarketplaceRouter } from "../modules/public-marketplace/public-marketplace.routes.js";
import { publicThemeRouter } from "../modules/public-theme/public-theme.routes.js";
import { publicStatsRouter } from "../modules/public-stats/public-stats.routes.js";
import { publicContactRouter } from "../modules/public-contact/public-contact.routes.js";

export const publicApiRouter = Router();

publicApiRouter.use(publicSiteRouter);
publicApiRouter.use(publicMarketplaceRouter);
publicApiRouter.use(publicThemeRouter);
publicApiRouter.use(publicStatsRouter);
publicApiRouter.use(publicContactRouter);
