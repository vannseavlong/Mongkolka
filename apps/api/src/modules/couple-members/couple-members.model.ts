import { adminContext } from "../../config/database.js";

export const CoupleMembersModel = {
  findMembers(coupleId: string) {
    return adminContext()
      .table("couple_members")
      .findMany({ where: { couple_id: coupleId } });
  },

  findMemberById(memberId: string) {
    return adminContext().table("couple_members").findOne({ where: { member_id: memberId } });
  },

  findUserById(userId: string) {
    return adminContext().table("users").findOne({ where: { user_id: userId } });
  },

  findUserByEmail(email: string, role: string) {
    return adminContext().table("users").findOne({ where: { email, role } });
  },

  createUser(data: Record<string, unknown>) {
    return adminContext().table("users").create(data);
  },

  addMember(data: Record<string, unknown>) {
    return adminContext().table("couple_members").create(data);
  },

  removeMember(memberId: string) {
    return adminContext()
      .table("couple_members")
      .delete({ where: { member_id: memberId } });
  },
};
