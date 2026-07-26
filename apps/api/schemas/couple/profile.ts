import { defineTable, string, json } from 'longcelot-sheet-db';

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
  },
});
