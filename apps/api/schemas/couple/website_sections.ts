import { defineTable, string, number, boolean, json } from 'longcelot-sheet-db';

export default defineTable({
  name: 'website_sections',
  actor: 'couple',
  timestamps: true,
  columns: {
    section_id: string().required().unique(),
    section_key: string()
      .enum(['opening', 'hero', 'story', 'gallery', 'details', 'rsvp', 'registry', 'timeline', 'music'])
      .required(),
    // Overrides the site template's default_components[section_key]. Not a ref() —
    // section_components lives in the admin sheet, a different physical spreadsheet.
    // Validated at the application layer instead (see docs/tasks/template.md).
    component_id: string(),
    // Partial<Theme> — takes precedence over couple_profile.theme_override, which
    // takes precedence over the site template's default_theme.
    color_override: json(),
    display_order: number().default(0),
    enabled: boolean().default(true),
    content: json(),
  },
});
