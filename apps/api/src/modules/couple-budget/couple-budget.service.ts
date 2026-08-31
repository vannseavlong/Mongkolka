import { randomUUID } from "node:crypto";
import { CoupleBudgetModel } from "./couple-budget.model.js";
import { CoupleChecklistModel } from "../couple-checklist/couple-checklist.model.js";

export interface CreateBudgetCategoryInput {
  name: string;
  allocated?: number;
  color?: string;
}

/**
 * A category's "spent" is derived, not stored: the sum of budget_spent across
 * checklist items linked to it (checklist_items.category — see
 * schemas/couple/checklist_items.ts and the Checklist feature). Computing it
 * live here, rather than caching a counter on the category row, means editing
 * or deleting a task can never leave a category's total stale — there's
 * nothing to keep in sync.
 */
async function withComputedSpent(actorSheetId: string, categories: Record<string, unknown>[]) {
  const items = await CoupleChecklistModel.findMany(actorSheetId);
  const spentByCategory = new Map<string, number>();
  for (const item of items) {
    const categoryId = item.category as string | null | undefined;
    if (!categoryId) continue;
    const amount = Number(item.budget_spent) || 0;
    spentByCategory.set(categoryId, (spentByCategory.get(categoryId) ?? 0) + amount);
  }
  return categories.map((category) => ({
    ...category,
    spent: spentByCategory.get(category.category_id as string) ?? 0,
  }));
}

export const CoupleBudgetService = {
  async list(actorSheetId: string) {
    const categories = await CoupleBudgetModel.findMany(actorSheetId);
    return withComputedSpent(actorSheetId, categories);
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
    const category = await CoupleBudgetModel.findById(actorSheetId, categoryId);
    if (!category) return null;
    const [withSpent] = await withComputedSpent(actorSheetId, [category]);
    return withSpent;
  },

  delete(actorSheetId: string, categoryId: string) {
    return CoupleBudgetModel.delete(actorSheetId, categoryId);
  },
};
