import { adminContext, coupleContext } from "../../config/database.js";

export const CoupleOverviewService = {
  async getStats(coupleId: string, actorSheetId: string) {
    const ctx = coupleContext(actorSheetId);

    const [couple, guests, budgetCategories, checklistItems] = await Promise.all([
      adminContext().table("couples").findOne({ where: { couple_id: coupleId } }),
      ctx.table("guests").findMany(),
      ctx.table("budget_categories").findMany(),
      ctx.table("checklist_items").findMany(),
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

    return {
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
