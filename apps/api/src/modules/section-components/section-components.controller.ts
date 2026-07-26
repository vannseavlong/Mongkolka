import type { Request, Response } from "express";
import {
  SectionComponentsService,
  SECTIONS,
  type UpdateSectionComponentInput,
} from "./section-components.service.js";

export const SectionComponentsController = {
  async list(req: Request, res: Response) {
    const section = typeof req.query.section === "string" ? req.query.section : undefined;
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const components = await SectionComponentsService.list(section, status);
    res.json({ components });
  },

  async create(req: Request, res: Response) {
    const { component_id, section, name, preview_bg_color, preview_text_color, preview_accent_color, font_style } =
      req.body ?? {};

    if (typeof component_id !== "string" || typeof section !== "string" || typeof name !== "string") {
      res.status(400).json({ error: "component_id, section, and name are required" });
      return;
    }
    if (!(SECTIONS as readonly string[]).includes(section)) {
      res.status(400).json({ error: `section must be one of: ${SECTIONS.join(", ")}` });
      return;
    }

    const component = await SectionComponentsService.create({
      component_id,
      section,
      name,
      preview_bg_color,
      preview_text_color,
      preview_accent_color,
      font_style,
    });
    res.status(201).json({ component });
  },

  async update(req: Request, res: Response) {
    const { name, preview_bg_color, preview_text_color, preview_accent_color, font_style, status } =
      req.body ?? {};
    const input: UpdateSectionComponentInput = {};
    if (name !== undefined) input.name = name;
    if (preview_bg_color !== undefined) input.preview_bg_color = preview_bg_color;
    if (preview_text_color !== undefined) input.preview_text_color = preview_text_color;
    if (preview_accent_color !== undefined) input.preview_accent_color = preview_accent_color;
    if (font_style !== undefined) input.font_style = font_style;
    if (status !== undefined) input.status = status;

    const component = await SectionComponentsService.update(req.params.componentId as string, input);
    if (!component) {
      res.status(404).json({ error: "Component not found" });
      return;
    }
    res.json({ component });
  },

  async remove(req: Request, res: Response) {
    await SectionComponentsService.delete(req.params.componentId as string);
    res.status(204).end();
  },
};
