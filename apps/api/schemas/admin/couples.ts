import { defineTable, string, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'couples',
  actor: 'admin',
  timestamps: true,
  columns: {
    couple_id: string().required().unique(),
    actor_sheet_id: string().unique(),
    partner1_name: string(),
    partner1_email: string().required(),
    partner2_name: string(),
    partner2_email: string(),
    slug: string().required().unique(),
    custom_domain: string().unique(),
    wedding_date: date(),
    status: string().enum(['pending', 'active', 'suspended', 'rejected']).default('pending'),
    website_status: string().enum(['draft', 'published']).default('draft'),
  },
});
