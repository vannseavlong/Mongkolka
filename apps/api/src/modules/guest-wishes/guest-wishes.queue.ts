import { WriteBehindQueue } from "../../utils/write-behind-queue.js";
import { GuestWishesModel } from "./guest-wishes.model.js";

type WishRow = Record<string, unknown> & { wish_id: string };

export const GuestWishesQueue = new WriteBehindQueue<WishRow>({
  idField: "wish_id",
  label: "guest-wishes",
  write: (actorSheetId, rows) => GuestWishesModel.createMany(actorSheetId, rows),
});
