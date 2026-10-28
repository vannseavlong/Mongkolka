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
    // Public identity of the template: the preview address (`{slug}.<domain>`) and the
    // by-slug lookup. Same format as a couple slug (utils/slug.ts), unique among
    // templates and never equal to a couple's slug (enforced at the application layer
    // in both directions). Not required in the sheet so rows that predate it still load.
    slug: string().unique(),
    // Short marketing blurb shown in the picker and the preview page.
    description: string(),
    // { bg_color, text_color, accent_color, font_style }
    default_theme: json(),
    // { [sectionKey]: componentId }, e.g. { opening: 'opening_curtain', gallery: 'gallery_grid' }
    default_components: json(),
    status: string().enum(['active', 'inactive']).default('active'),
  },
});
