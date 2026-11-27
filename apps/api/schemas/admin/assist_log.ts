import { defineTable, string, date } from 'longcelot-sheet-db';

// Append-only audit trail for assisted editing. Never stores request bodies or tokens.
export default defineTable({
  name: 'assist_log',
  actor: 'admin',
  timestamps: true,
  columns: {
    log_id: string().required().unique(),
    request_id: string().required().ref('assist_requests.request_id'),
    couple_id: string().required().ref('couples.couple_id'),
    actor_id: string().required().ref('users.user_id'),
    actor_role: string().enum(['couple', 'admin']).required(),
    // requested | cancelled | accepted | declined | revoked | open | edit
    action: string().required(),
    // Only for action = edit: the HTTP method and path of the assisted request.
    method: string(),
    path: string(),
    at: date().required(),
  },
});
