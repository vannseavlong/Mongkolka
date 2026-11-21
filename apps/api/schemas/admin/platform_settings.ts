import { defineTable, string } from 'longcelot-sheet-db';

// Key/value platform settings an admin can change without a redeploy.
// `value` holds JSON; each key documents its own shape (see platform-settings.service.ts).
export default defineTable({
  name: 'platform_settings',
  actor: 'admin',
  timestamps: true,
  columns: {
    setting_key: string().required().unique(),
    value: string(),
  },
});
