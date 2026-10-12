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

export const GIFT_STATUSES = ["none", "reported", "received"] as const;
export const GIFT_TYPES = ["cash", "gift", "other"] as const;
export const GIFT_CURRENCIES = ["USD", "KHR"] as const;

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
  gift_status: z.enum(GIFT_STATUSES).nullable().optional(),
  gift_type: z.enum(GIFT_TYPES).nullable().optional(),
  gift_amount: z.number().nullable().optional(),
  gift_currency: z.enum(GIFT_CURRENCIES).nullable().optional(),
  gift_received_date: z.string().nullable().optional(),
  gift_note: z.string().nullable().optional(),
});

export type Guest = z.infer<typeof guestSchema>;
export type GuestStatus = (typeof GUEST_STATUSES)[number];
export type GuestGroup = (typeof GUEST_GROUPS)[number];

export type GiftStatus = (typeof GIFT_STATUSES)[number];

export function formatGift(amount: number | null | undefined, currency: string | null | undefined) {
  const n = Number(amount) || 0;
  if (!n) return null;
  return currency === "KHR"
    ? `${Math.round(n).toLocaleString()} ៛`
    : `$${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}
