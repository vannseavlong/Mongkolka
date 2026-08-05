import { defineTable, string, json, boolean } from 'longcelot-sheet-db';

// App-chrome color themes (admin/couple portal UI), NOT the couple's public
// wedding-site theme (see site_templates.default_theme for that). tokens holds
// a full CSS custom-property map matching packages/ui/src/styles/theme.css's
// [data-brand-theme] blocks, e.g. { background, foreground, card, primary, ... }.
export default defineTable({
  name: 'themes',
  actor: 'admin',
  timestamps: true,
  columns: {
    theme_id: string().required().unique(),
    name: string().required(),
    description: string(),
    tokens: json(),
    // Independent per-app activation: the landing site (apps/web) and the
    // couple portal (apps/couple) can each show a different active theme.
    is_active_web: boolean().default(false),
    is_active_couple: boolean().default(false),
    status: string().enum(['active', 'inactive']).default('active'),
  },
});
