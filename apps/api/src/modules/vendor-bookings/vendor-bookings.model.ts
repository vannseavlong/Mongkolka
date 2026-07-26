import { adminContext } from "../../config/database.js";

export const VendorBookingsModel = {
  findMany(vendorId: string) {
    return adminContext().table("bookings").findMany({ where: { vendor_id: vendorId } });
  },
};
