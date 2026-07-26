import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'users',
  actor: 'admin',
  timestamps: true,
  columns: {
    user_id: string().required().unique(),
    role: string().enum(['admin', 'couple', 'vendor']).required(),
    email: string().required().unique(),
    actor_sheet_id: string(),
    status: string().enum(['pending', 'active', 'inactive']).default('pending'),
  },
});
