import type { Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import type { MultipartRequest } from "../../middlewares/multipart-upload.middleware.js";
import { WebsiteAssetsService } from "./website-assets.service.js";

type Req = CoupleRequest & MultipartRequest;

function tenant(req: CoupleRequest) {
  return { coupleId: req.coupleId as string, actorSheetId: req.coupleActorSheetId as string };
}

export const WebsiteAssetsController = {
  async list(req: CoupleRequest, res: Response) {
    res.json({ assets: await WebsiteAssetsService.list(tenant(req)) });
  },

  async upload(req: Req, res: Response) {
    const file = req.uploadedFile!;
    const result = await WebsiteAssetsService.upload(tenant(req), { body: file.buffer, mimeType: file.mimeType });
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(201).json({ asset: result.asset });
  },

  async usage(req: CoupleRequest, res: Response) {
    const usage = await WebsiteAssetsService.usage(tenant(req), req.params.id as string);
    if (!usage) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    res.json(usage);
  },

  async remove(req: CoupleRequest, res: Response) {
    const force = req.query.force === "true" || req.query.force === "1";
    const result = await WebsiteAssetsService.remove(tenant(req), req.params.id as string, force);
    if (!result.ok) {
      res.status(result.status).json({ error: result.error, ...(result.sections ? { sections: result.sections, cover: !!result.cover } : {}) });
      return;
    }
    res.status(204).end();
  },
};
