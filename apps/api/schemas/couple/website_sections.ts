import { defineTable, string, number, boolean, json } from 'longcelot-sheet-db';

export default defineTable({
  name: 'website_sections',
  actor: 'couple',
  timestamps: true,
  columns: {
    section_id: string().required().unique(),
    section_key: string()
      .enum(['hero', 'story', 'gallery', 'details', 'rsvp', 'registry', 'timeline', 'music'])
      .required(),
    // Not a ref() — website_templates lives in the admin sheet, a different physical
    // spreadsheet. Validated at the application layer instead (see docs/tasks/template.md).
    template_id: string(),
    display_order: number().default(0),
    enabled: boolean().default(true),
    content: json(),
  },
});
