import { WriteBehindQueue } from "../../utils/write-behind-queue.js";
import { GuestPhotosModel } from "./guest-photos.model.js";

type PhotoRow = Record<string, unknown> & { photo_id: string };

// Guests upload in bursts and Sheets allows ~60 writes/min per OAuth user, so metadata
// rows are appended in batches (see WriteBehindQueue).
export const GuestPhotosQueue = new WriteBehindQueue<PhotoRow>({
  idField: "photo_id",
  label: "guest-photos",
  write: (actorSheetId, rows) => GuestPhotosModel.createMany(actorSheetId, rows),
});
