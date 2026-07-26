import type { Response } from "express";
import type { VendorRequest } from "../../middlewares/vendor-context.middleware.js";
import { VendorProfileService } from "./vendor-profile.service.js";

export const VendorProfileController = {
  async get(req: VendorRequest, res: Response) {
    const profile = await VendorProfileService.get(
      req.vendorId as string,
      req.vendorActorSheetId as string,
    );
    res.json({ profile });
  },

  async update(req: VendorRequest, res: Response) {
    const profile = await VendorProfileService.update(
      req.vendorId as string,
      req.vendorActorSheetId as string,
      req.body ?? {},
    );
    res.json({ profile });
  },
};
