import { z } from "zod";

export const portfolioItemSchema = z.object({
  item_id: z.string(),
  image_url: z.string(),
  caption: z.string().nullable(),
  display_order: z.number(),
});

export type PortfolioItem = z.infer<typeof portfolioItemSchema>;
