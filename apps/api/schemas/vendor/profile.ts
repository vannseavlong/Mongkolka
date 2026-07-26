import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'vendor_profile',
  actor: 'vendor',
  timestamps: true,
  columns: {
    profile_id: string().required().unique(),
    bio: string(),
    service_area: string(),
  },
});
