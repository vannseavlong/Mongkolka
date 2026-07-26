import { adminContext } from "../../config/database.js";

export const OverviewService = {
  async getStats() {
    const ctx = adminContext();

    // Pending couples/vendors only exist as `users` rows (status: 'pending') until
    // approved — approving is what creates their `couples`/`vendors` catalog row, so
    // the approval queue is counted from `users`, not from those catalog tables.
    const [totalCouples, totalVendors, pendingCouples, pendingVendors, activeTemplates] =
      await Promise.all([
        ctx.table("couples").count(),
        ctx.table("vendors").count(),
        ctx.table("users").count({ where: { role: "couple", status: "pending" } }),
        ctx.table("users").count({ where: { role: "vendor", status: "pending" } }),
        ctx.table("website_templates").count({ where: { status: "active" } }),
      ]);

    return { totalCouples, totalVendors, pendingCouples, pendingVendors, activeTemplates };
  },
};
