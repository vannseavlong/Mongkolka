import { defineTable, string, boolean } from 'longcelot-sheet-db';

export default defineTable({
  name: 'vendor_categories',
  actor: 'admin',
  timestamps: true,
  columns: {
    category_id: string().required().unique(),
    key: string().required().unique(),
    label_en: string().required(),
    label_kh: string(),
    icon: string(),
    active: boolean().default(true),
  },
});
