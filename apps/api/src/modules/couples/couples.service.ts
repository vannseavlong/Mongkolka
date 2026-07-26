import { randomUUID } from "node:crypto";
import { generatePlaceholderSlug } from "../../utils/slug.js";
import { CouplesModel } from "./couples.model.js";

export const CouplesService = {
  listCouples(status?: string) {
    return CouplesModel.findMany(status ? { status } : undefined);
  },

  /**
   * Creates the couples catalog row + the first couple_members row for a newly
   * approved couple. Called once, right after the user's own sheet is provisioned.
   */
  async provisionCouple(user: Record<string, unknown>, actorSheetId: string) {
    const coupleId = randomUUID();

    await CouplesModel.create({
      couple_id: coupleId,
      actor_sheet_id: actorSheetId,
      partner1_email: user.email as string,
      slug: generatePlaceholderSlug(),
      status: "active",
      website_status: "draft",
    });

    await CouplesModel.addMember({
      member_id: randomUUID(),
      couple_id: coupleId,
      user_id: user.user_id as string,
      member_role: "partner",
      joined_at: new Date().toISOString(),
    });

    return coupleId;
  },

  async suspend(coupleId: string) {
    await CouplesModel.updateStatus(coupleId, "suspended");
    return CouplesModel.findById(coupleId);
  },

  async reactivate(coupleId: string) {
    await CouplesModel.updateStatus(coupleId, "active");
    return CouplesModel.findById(coupleId);
  },
};
