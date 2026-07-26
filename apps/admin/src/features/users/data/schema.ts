import { z } from "zod";

export const userSchema = z.object({
  user_id: z.string(),
  role: z.enum(["admin", "couple", "vendor"]),
  email: z.string(),
  actor_sheet_id: z.string().nullable(),
  status: z.enum(["pending", "active", "inactive"]),
  _created_at: z.string(),
});

export type User = z.infer<typeof userSchema>;
