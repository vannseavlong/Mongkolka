import { z } from "zod";

export const overviewStatsSchema = z.object({
  totalGuests: z.number(),
  confirmedGuests: z.number(),
  declinedGuests: z.number(),
  totalAllocated: z.number(),
  totalSpent: z.number(),
  totalChecklistItems: z.number(),
  completedChecklistItems: z.number(),
  daysUntilWedding: z.number().nullable(),
  websiteStatus: z.enum(["draft", "published"]),
});

export type OverviewStats = z.infer<typeof overviewStatsSchema>;
