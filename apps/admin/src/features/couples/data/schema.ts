import { z } from "zod";

export const coupleSchema = z.object({
  couple_id: z.string(),
  actor_sheet_id: z.string().nullable(),
  partner1_name: z.string().nullable(),
  partner1_email: z.string(),
  partner2_name: z.string().nullable(),
  partner2_email: z.string().nullable(),
  slug: z.string(),
  custom_domain: z.string().nullable(),
  wedding_date: z.string().nullable(),
  status: z.enum(["pending", "active", "suspended", "rejected"]),
  website_status: z.enum(["draft", "published"]),
});

export type Couple = z.infer<typeof coupleSchema>;
