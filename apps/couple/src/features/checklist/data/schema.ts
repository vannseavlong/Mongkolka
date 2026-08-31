import { z } from "zod";

export const CHECKLIST_PRIORITIES = ["high", "medium", "low"] as const;

export const checklistItemSchema = z.object({
  item_id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  category: z.string().nullable(),
  // What this task cost, rolled up into its budget category's "spent" total
  // (see CoupleBudgetService.withComputedSpent) — there's no separate
  // per-task allocation; that lives once, on the category, in Budget.
  budget_spent: z.number(),
  due_date: z.string().nullable(),
  priority: z.enum(CHECKLIST_PRIORITIES),
  notes: z.string().nullable(),
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type ChecklistPriority = (typeof CHECKLIST_PRIORITIES)[number];
