import type { Response } from "express";
import type { VendorRequest } from "../../middlewares/vendor-context.middleware.js";
import { VendorBookingsService } from "./vendor-bookings.service.js";

export const VendorBookingsController = {
  async list(req: VendorRequest, res: Response) {
    const bookings = await VendorBookingsService.list(req.vendorId as string);
    res.json({ bookings });
  },
};
