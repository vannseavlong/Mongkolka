import { z } from "zod";

export const contactMessageSchema = z.object({
  message_id: z.string(),
  name: z.string(),
  email: z.string(),
  subject: z.string().nullable(),
  message: z.string(),
  status: z.enum(["unread", "read"]),
  _created_at: z.string().optional(),
});

export type ContactMessage = z.infer<typeof contactMessageSchema>;
