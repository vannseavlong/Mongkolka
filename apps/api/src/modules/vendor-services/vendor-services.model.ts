import { vendorContext } from "../../config/database.js";

export const VendorServicesModel = {
  findMany(actorSheetId: string) {
    return vendorContext(actorSheetId).table("services").findMany();
  },

  findById(actorSheetId: string, serviceId: string) {
    return vendorContext(actorSheetId)
      .table("services")
      .findOne({ where: { service_id: serviceId } });
  },

  create(actorSheetId: string, data: Record<string, unknown>) {
    return vendorContext(actorSheetId).table("services").create(data);
  },

  update(actorSheetId: string, serviceId: string, data: Record<string, unknown>) {
    return vendorContext(actorSheetId)
      .table("services")
      .update({ where: { service_id: serviceId }, data });
  },

  delete(actorSheetId: string, serviceId: string) {
    return vendorContext(actorSheetId)
      .table("services")
      .delete({ where: { service_id: serviceId } });
  },
};
