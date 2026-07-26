import { z } from "zod";

export const serviceSchema = z.object({
  service_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number().nullable(),
  unit: z.enum(["per_event", "per_hour", "package"]),
});

export type Service = z.infer<typeof serviceSchema>;
