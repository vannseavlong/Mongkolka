import { defineTable, string, boolean, date, number } from 'longcelot-sheet-db';

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
    // Wedding gifts (cash is the norm at Cambodian weddings). `reported` = the guest said
    // so from the website and the couple hasn't confirmed it yet.
    gift_status: string().enum(['none', 'reported', 'received']).default('none'),
    gift_type: string().enum(['cash', 'gift', 'other']),
    gift_amount: number().default(0),
    gift_currency: string().enum(['USD', 'KHR']),
    gift_received_date: date(),
    gift_note: string(),
  },
});
