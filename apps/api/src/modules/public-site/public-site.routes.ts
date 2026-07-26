import { Router } from "express";
import { PublicSiteController } from "./public-site.controller.js";

export const publicSiteRouter = Router();

publicSiteRouter.get("/site/:slug", PublicSiteController.get);
publicSiteRouter.post("/site/:slug/rsvp", PublicSiteController.submitRsvp);
