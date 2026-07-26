import { CouplesService } from "../couples/couples.service.js";
import { VendorsService } from "../vendors/vendors.service.js";
import { UsersModel } from "./users.model.js";

export const UsersService = {
  listUsers(status?: string, role?: string) {
    const where = { ...(status ? { status } : {}), ...(role ? { role } : {}) };
    return UsersModel.findMany(Object.keys(where).length ? where : undefined);
  },

  async approve(userId: string, approvingAdminUserId: string) {
    const user = await UsersModel.findById(userId);
    if (!user) return null;
    if (user.status === "active") return user;

    const actorSheetId = await UsersModel.createActorSheet(
      user.user_id as string,
      user.role as string,
      user.email as string,
    );
    await UsersModel.updateStatus(userId, "active", { actor_sheet_id: actorSheetId });

    if (user.role === "couple") {
      await CouplesService.provisionCouple(user, actorSheetId);
    } else if (user.role === "vendor") {
      await VendorsService.provisionVendor(user, actorSheetId, approvingAdminUserId);
    }

    return UsersModel.findById(userId);
  },

  async reject(userId: string) {
    await UsersModel.updateStatus(userId, "inactive");
    return UsersModel.findById(userId);
  },
};
