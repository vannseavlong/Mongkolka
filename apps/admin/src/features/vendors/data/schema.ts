import { z } from "zod";

export const vendorSchema = z.object({
  vendor_id: z.string(),
  actor_sheet_id: z.string().nullable(),
  business_name: z.string().nullable(),
  owner_email: z.string(),
  category_id: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().nullable(),
  status: z.enum(["pending", "active", "inactive", "rejected"]),
});

export type Vendor = z.infer<typeof vendorSchema>;
