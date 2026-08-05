import { Router } from "express";
import { ThemesController } from "./themes.controller.js";

export const themesRouter = Router();

themesRouter.get("/themes", ThemesController.list);
themesRouter.post("/themes", ThemesController.create);
themesRouter.patch("/themes/:themeId", ThemesController.update);
themesRouter.delete("/themes/:themeId", ThemesController.remove);
themesRouter.patch("/themes/:themeId/activate", ThemesController.activate);
