import { randomUUID } from "node:crypto";
import { CoupleProfileModel } from "../couple-profile/couple-profile.model.js";
import { CoupleMembersModel } from "./couple-members.model.js";

export const CoupleMembersService = {
  async list(coupleId: string) {
    const members = await CoupleMembersModel.findMembers(coupleId);
    const users = await Promise.all(
      members.map((member) => CoupleMembersModel.findUserById(member.user_id as string)),
    );
    return members.map((member, i) => ({
      ...member,
      email: users[i]?.email ?? null,
      user_status: users[i]?.status ?? null,
    }));
  },

  /**
   * Invites a partner/collaborator by email into the same couple tenant. If the
   * email has no existing couple-role user, creates one directly as "active" and
   * pointed at the SAME actor_sheet_id — no new sheet is provisioned, since this
   * is one tenant gaining a second login identity, not a new couple.
   */
  async invite(coupleId: string, actorSheetId: string, invitedByUserId: string, email: string) {
    let user = await CoupleMembersModel.findUserByEmail(email, "couple");

    if (user) {
      const existingMembers = await CoupleMembersModel.findMembers(coupleId);
      if (existingMembers.some((m) => m.user_id === user!.user_id)) {
        throw new Error("This person is already a member of this couple");
      }
      if (user.actor_sheet_id && user.actor_sheet_id !== actorSheetId) {
        throw new Error("This email is already linked to a different couple account");
      }
    } else {
      user = await CoupleMembersModel.createUser({
        user_id: randomUUID(),
        role: "couple",
        email,
        status: "active",
        actor_sheet_id: actorSheetId,
      });
    }

    const member = await CoupleMembersModel.addMember({
      member_id: randomUUID(),
      couple_id: coupleId,
      user_id: user.user_id as string,
      member_role: "collaborator",
      invited_by: invitedByUserId,
      joined_at: new Date().toISOString(),
    });

    const catalog = await CoupleProfileModel.findCatalogById(coupleId);
    if (!catalog?.partner2_email) {
      await CoupleProfileModel.updateCatalog(coupleId, { partner2_email: email });
    }

    return { ...member, email };
  },

  async remove(coupleId: string, memberId: string) {
    const members = await CoupleMembersModel.findMembers(coupleId);
    if (members.length <= 1) {
      throw new Error("A couple must keep at least one member");
    }
    const target = members.find((m) => m.member_id === memberId);
    if (!target) return null;

    await CoupleMembersModel.removeMember(memberId);
    return target;
  },
};
