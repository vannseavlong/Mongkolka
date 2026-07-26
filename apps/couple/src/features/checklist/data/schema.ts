import { z } from "zod";

export const CHECKLIST_PRIORITIES = ["high", "medium", "low"] as const;

export const checklistItemSchema = z.object({
  item_id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  category: z.string().nullable(),
  budget_allocated: z.number(),
  budget_spent: z.number(),
  due_date: z.string().nullable(),
  priority: z.enum(CHECKLIST_PRIORITIES),
  notes: z.string().nullable(),
});

export type ChecklistItem = z.infer<typeof checklistItemSchema>;
export type ChecklistPriority = (typeof CHECKLIST_PRIORITIES)[number];
