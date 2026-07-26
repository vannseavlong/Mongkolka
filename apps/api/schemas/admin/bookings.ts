import { defineTable, string, number, date } from 'longcelot-sheet-db';

export default defineTable({
  name: 'bookings',
  actor: 'admin',
  timestamps: true,
  columns: {
    booking_id: string().required().unique(),
    couple_id: string().required().ref('couples.couple_id'),
    vendor_id: string().required().ref('vendors.vendor_id'),
    service_summary: string(),
    event_date: date(),
    amount: number(),
    status: string().enum(['inquiry', 'pending', 'confirmed', 'completed', 'cancelled']).default('inquiry'),
    notes: string(),
  },
});
