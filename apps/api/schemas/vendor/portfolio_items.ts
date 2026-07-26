import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'portfolio_items',
  actor: 'vendor',
  timestamps: true,
  columns: {
    item_id: string().required().unique(),
    image_url: string().required(),
    caption: string(),
    display_order: number().default(0),
  },
});
