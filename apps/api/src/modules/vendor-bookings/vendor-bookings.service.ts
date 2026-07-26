import { VendorBookingsModel } from "./vendor-bookings.model.js";

export const VendorBookingsService = {
  list(vendorId: string) {
    return VendorBookingsModel.findMany(vendorId);
  },
};
