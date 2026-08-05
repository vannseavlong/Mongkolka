import type { Request, Response } from "express";
import { ThemesService, type ThemeScope, type UpdateThemeInput } from "./themes.service.js";

export const ThemesController = {
  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const themes = await ThemesService.list(status);
    res.json({ themes });
  },

  async create(req: Request, res: Response) {
    const { theme_id, name, description, tokens } = req.body ?? {};
    if (typeof theme_id !== "string" || !theme_id.trim() || typeof name !== "string" || !name.trim()) {
      res.status(400).json({ error: "theme_id and name are required" });
      return;
    }
    const theme = await ThemesService.create({
      theme_id,
      name,
      description: typeof description === "string" ? description : undefined,
      tokens: tokens ?? {},
    });
    res.status(201).json({ theme });
  },

  async update(req: Request, res: Response) {
    const { name, description, tokens, status } = req.body ?? {};
    const input: UpdateThemeInput = {};
    if (name !== undefined) input.name = name;
    if (description !== undefined) input.description = description;
    if (tokens !== undefined) input.tokens = tokens;
    if (status !== undefined) input.status = status;

    const theme = await ThemesService.update(req.params.themeId as string, input);
    if (!theme) {
      res.status(404).json({ error: "Theme not found" });
      return;
    }
    res.json({ theme });
  },

  async remove(req: Request, res: Response) {
    try {
      await ThemesService.remove(req.params.themeId as string);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
      return;
    }
    res.status(204).end();
  },

  async activate(req: Request, res: Response) {
    const scope = req.body?.scope;
    if (scope !== "web" && scope !== "couple") {
      res.status(400).json({ error: 'scope must be "web" or "couple"' });
      return;
    }
    try {
      const theme = await ThemesService.activate(req.params.themeId as string, scope as ThemeScope);
      res.json({ theme });
    } catch (err) {
      res.status(404).json({ error: (err as Error).message });
    }
  },
};
