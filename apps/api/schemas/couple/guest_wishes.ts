import { defineTable, string, number } from 'longcelot-sheet-db';

export default defineTable({
  name: 'guest_wishes',
  actor: 'couple',
  timestamps: true,
  columns: {
    wish_id: string().required().unique(),
    name: string().required(),
    message: string(),
    // Optional photo the guest attached (a guest_photos.photo_id; same sheet, but kept
    // as a plain string — the photo row may still be in the write queue).
    photo_id: string(),
    uploader_token: string(),
    status: string().enum(['pending', 'approved', 'hidden']).default('pending'),
    // Guest-reported gift — never trusted; the couple confirms via "record gift".
    gift_amount: number().default(0),
    gift_currency: string().enum(['USD', 'KHR']),
  },
});
