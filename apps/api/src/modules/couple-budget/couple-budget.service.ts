import { randomUUID } from "node:crypto";
import { CoupleBudgetModel } from "./couple-budget.model.js";

export interface CreateBudgetCategoryInput {
  name: string;
  allocated?: number;
  spent?: number;
  color?: string;
}

export const CoupleBudgetService = {
  list(actorSheetId: string) {
    return CoupleBudgetModel.findMany(actorSheetId);
  },

  create(actorSheetId: string, input: CreateBudgetCategoryInput) {
    return CoupleBudgetModel.create(actorSheetId, {
      category_id: randomUUID(),
      allocated: 0,
      spent: 0,
      ...input,
    });
  },

  async update(actorSheetId: string, categoryId: string, input: Partial<CreateBudgetCategoryInput>) {
    await CoupleBudgetModel.update(actorSheetId, categoryId, { ...input });
    return CoupleBudgetModel.findById(actorSheetId, categoryId);
  },

  delete(actorSheetId: string, categoryId: string) {
    return CoupleBudgetModel.delete(actorSheetId, categoryId);
  },
};
