import { randomUUID } from "node:crypto";
import { VendorServicesModel } from "./vendor-services.model.js";

export interface CreateServiceInput {
  name: string;
  description?: string;
  price?: number;
  unit?: "per_event" | "per_hour" | "package";
}

export interface UpdateServiceInput {
  name?: string;
  description?: string;
  price?: number;
  unit?: "per_event" | "per_hour" | "package";
}

export const VendorServicesService = {
  list(actorSheetId: string) {
    return VendorServicesModel.findMany(actorSheetId);
  },

  create(actorSheetId: string, input: CreateServiceInput) {
    return VendorServicesModel.create(actorSheetId, {
      service_id: randomUUID(),
      unit: "per_event",
      ...input,
    });
  },

  async update(actorSheetId: string, serviceId: string, input: UpdateServiceInput) {
    await VendorServicesModel.update(actorSheetId, serviceId, { ...input });
    return VendorServicesModel.findById(actorSheetId, serviceId);
  },

  delete(actorSheetId: string, serviceId: string) {
    return VendorServicesModel.delete(actorSheetId, serviceId);
  },
};
