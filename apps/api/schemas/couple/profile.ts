import { defineTable, string, json, number } from 'longcelot-sheet-db';

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
    // Which site_templates row this couple picked. Not a ref() — cross-sheet, same
    // reasoning as website_sections.component_id.
    site_template_id: string(),
    // Partial<Theme> — the couple's whole-site color override, on top of the
    // selected template's default_theme.
    theme_override: json(),
    // Guest photo uploads — all couple-configurable from the portal; the API clamps
    // numeric values to platform ceilings (see guest-photos.limits.ts).
    photo_uploads: string().enum(['off', 'auto', 'pending']).default('pending'),
    photo_max_per_guest: number().default(5),
    photo_max_size_mb: number().default(8),
    photo_rate_per_ip_per_hour: number().default(30),
  },
});
