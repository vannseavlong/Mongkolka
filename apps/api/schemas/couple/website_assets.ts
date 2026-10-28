import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'website_assets',
  actor: 'couple',
  timestamps: true,
  columns: {
    asset_id: string().required().unique(),
    // Owning couple; every storage key starts with couples/<couple_id>/.
    couple_id: string().required(),
    // Key inside the storage driver; needed to delete the file.
    storage_key: string().required(),
    // URL exactly as the driver returned it; sections reference assets by this string.
    url: string().required(),
    mime: string().required(),
    size_bytes: number().default(0),
    width: number(),
    height: number(),
  },
});
