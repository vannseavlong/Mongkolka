import { defineTable, string } from 'longcelot-sheet-db';

// One row per couple that connected their own Google Drive. The refresh token is
// AES-256-GCM encrypted (utils/token-crypto.ts); it is never returned by any API.
export default defineTable({
  name: 'couple_drive_connections',
  actor: 'admin',
  timestamps: true,
  columns: {
    couple_id: string().required().unique(),
    // Google account the couple connected, shown in the portal.
    google_email: string(),
    refresh_token_enc: string().required(),
    // active | needs_reconnect | disconnected
    status: string().required().default('active'),
    // Drive folder the app created for this site (informational).
    folder_id: string(),
    last_error: string(),
  },
});
