import { defineTable, string } from 'longcelot-sheet-db';

export default defineTable({
  name: 'credentials',
  actor: 'admin',
  columns: {
    user_id: string().required(),
    password_hash: string(),
    provider: string().enum(['oauth', 'local']).required(),
  },
});
