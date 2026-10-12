import type { Request, Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { PHOTO_STATUSES, type PhotoStatus } from "../guest-photos/guest-photos.limits.js";
import { GuestWishesService } from "./guest-wishes.service.js";

export const PublicGuestWishesController = {
  async list(req: Request, res: Response) {
    const wishes = await GuestWishesService.listPublic(req.params.slug as string);
    if (!wishes) {
      res.status(404).json({ error: "Site not found" });
      return;
    }
    res.set("Cache-Control", "public, max-age=15, stale-while-revalidate=60");
    res.json({ wishes });
  },

  async submit(req: Request, res: Response) {
    const { name, message, photoId, gift } = req.body ?? {};
    const token = req.headers["x-uploader-token"];
    const result = await GuestWishesService.submit(req.params.slug as string, {
      name: typeof name === "string" ? name : "",
      message: typeof message === "string" ? message : undefined,
      photoId: typeof photoId === "string" ? photoId.slice(0, 64) : undefined,
      gift:
        gift && typeof gift === "object"
          ? { amount: Number((gift as { amount: unknown }).amount), currency: String((gift as { currency: unknown }).currency) }
          : undefined,
      ip: req.ip ?? "unknown",
      uploaderToken: typeof token === "string" ? token.slice(0, 64) : undefined,
    });
    if (!result.ok) {
      res.status(result.status).json({ error: result.error });
      return;
    }
    res.status(202).json({ wish_id: result.wish_id, status: result.status });
  },
};

export const CoupleGuestWishesController = {
  async list(req: CoupleRequest, res: Response) {
    res.json({ wishes: await GuestWishesService.list(req.coupleActorSheetId as string) });
  },

  async setStatus(req: CoupleRequest, res: Response) {
    const status = req.body?.status as PhotoStatus | undefined;
    if (!status || !(PHOTO_STATUSES as readonly string[]).includes(status)) {
      res.status(400).json({ error: "status must be pending, approved or hidden" });
      return;
    }
    const ok = await GuestWishesService.setStatus(
      req.coupleActorSheetId as string,
      req.params.wishId as string,
      status,
    );
    if (!ok) {
      res.status(404).json({ error: "Wish not found" });
      return;
    }
    res.json({ ok: true });
  },

  async remove(req: CoupleRequest, res: Response) {
    const ok = await GuestWishesService.remove(req.coupleActorSheetId as string, req.params.wishId as string);
    if (!ok) {
      res.status(404).json({ error: "Wish not found" });
      return;
    }
    res.status(204).end();
  },

  async recordGift(req: CoupleRequest, res: Response) {
    const result = await GuestWishesService.recordGift(
      req.coupleActorSheetId as string,
      req.params.wishId as string,
    );
    if (!result) {
      res.status(404).json({ error: "No reported gift on this wish" });
      return;
    }
    res.json(result);
  },
};
