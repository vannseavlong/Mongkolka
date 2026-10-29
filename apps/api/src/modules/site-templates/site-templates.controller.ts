import type { Request, Response } from "express";
import {
  SiteTemplateInputError,
  SiteTemplatesService,
  type UpdateSiteTemplateInput,
} from "./site-templates.service.js";

const STATUSES = ["active", "inactive"];

export const SiteTemplatesController = {
  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const templates = await SiteTemplatesService.list(status);
    res.json({ templates });
  },

  async create(req: Request, res: Response) {
    const {
      template_id,
      name,
      slug,
      description,
      default_theme,
      default_components,
      default_sections,
    } = req.body ?? {};
    if (typeof template_id !== "string" || typeof name !== "string" || typeof slug !== "string") {
      res.status(400).json({ error: "template_id, name and slug are required" });
      return;
    }
    if (
      (description !== undefined && typeof description !== "string") ||
      (req.body?.status !== undefined && !STATUSES.includes(req.body.status))
    ) {
      res.status(400).json({
        error: "description must be a string and status active or inactive",
      });
      return;
    }
    try {
      const template = await SiteTemplatesService.create({
        template_id,
        name,
        slug,
        description,
        default_theme: default_theme ?? {},
        default_components: default_components ?? {},
        default_sections,
      });
      res.status(201).json({ template });
    } catch (err) {
      if (err instanceof SiteTemplateInputError) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  async update(req: Request, res: Response) {
    const { name, slug, description, default_theme, default_components, default_sections, status } =
      req.body ?? {};
    if (
      (slug !== undefined && typeof slug !== "string") ||
      (description !== undefined && typeof description !== "string") ||
      (status !== undefined && !STATUSES.includes(status))
    ) {
      res.status(400).json({
        error: "slug and description must be strings; status must be active or inactive",
      });
      return;
    }
    const input: UpdateSiteTemplateInput = {};
    if (name !== undefined) input.name = name;
    if (slug !== undefined) input.slug = slug;
    if (description !== undefined) input.description = description;
    if (default_theme !== undefined) input.default_theme = default_theme;
    if (default_components !== undefined) input.default_components = default_components;
    if (default_sections !== undefined) input.default_sections = default_sections;
    if (status !== undefined) input.status = status;

    try {
      const template = await SiteTemplatesService.update(req.params.templateId as string, input);
      if (!template) {
        res.status(404).json({ error: "Template not found" });
        return;
      }
      res.json({ template });
    } catch (err) {
      if (err instanceof SiteTemplateInputError) {
        res.status(err.status).json({ error: err.message });
        return;
      }
      throw err;
    }
  },

  /** Public: GET /public/api/site-templates/by-slug/:slug */
  async getBySlug(req: Request, res: Response) {
    const template = await SiteTemplatesService.getPublicBySlug(req.params.slug as string);
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
