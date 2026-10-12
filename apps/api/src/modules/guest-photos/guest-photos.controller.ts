import type { Request, Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { GuestPhotosService } from "./guest-photos.service.js";
import { PHOTO_STATUSES, type PhotoStatus } from "./guest-photos.limits.js";

function header(req: Request, name: string): string | undefined {
  const v = req.headers[name];
  return typeof v === "string" ? v : undefined;
}

export const PublicGuestPhotosController = {
  async upload(req: Request, res: Response) {
    if (!Buffer.isBuffer(req.body)) {
      res.status(415).json({ error: "unsupported_type" });
      return;
    }
    const result = await GuestPhotosService.upload(req.params.slug as string, {
      body: req.body,
      mimeType: (header(req, "content-type") ?? "").split(";")[0]!.trim().toLowerCase(),
      ip: req.ip ?? "unknown",
      uploaderName: header(req, "x-uploader-name"),
      uploaderToken: header(req, "x-uploader-token")?.slice(0, 64),
    });
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(202).json({ photo_id: result.photo_id, status: result.status });
  },

  async list(req: Request, res: Response) {
    const photos = await GuestPhotosService.listPublic(req.params.slug as string);
    if (!photos) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
    res.json({ photos });
  },
};

export const CoupleGuestPhotosController = {
  async list(req: CoupleRequest, res: Response) {
    const photos = await GuestPhotosService.list(req.coupleActorSheetId as string);
    res.json({ photos });
  },

  async setStatus(req: CoupleRequest, res: Response) {
    const status = req.body?.status as PhotoStatus | undefined;
    if (!status || !(PHOTO_STATUSES as readonly string[]).includes(status)) {
      res.status(400).json({ error: "status must be pending, approved or hidden" });
      return;
    }
    const ok = await GuestPhotosService.setStatus(
      req.coupleActorSheetId as string,
      req.params.photoId as string,
      status,
    );
    if (!ok) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.json({ ok: true });
  },

  async remove(req: CoupleRequest, res: Response) {
    const ok = await GuestPhotosService.remove(
      req.coupleActorSheetId as string,
      req.params.photoId as string,
    );
    if (!ok) {
      res.status(404).json({ error: "Photo not found" });
      return;
    }
    res.status(204).end();
  },

  async removeMany(req: CoupleRequest, res: Response) {
    const ids = req.body?.ids;
    if (!Array.isArray(ids) || ids.length === 0 || ids.length > 100 || ids.some((i) => typeof i !== "string")) {
      res.status(400).json({ error: "ids must be 1-100 photo ids" });
      return;
    }
    const removed = await GuestPhotosService.removeMany(req.coupleActorSheetId as string, ids as string[]);
    res.json({ removed });
  },
};
