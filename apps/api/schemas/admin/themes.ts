import { defineTable, string, json, boolean } from 'longcelot-sheet-db';

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
