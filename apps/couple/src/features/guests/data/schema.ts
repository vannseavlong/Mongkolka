import { z } from "zod";

export const GUEST_STATUSES = [
  "not-invited",
  "invited-in-person",
  "confirmed",
  "declined",
  "maybe",
  "no-response",
] as const;

export const GUEST_GROUPS = ["family", "friends", "colleagues", "neighbors", "other"] as const;

export const guestSchema = z.object({
  guest_id: z.string(),
  name: z.string(),
  telegram: z.string().nullable(),
  phone: z.string().nullable(),
  status: z.enum(GUEST_STATUSES),
  plus_one: z.boolean(),
  plus_one_name: z.string().nullable(),
  invited_date: z.string().nullable(),
  confirmed_date: z.string().nullable(),
  group: z.enum(GUEST_GROUPS).nullable(),
  notes: z.string().nullable(),
});

export type Guest = z.infer<typeof guestSchema>;
export type GuestStatus = (typeof GUEST_STATUSES)[number];
export type GuestGroup = (typeof GUEST_GROUPS)[number];
