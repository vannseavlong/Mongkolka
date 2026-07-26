import { Router } from "express";
import { SectionComponentsController } from "./section-components.controller.js";

export const sectionComponentsRouter = Router();

sectionComponentsRouter.get("/section-components", SectionComponentsController.list);
sectionComponentsRouter.post("/section-components", SectionComponentsController.create);
sectionComponentsRouter.patch(
  "/section-components/:componentId",
  SectionComponentsController.update,
);
sectionComponentsRouter.delete(
  "/section-components/:componentId",
  SectionComponentsController.remove,
);
