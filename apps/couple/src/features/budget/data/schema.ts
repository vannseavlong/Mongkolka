import { z } from "zod";

export const budgetCategorySchema = z.object({
  category_id: z.string(),
  name: z.string(),
  allocated: z.number(),
  spent: z.number(),
  color: z.string().nullable(),
});

export type BudgetCategory = z.infer<typeof budgetCategorySchema>;
