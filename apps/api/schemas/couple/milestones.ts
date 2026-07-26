import { defineTable, string, number, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'milestones',
  actor: 'couple',
  timestamps: true,
  columns: {
    milestone_id: string().required().unique(),
    title: string().required(),
    task: string(),
    months_before: number().required(),
    completed: boolean().default(false),
  },
});
