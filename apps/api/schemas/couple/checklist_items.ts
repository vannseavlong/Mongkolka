import { defineTable, string, number, boolean, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'checklist_items',
  actor: 'couple',
  timestamps: true,
  columns: {
    item_id: string().required().unique(),
    text: string().required(),
    completed: boolean().default(false),
    category: string().ref('budget_categories.category_id'),
    budget_allocated: number().default(0),
    budget_spent: number().default(0),
    due_date: date(),
    priority: string().enum(['high', 'medium', 'low']).default('medium'),
    notes: string(),
  },
});
