import { z } from "zod";

export const vendorProfileSchema = z.object({
  vendor_id: z.string(),
  business_name: z.string().nullable(),
  owner_email: z.string(),
  category_id: z.string().nullable(),
  location: z.string().nullable(),
  description: z.string().nullable(),
  status: z.enum(["pending", "active", "inactive", "rejected"]),
  bio: z.string().nullable(),
  service_area: z.string().nullable(),
});

export type VendorProfile = z.infer<typeof vendorProfileSchema>;

export const vendorCategorySchema = z.object({
  category_id: z.string(),
  key: z.string(),
  label_en: z.string(),
  label_kh: z.string().nullable(),
});

export type VendorCategory = z.infer<typeof vendorCategorySchema>;
