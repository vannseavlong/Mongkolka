import { Router } from "express";
import { WebsiteTemplatesController } from "./website-templates.controller.js";

export const websiteTemplatesRouter = Router();

websiteTemplatesRouter.get("/website-templates", WebsiteTemplatesController.list);
websiteTemplatesRouter.post("/website-templates", WebsiteTemplatesController.create);
websiteTemplatesRouter.patch("/website-templates/:templateId", WebsiteTemplatesController.update);
websiteTemplatesRouter.delete("/website-templates/:templateId", WebsiteTemplatesController.remove);
