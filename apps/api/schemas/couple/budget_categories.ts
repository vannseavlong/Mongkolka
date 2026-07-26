import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'budget_categories',
  actor: 'couple',
  timestamps: true,
  columns: {
    category_id: string().required().unique(),
    name: string().required(),
    allocated: number().default(0),
    spent: number().default(0),
    color: string(),
  },
});
