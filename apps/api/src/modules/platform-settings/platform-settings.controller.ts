import type { Request, Response } from "express";
import { parseAssetLimitsInput } from "./platform-settings.core.js";
import { PlatformSettingsService } from "./platform-settings.service.js";

export const PlatformSettingsController = {
  async getUploads(_req: Request, res: Response) {
    res.json(await PlatformSettingsService.getAssetLimitsView());
  },

  async updateUploads(req: Request, res: Response) {
    const parsed = parseAssetLimitsInput(req.body);
    if (!parsed.ok) {
      res.status(400).json({ error: parsed.error });
      return;
    }
    res.json(await PlatformSettingsService.updateAssetLimits(parsed.patch));
  },
};
