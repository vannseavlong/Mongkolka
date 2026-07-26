import { z } from "zod";

export const overviewStatsSchema = z.object({
  totalCouples: z.number(),
  totalVendors: z.number(),
  pendingCouples: z.number(),
  pendingVendors: z.number(),
  activeTemplates: z.number(),
});

export type OverviewStats = z.infer<typeof overviewStatsSchema>;
