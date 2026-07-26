import { z } from "zod";

export const vendorCategorySchema = z.object({
  category_id: z.string(),
  key: z.string(),
  label_en: z.string(),
  label_kh: z.string().nullable(),
  icon: z.string().nullable(),
  active: z.boolean(),
});

export type VendorCategory = z.infer<typeof vendorCategorySchema>;
