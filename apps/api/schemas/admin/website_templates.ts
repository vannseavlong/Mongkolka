import { defineTable, string } from 'longcelot-sheet-db';

// template_id is globally unique by convention (prefixed with its section, e.g.
// 'hero_elegant', 'gallery_elegant') even though the registry in packages/templates
// looks templates up per-section — this keeps a single-column unique constraint
// instead of needing a synthetic composite key.
export default defineTable({
  name: 'website_templates',
  actor: 'admin',
  timestamps: true,
  columns: {
    template_id: string().required().unique(),
    section: string()
      .enum(['hero', 'story', 'gallery', 'details', 'rsvp', 'registry', 'timeline', 'music'])
      .required(),
    name: string().required(),
    preview_bg_color: string(),
    preview_text_color: string(),
    preview_accent_color: string(),
    font_style: string(),
    status: string().enum(['active', 'inactive']).default('active'),
  },
});
