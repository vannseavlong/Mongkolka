import { z } from "zod";

export const coupleProfileSchema = z.object({
  couple_id: z.string(),
  partner1_name: z.string().nullable(),
  partner1_email: z.string(),
  partner2_name: z.string().nullable(),
  partner2_email: z.string().nullable(),
  slug: z.string(),
  wedding_date: z.string().nullable(),
  status: z.enum(["pending", "active", "suspended", "rejected"]),
  website_status: z.enum(["draft", "published"]),
  love_story: z.string().nullable(),
  cover_photo_url: z.string().nullable(),
  ceremony_time: z.string().nullable(),
  ceremony_venue: z.string().nullable(),
  ceremony_address: z.string().nullable(),
  reception_time: z.string().nullable(),
  reception_venue: z.string().nullable(),
  reception_address: z.string().nullable(),
  dress_code: z.string().nullable(),
});

export type CoupleProfile = z.infer<typeof coupleProfileSchema>;

export const coupleMemberSchema = z.object({
  member_id: z.string(),
  couple_id: z.string(),
  user_id: z.string(),
  member_role: z.enum(["partner", "collaborator"]),
  invited_by: z.string().nullable(),
  joined_at: z.string().nullable(),
  email: z.string().nullable(),
  user_status: z.string().nullable(),
});

export type CoupleMember = z.infer<typeof coupleMemberSchema>;
