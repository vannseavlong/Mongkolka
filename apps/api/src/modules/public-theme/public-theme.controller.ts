import type { Request, Response } from "express";
import { PublicThemeService } from "./public-theme.service.js";

export const PublicThemeController = {
  async getActive(req: Request, res: Response) {
    const app = req.query.app;
    if (app !== "web" && app !== "couple") {
      res.status(400).json({ error: 'app query param must be "web" or "couple"' });
      return;
    }
    const theme = await PublicThemeService.getActiveTheme(app);
    if (!theme) {
      res.status(404).json({ error: "No active theme" });
      return;
    }
    res.json(theme);
  },
};
