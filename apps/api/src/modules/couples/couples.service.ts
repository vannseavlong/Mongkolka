import { randomUUID } from "node:crypto";
import { hashPassword } from "longcelot-sheet-db";
import { generatePlaceholderSlug } from "../../utils/slug.js";
import { UsersModel } from "../users/users.model.js";
import { CredentialsModel } from "../auth/credentials.model.js";
import { CouplesModel } from "./couples.model.js";

export interface RegisterCoupleInput {
  email: string;
  password: string;
  partner1Name?: string;
  partner2Name?: string;
  partner2Email?: string;
  weddingDate?: string;
}

export type RegisterCoupleResult = { ok: true; userId: string } | { ok: false; error: "email_taken" };

export const CouplesService = {
  listCouples(status?: string) {
    return CouplesModel.findMany(status ? { status } : undefined);
  },

  /**
   * Self-registration entry point (`POST /couple/auth/register`) — parallel to
   * `selfRegisterOnUser` (the Google-only path), but collects the couple's own
   * details up front instead of leaving the `couples` row to be filled in later.
   * Creates the login identity + a *pending* `couples` row in one go; both stay
   * pending (no `actor_sheet_id`) until an admin approves, at which point
   * `provisionCouple` finds and activates this same row rather than creating a
   * second one.
   */
  async registerCouple(input: RegisterCoupleInput): Promise<RegisterCoupleResult> {
    const existing = await UsersModel.findByEmail(input.email);
    if (existing) return { ok: false, error: "email_taken" };

    const userId = randomUUID();
    await UsersModel.create({ user_id: userId, role: "couple", email: input.email, status: "pending" });

    const passwordHash = await hashPassword(input.password);
    await CredentialsModel.create({ user_id: userId, password_hash: passwordHash, provider: "local" });

    await CouplesModel.create({
      couple_id: randomUUID(),
      partner1_name: input.partner1Name,
      partner1_email: input.email,
      partner2_name: input.partner2Name,
      partner2_email: input.partner2Email,
      wedding_date: input.weddingDate,
      slug: generatePlaceholderSlug(),
      status: "pending",
      website_status: "draft",
    });

    return { ok: true, userId };
  },

  /**
   * Creates the couples catalog row + the first couple_members row for a newly
   * approved couple. Called once, right after the user's own sheet is provisioned.
   *
   * Prefers reusing the pending row `registerCouple` already created (filled in
   * with the couple's own details); falls back to a bare create for accounts that
   * came in through the Google self-register path instead, which never collects
   * those details up front.
   */
  async provisionCouple(user: Record<string, unknown>, actorSheetId: string) {
    const email = user.email as string;
    const pending = await CouplesModel.findPendingByEmail(email);

    let coupleId: string;
    if (pending) {
      coupleId = pending.couple_id as string;
      await CouplesModel.update(coupleId, { actor_sheet_id: actorSheetId, status: "active" });
    } else {
      coupleId = randomUUID();
      await CouplesModel.create({
        couple_id: coupleId,
        actor_sheet_id: actorSheetId,
        partner1_email: email,
        slug: generatePlaceholderSlug(),
        status: "active",
        website_status: "draft",
      });
    }

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
