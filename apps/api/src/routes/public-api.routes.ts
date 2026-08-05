import { Router } from "express";
import { publicSiteRouter } from "../modules/public-site/public-site.routes.js";
import { publicMarketplaceRouter } from "../modules/public-marketplace/public-marketplace.routes.js";
import { publicThemeRouter } from "../modules/public-theme/public-theme.routes.js";

export const publicApiRouter = Router();

publicApiRouter.use(publicSiteRouter);
publicApiRouter.use(publicMarketplaceRouter);
publicApiRouter.use(publicThemeRouter);
