import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'couple_profile',
  actor: 'couple',
  timestamps: true,
  columns: {
    profile_id: string().required().unique(),
    love_story: string(),
    cover_photo_url: string(),
    ceremony_time: string(),
    ceremony_venue: string(),
    ceremony_address: string(),
    reception_time: string(),
    reception_venue: string(),
    reception_address: string(),
    dress_code: string(),
  },
});
