import { Router } from "express";
import { PublicThemeController } from "./public-theme.controller.js";

export const publicThemeRouter = Router();

publicThemeRouter.get("/active-theme", PublicThemeController.getActive);
