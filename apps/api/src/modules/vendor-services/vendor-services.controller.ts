import type { Response } from "express";
import type { VendorRequest } from "../../middlewares/vendor-context.middleware.js";
import { VendorServicesService } from "./vendor-services.service.js";

export const VendorServicesController = {
  async list(req: VendorRequest, res: Response) {
    const services = await VendorServicesService.list(req.vendorActorSheetId as string);
    res.json({ services });
  },

  async create(req: VendorRequest, res: Response) {
    const { name, description, price, unit } = req.body ?? {};
    if (typeof name !== "string") {
      res.status(400).json({ error: "name is required" });
      return;
    }
    const service = await VendorServicesService.create(req.vendorActorSheetId as string, {
      name,
      description,
      price,
      unit,
    });
    res.status(201).json({ service });
  },

  async update(req: VendorRequest, res: Response) {
    const { name, description, price, unit } = req.body ?? {};
    const input: Record<string, unknown> = {};
    if (name !== undefined) input.name = name;
    if (description !== undefined) input.description = description;
    if (price !== undefined) input.price = price;
    if (unit !== undefined) input.unit = unit;

    const service = await VendorServicesService.update(
      req.vendorActorSheetId as string,
      req.params.serviceId as string,
      input,
    );
    if (!service) {
      res.status(404).json({ error: "Service not found" });
      return;
    }
    res.json({ service });
  },

  async remove(req: VendorRequest, res: Response) {
    await VendorServicesService.delete(req.vendorActorSheetId as string, req.params.serviceId as string);
    res.status(204).end();
  },
};
