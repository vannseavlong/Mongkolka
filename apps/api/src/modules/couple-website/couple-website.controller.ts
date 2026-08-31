import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { CoupleWebsiteService } from "./couple-website.service.js";

export const CoupleWebsiteController = {
  async getCatalog(_req: CoupleRequest, res: Response) {
    const catalog = await CoupleWebsiteService.getCatalog();
    res.json(catalog);
  },

  async getSettings(req: CoupleRequest, res: Response) {
    const settings = await CoupleWebsiteService.getSettings(
      req.coupleId as string,
      req.coupleActorSheetId as string,
    );
    res.json({ settings });
  },

  async selectTemplate(req: CoupleRequest, res: Response) {
    const templateId = req.body?.template_id;
    if (typeof templateId !== "string" || !templateId) {
      res.status(400).json({ error: "template_id is required" });
      return;
    }
    await CoupleWebsiteService.selectTemplate(req.coupleActorSheetId as string, templateId);
    const settings = await CoupleWebsiteService.getSettings(
      req.coupleId as string,
      req.coupleActorSheetId as string,
    );
    res.json({ settings });
  },

  async updateTheme(req: CoupleRequest, res: Response) {
    const themeOverride = req.body?.theme_override;
    if (typeof themeOverride !== "object" || themeOverride === null) {
      res.status(400).json({ error: "theme_override is required" });
      return;
    }
    await CoupleWebsiteService.updateTheme(req.coupleActorSheetId as string, themeOverride);
    const settings = await CoupleWebsiteService.getSettings(
      req.coupleId as string,
      req.coupleActorSheetId as string,
    );
    res.json({ settings });
  },

  async listSections(req: CoupleRequest, res: Response) {
    const sections = await CoupleWebsiteService.listSections(req.coupleActorSheetId as string);
    res.json({ sections });
  },

  async updateSection(req: CoupleRequest, res: Response) {
    const section = await CoupleWebsiteService.updateSection(
      req.coupleActorSheetId as string,
      req.params.sectionId as string,
      req.body ?? {},
    );
    if (!section) {
      res.status(404).json({ error: "Section not found" });
      return;
    }
    res.json({ section });
  },

  async reorderSections(req: CoupleRequest, res: Response) {
    const sectionIds = req.body?.section_ids;
    if (!Array.isArray(sectionIds)) {
      res.status(400).json({ error: "section_ids must be an array" });
      return;
    }
    const sections = await CoupleWebsiteService.reorderSections(
      req.coupleActorSheetId as string,
      sectionIds,
    );
    res.json({ sections });
  },

  async publish(req: CoupleRequest, res: Response) {
    try {
      const couple = await CoupleWebsiteService.publish(
        req.coupleId as string,
        req.coupleActorSheetId as string,
      );
      res.json({ couple });
    } catch (err) {
      res.status(409).json({ error: (err as Error).message });
    }
  },

  async unpublish(req: CoupleRequest, res: Response) {
    const couple = await CoupleWebsiteService.unpublish(req.coupleId as string);
    res.json({ couple });
  },

  async updateSlug(req: CoupleRequest, res: Response) {
    const slug = req.body?.slug;
    if (typeof slug !== "string" || !slug) {
      res.status(400).json({ error: "slug is required" });
      return;
    }
    try {
      const couple = await CoupleWebsiteService.updateSlug(req.coupleId as string, slug);
      res.json({ couple });
    } catch (err) {
      res.status(409).json({ error: (err as Error).message });
    }
  },
};
