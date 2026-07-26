import { defineTable, string, json } from 'longcelot-sheet-db';

// The overall design pack a couple picks. Sets defaults for every section's
// component *and* the base color theme — both freely overridable per couple/per
// section afterward. See docs/tasks/template.md for the resolution cascade.
export default defineTable({
  name: 'site_templates',
  actor: 'admin',
  timestamps: true,
  columns: {
    template_id: string().required().unique(),
    name: string().required(),
    // { bg_color, text_color, accent_color, font_style }
    default_theme: json(),
    // { [sectionKey]: componentId }, e.g. { opening: 'opening_curtain', gallery: 'gallery_grid' }
    default_components: json(),
    status: string().enum(['active', 'inactive']).default('active'),
  },
});
