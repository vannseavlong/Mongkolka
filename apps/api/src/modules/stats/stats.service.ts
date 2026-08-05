import { randomUUID } from "node:crypto";
import { StatsModel } from "./stats.model.js";

export interface CreateStatInput {
  label: string;
  value: string;
  icon?: string;
  display_order?: number;
}

export interface UpdateStatInput {
  label?: string;
  value?: string;
  icon?: string;
  display_order?: number;
  active?: boolean;
}

export const StatsService = {
  async list(activeOnly?: boolean) {
    const stats = await StatsModel.findMany(activeOnly ? { active: true } : undefined);
    return [...stats].sort(
      (a, b) => (Number(a.display_order) || 0) - (Number(b.display_order) || 0),
    );
  },

  create(input: CreateStatInput) {
    return StatsModel.create({ stat_id: randomUUID(), ...input, active: true });
  },

  async update(statId: string, input: UpdateStatInput) {
    await StatsModel.update(statId, { ...input });
    return StatsModel.findById(statId);
  },

  delete(statId: string) {
    return StatsModel.delete(statId);
  },
};
