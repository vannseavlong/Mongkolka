import { defineTable, string, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'vendors',
  actor: 'admin',
  timestamps: true,
  columns: {
    vendor_id: string().required().unique(),
    actor_sheet_id: string().unique(),
    business_name: string(),
    owner_email: string().required(),
    category_id: string().ref('vendor_categories.category_id'),
    location: string(),
    description: string(),
    status: string().enum(['pending', 'active', 'inactive', 'rejected']).default('pending'),
    submitted_at: date(),
    approved_at: date(),
    approved_by: string().ref('users.user_id'),
  },
});
