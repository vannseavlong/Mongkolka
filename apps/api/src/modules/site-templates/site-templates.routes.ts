import { Router } from "express";
import { SiteTemplatesController } from "./site-templates.controller.js";

export const siteTemplatesRouter = Router();

siteTemplatesRouter.get("/site-templates", SiteTemplatesController.list);
siteTemplatesRouter.post("/site-templates", SiteTemplatesController.create);
siteTemplatesRouter.patch("/site-templates/:templateId", SiteTemplatesController.update);
siteTemplatesRouter.delete("/site-templates/:templateId", SiteTemplatesController.remove);
