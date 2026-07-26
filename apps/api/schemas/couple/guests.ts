import { defineTable, string, boolean, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'guests',
  actor: 'couple',
  timestamps: true,
  columns: {
    guest_id: string().required().unique(),
    name: string().required(),
    telegram: string(),
    phone: string(),
    status: string()
      .enum(['not-invited', 'invited-in-person', 'confirmed', 'declined', 'maybe', 'no-response'])
      .default('not-invited'),
    plus_one: boolean().default(false),
    plus_one_name: string(),
    invited_date: date(),
    confirmed_date: date(),
    group: string().enum(['family', 'friends', 'colleagues', 'neighbors', 'other']),
    notes: string(),
  },
});
