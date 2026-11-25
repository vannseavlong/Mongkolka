import type { Request, Response } from "express";
import type { CoupleRequest } from "../../middlewares/couple-context.middleware.js";
import { env } from "../../config/env.js";
import { driveEnabled } from "../../services/drive/drive.runtime.js";
import { CoupleDriveService } from "./couple-drive.service.js";

const coupleId = (req: CoupleRequest) => req.coupleId as string;

function back(res: Response, result: string) {
  // Contract for the portal (T-0020): /settings/storage?drive=connected | <error code>
  res.redirect(`${env.COUPLE_FRONTEND_URL.replace(/\/$/, "")}/settings/storage?drive=${encodeURIComponent(result)}`);
}

export const CoupleDriveController = {
  async status(req: CoupleRequest, res: Response) {
    if (!driveEnabled()) {
      res.json({ enabled: false, status: "not_connected", google_email: null, connected_at: null });
      return;
    }
    res.json({ enabled: true, ...(await CoupleDriveService().status(coupleId(req))) });
  },

  connect(req: CoupleRequest, res: Response) {
    if (!driveEnabled()) {
      res.status(503).json({ error: "drive_not_configured" });
      return;
    }
    res.json(CoupleDriveService().startConnect(coupleId(req)));
  },

  async disconnect(req: CoupleRequest, res: Response) {
    if (driveEnabled()) await CoupleDriveService().disconnect(coupleId(req));
    res.status(204).end();
  },

  /** Google redirects the browser here; there is no session, the signed state identifies the couple. */
  async callback(req: Request, res: Response) {
    const { code, state, error } = req.query;
    if (!driveEnabled()) return back(res, "drive_not_configured");
    if (typeof error === "string") return back(res, error === "access_denied" ? "denied" : "error");
    if (typeof code !== "string" || typeof state !== "string") return back(res, "invalid_state");
    const result = await CoupleDriveService().finishConnect(code, state);
    back(res, result.ok ? "connected" : result.error);
  },
};
