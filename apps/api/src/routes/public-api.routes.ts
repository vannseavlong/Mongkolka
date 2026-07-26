import { Router } from "express";
import { publicSiteRouter } from "../modules/public-site/public-site.routes.js";

export const publicApiRouter = Router();

publicApiRouter.use(publicSiteRouter);
