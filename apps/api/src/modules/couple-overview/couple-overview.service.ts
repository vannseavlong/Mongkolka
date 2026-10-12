import { adminContext, coupleContext } from "../../config/database.js";

export const CoupleOverviewService = {
  async getStats(coupleId: string, actorSheetId: string) {
    const ctx = coupleContext(actorSheetId);

    const [couple, guests, budgetCategories, checklistItems, photos, wishes, milestones] = await Promise.all([
      adminContext().table("couples").findOne({ where: { couple_id: coupleId } }),
      ctx.table("guests").findMany(),
      ctx.table("budget_categories").findMany(),
      ctx.table("checklist_items").findMany(),
      // Optional tabs: a couple sheet created before these features shipped has no such
      // tab until the next `lsdb sync`; the dashboard shouldn't fail over that.
      ctx.table("guest_photos").findMany().catch(() => []),
      ctx.table("guest_wishes").findMany().catch(() => []),
      ctx.table("milestones").findMany(),
    ]);

    const totalGuests = guests.length;
    const confirmedGuests = guests.filter((g) => g.status === "confirmed").length;
    const declinedGuests = guests.filter((g) => g.status === "declined").length;

    const totalAllocated = budgetCategories.reduce(
      (sum, c) => sum + (Number(c.allocated) || 0),
      0,
    );
    const totalSpent = budgetCategories.reduce((sum, c) => sum + (Number(c.spent) || 0), 0);

    const totalChecklistItems = checklistItems.length;
    const completedChecklistItems = checklistItems.filter((i) => i.completed).length;

    let daysUntilWedding: number | null = null;
    if (couple?.wedding_date) {
      const diffMs = new Date(couple.wedding_date as string).getTime() - Date.now();
      daysUntilWedding = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    }

    // Headcount counts a confirmed guest's plus-one, since that's who needs a seat/meal.
    const expectedHeadcount = guests
      .filter((g) => g.status === "confirmed")
      .reduce((sum, g) => sum + 1 + (g.plus_one ? 1 : 0), 0);

    const byStatus: Record<string, number> = {};
    for (const g of guests) {
      const status = String(g.status ?? "no-response");
      byStatus[status] = (byStatus[status] ?? 0) + 1;
    }

    const gifts: Record<string, { received: number; reported: number }> = {};
    let giftsReceivedCount = 0;
    let giftsReportedCount = 0;
    for (const g of guests) {
      const amount = Number(g.gift_amount) || 0;
      const currency = String(g.gift_currency ?? "USD");
      if (g.gift_status === "received") {
        giftsReceivedCount += 1;
        gifts[currency] ??= { received: 0, reported: 0 };
        gifts[currency].received += amount;
      } else if (g.gift_status === "reported") {
        giftsReportedCount += 1;
        gifts[currency] ??= { received: 0, reported: 0 };
        gifts[currency].reported += amount;
      }
    }

    // Earliest-due first: "12 months before" comes before "1 month before".
    const nextMilestones = milestones
      .filter((m) => !m.completed)
      .sort((a, b) => (Number(b.months_before) || 0) - (Number(a.months_before) || 0))
      .slice(0, 3)
      .map((m) => ({
        title: m.title as string,
        task: (m.task as string | null) ?? null,
        months_before: Number(m.months_before) || 0,
      }));

    return {
      guestsByStatus: byStatus,
      expectedHeadcount,
      gifts,
      giftsReceivedCount,
      giftsReportedCount,
      photosPending: photos.filter((p) => p.status === "pending" || !p.status).length,
      photosApproved: photos.filter((p) => p.status === "approved").length,
      wishesPending: wishes.filter((w) => w.status === "pending" || !w.status).length,
      wishesTotal: wishes.length,
      nextMilestones,
      weddingDate: (couple?.wedding_date as string | undefined) ?? null,
      totalGuests,
      confirmedGuests,
      declinedGuests,
      totalAllocated,
      totalSpent,
      totalChecklistItems,
      completedChecklistItems,
      daysUntilWedding,
      websiteStatus: couple?.website_status ?? "draft",
    };
  },
};
