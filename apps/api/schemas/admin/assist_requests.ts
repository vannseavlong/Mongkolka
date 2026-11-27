import { defineTable, string, date } from 'longcelot-sheet-db';

// A couple's request for Mongkolka admins to help edit their site. `expired` is never stored:
// it is derived from `expires_at` on read (modules/assist/assist.core.ts).
export default defineTable({
  name: 'assist_requests',
  actor: 'admin',
  timestamps: true,
  columns: {
    request_id: string().required().unique(),
    couple_id: string().required().ref('couples.couple_id'),
    note: string().required(),
    status: string().enum(['pending', 'approved', 'declined', 'revoked', 'cancelled']).default('pending'),
    requested_by: string().required().ref('users.user_id'),
    requested_at: date().required(),
    decided_by: string().ref('users.user_id'),
    decided_at: date(),
    decline_reason: string(),
    expires_at: date(),
    revoked_at: date(),
  },
});
