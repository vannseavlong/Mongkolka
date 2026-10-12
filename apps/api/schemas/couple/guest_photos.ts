import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'guest_photos',
  actor: 'couple',
  timestamps: true,
  columns: {
    photo_id: string().required().unique(),
    // Key inside the storage driver (local dir / S3 bucket); needed to delete the file.
    storage_key: string().required(),
    url: string().required(),
    uploader_name: string(),
    // Client-generated id (kept in the guest's browser) — used for the per-guest cap,
    // since guests have no accounts and venue Wi-Fi shares one IP.
    uploader_token: string(),
    mime_type: string(),
    size_bytes: number().default(0),
    // pending -> hidden from the public gallery until the couple approves.
    status: string().enum(['pending', 'approved', 'hidden']).default('pending'),
  },
});
