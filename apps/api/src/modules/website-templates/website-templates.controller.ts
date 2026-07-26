import type { Request, Response } from "express";
import {
  WebsiteTemplatesService,
  WEBSITE_SECTIONS,
  type UpdateWebsiteTemplateInput,
} from "./website-templates.service.js";

export const WebsiteTemplatesController = {
  async list(req: Request, res: Response) {
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const templates = await WebsiteTemplatesService.list(section, status);
    res.json({ templates });
  },

  async create(req: Request, res: Response) {
    const {
      template_id,
      section,
      name,
      preview_bg_color,
      preview_text_color,
      preview_accent_color,
      font_style,
    } = req.body ?? {};

    if (typeof template_id !== "string" || typeof section !== "string" || typeof name !== "string") {
      res.status(400).json({ error: "template_id, section, and name are required" });
      return;
    }
    if (!(WEBSITE_SECTIONS as readonly string[]).includes(section)) {
      res.status(400).json({ error: `section must be one of: ${WEBSITE_SECTIONS.join(", ")}` });
      return;
    }

    const template = await WebsiteTemplatesService.create({
      template_id,
      section,
      name,
      preview_bg_color,
      preview_text_color,
      preview_accent_color,
      font_style,
    });
    res.status(201).json({ template });
  },

  async update(req: Request, res: Response) {
    const { name, preview_bg_color, preview_text_color, preview_accent_color, font_style, status } =
      req.body ?? {};
    const input: UpdateWebsiteTemplateInput = {};
    if (name !== undefined) input.name = name;
    if (preview_bg_color !== undefined) input.preview_bg_color = preview_bg_color;
    if (preview_text_color !== undefined) input.preview_text_color = preview_text_color;
    if (preview_accent_color !== undefined) input.preview_accent_color = preview_accent_color;
    if (font_style !== undefined) input.font_style = font_style;
    if (status !== undefined) input.status = status;

    const updated = await WebsiteTemplatesService.update(req.params.templateId as string, input);
    if (!updated) {
      res.status(404).json({ error: "Template not found" });
      return;
    }
    res.json({ template: updated });
  },

  async remove(req: Request, res: Response) {
    await WebsiteTemplatesService.delete(req.params.templateId as string);
    res.status(204).end();
  },
};
