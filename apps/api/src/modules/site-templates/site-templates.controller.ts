import type { Request, Response } from "express";
import {
  SiteTemplatesService,
  type UpdateSiteTemplateInput,
} from "./site-templates.service.js";

export const SiteTemplatesController = {
  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const templates = await SiteTemplatesService.list(status);
    res.json({ templates });
  },

  async create(req: Request, res: Response) {
    const { template_id, name, default_theme, default_components } = req.body ?? {};
    if (typeof template_id !== "string" || typeof name !== "string") {
      res.status(400).json({ error: "template_id and name are required" });
      return;
    }
    const template = await SiteTemplatesService.create({
      template_id,
      name,
      default_theme: default_theme ?? {},
      default_components: default_components ?? {},
    });
    res.status(201).json({ template });
  },

  async update(req: Request, res: Response) {
    const { name, default_theme, default_components, status } = req.body ?? {};
    const input: UpdateSiteTemplateInput = {};
    if (name !== undefined) input.name = name;
    if (default_theme !== undefined) input.default_theme = default_theme;
    if (default_components !== undefined) input.default_components = default_components;
    if (status !== undefined) input.status = status;

    const template = await SiteTemplatesService.update(req.params.templateId as string, input);
    if (!template) {
      res.status(404).json({ error: "Template not found" });
      return;
    }
    res.json({ template });
  },

  async remove(req: Request, res: Response) {
    await SiteTemplatesService.delete(req.params.templateId as string);
    res.status(204).end();
  },
};
