import { z } from "zod";

export const bookingSchema = z.object({
  booking_id: z.string(),
  couple_id: z.string(),
  service_summary: z.string().nullable(),
  event_date: z.string().nullable(),
  amount: z.number().nullable(),
  status: z.enum(["inquiry", "pending", "confirmed", "completed", "cancelled"]),
  notes: z.string().nullable(),
});

export type Booking = z.infer<typeof bookingSchema>;
