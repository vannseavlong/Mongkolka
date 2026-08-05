import { defineTable, string } from 'longcelot-sheet-db';

// Submissions from apps/web's public Contact page form.
export default defineTable({
  name: 'contact_messages',
  actor: 'admin',
  timestamps: true,
  columns: {
    message_id: string().required().unique(),
    name: string().required(),
    email: string().required(),
    subject: string(),
    message: string().required(),
    status: string().enum(['unread', 'read']).default('unread'),
  },
});
