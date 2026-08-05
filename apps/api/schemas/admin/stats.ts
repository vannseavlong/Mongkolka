import { defineTable, string, number, boolean } from 'longcelot-sheet-db';

// Marketing stat cards shown on apps/web's About page (e.g. "10,000+ Happy
// Couples"). Admin-managed so copy/numbers can change without a deploy.
export default defineTable({
  name: 'stats',
  actor: 'admin',
  timestamps: true,
  columns: {
    stat_id: string().required().unique(),
    label: string().required(),
    value: string().required(),
    icon: string(),
    display_order: number().default(0),
    active: boolean().default(true),
  },
});
