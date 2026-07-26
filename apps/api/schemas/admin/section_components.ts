import { defineTable, string } from 'longcelot-sheet-db';

// Catalog of component variants a section can render — metadata only, not the
// component's implementation (that's a real React component in
// packages/templates, selected by component_id). A section type can have several
// interchangeable variants, e.g. 'opening' has curtain/door/book/envelope.
//
// component_id is globally unique by convention (prefixed with its section, e.g.
// 'opening_curtain', 'gallery_grid') even though the registry looks components up
// per-section — keeps a single-column unique constraint instead of a composite key.
export default defineTable({
  name: 'section_components',
  actor: 'admin',
  timestamps: true,
  columns: {
    component_id: string().required().unique(),
    section: string()
      .enum(['opening', 'hero', 'story', 'gallery', 'details', 'rsvp', 'registry', 'timeline', 'music'])
      .required(),
    name: string().required(),
    preview_bg_color: string(),
    preview_text_color: string(),
    preview_accent_color: string(),
    font_style: string(),
    status: string().enum(['active', 'inactive']).default('active'),
  },
});
