import type { Request, Response } from "express";
import { StatsService, type UpdateStatInput } from "./stats.service.js";

export const StatsController = {
  async list(_req: Request, res: Response) {
    const stats = await StatsService.list();
    res.json({ stats });
  },

  async create(req: Request, res: Response) {
    const { label, value, icon, display_order } = req.body ?? {};
    if (typeof label !== "string" || !label.trim() || typeof value !== "string" || !value.trim()) {
      res.status(400).json({ error: "label and value are required" });
      return;
    }
    const stat = await StatsService.create({
      label,
      value,
      icon: typeof icon === "string" ? icon : undefined,
      display_order: typeof display_order === "number" ? display_order : undefined,
    });
    res.status(201).json({ stat });
  },

  async update(req: Request, res: Response) {
    const { label, value, icon, display_order, active } = req.body ?? {};
    const input: UpdateStatInput = {};
    if (label !== undefined) input.label = label;
    if (value !== undefined) input.value = value;
    if (icon !== undefined) input.icon = icon;
    if (display_order !== undefined) input.display_order = display_order;
    if (active !== undefined) input.active = active;

    const stat = await StatsService.update(req.params.statId as string, input);
    if (!stat) {
      res.status(404).json({ error: "Stat not found" });
      return;
    }
    res.json({ stat });
  },

  async remove(req: Request, res: Response) {
    await StatsService.delete(req.params.statId as string);
    res.status(204).end();
  },
};
