import { z } from "zod";

export const overviewStatsSchema = z.object({
  totalGuests: z.number(),
  confirmedGuests: z.number(),
  declinedGuests: z.number(),
  guestsByStatus: z.record(z.string(), z.number()),
  expectedHeadcount: z.number(),
  gifts: z.record(z.string(), z.object({ received: z.number(), reported: z.number() })),
  giftsReceivedCount: z.number(),
  giftsReportedCount: z.number(),
  photosPending: z.number(),
  photosApproved: z.number(),
  wishesPending: z.number(),
  wishesTotal: z.number(),
  nextMilestones: z.array(
    z.object({ title: z.string(), task: z.string().nullable(), months_before: z.number() }),
  ),
  weddingDate: z.string().nullable(),
  totalAllocated: z.number(),
  totalSpent: z.number(),
  totalChecklistItems: z.number(),
  completedChecklistItems: z.number(),
  daysUntilWedding: z.number().nullable(),
  websiteStatus: z.enum(["draft", "published"]),
});

export type OverviewStats = z.infer<typeof overviewStatsSchema>;
