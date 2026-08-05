import { z } from "zod";

// Marketing stat cards shown on apps/web's About page (e.g. "10,000+ Happy
// Couples"). icon is a freeform lucide-react component name, same convention
// as vendor-categories' icon field.
export const statSchema = z.object({
  stat_id: z.string(),
  label: z.string(),
  value: z.string(),
  icon: z.string().nullable(),
  display_order: z.number(),
  active: z.boolean(),
  _created_at: z.string().optional(),
});

export type Stat = z.infer<typeof statSchema>;
