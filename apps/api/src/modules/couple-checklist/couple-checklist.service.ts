import { randomUUID } from "node:crypto";
import { CoupleChecklistModel } from "./couple-checklist.model.js";

export interface CreateChecklistItemInput {
  text: string;
  category?: string;
  budget_allocated?: number;
  budget_spent?: number;
  due_date?: string;
  priority?: string;
  notes?: string;
}

export type UpdateChecklistItemInput = Partial<CreateChecklistItemInput> & {
  completed?: boolean;
};

export const CoupleChecklistService = {
  list(actorSheetId: string) {
    return CoupleChecklistModel.findMany(actorSheetId);
  },

  create(actorSheetId: string, input: CreateChecklistItemInput) {
    return CoupleChecklistModel.create(actorSheetId, {
      item_id: randomUUID(),
      completed: false,
      ...input,
    });
  },

  async update(actorSheetId: string, itemId: string, input: UpdateChecklistItemInput) {
    await CoupleChecklistModel.update(actorSheetId, itemId, { ...input });
    return CoupleChecklistModel.findById(actorSheetId, itemId);
  },

  delete(actorSheetId: string, itemId: string) {
    return CoupleChecklistModel.delete(actorSheetId, itemId);
  },
};
