import { randomUUID } from "node:crypto";
import { CoupleGuestsModel } from "./couple-guests.model.js";

export interface CreateGuestInput {
  name: string;
  telegram?: string;
  phone?: string;
  status?: string;
  plus_one?: boolean;
  plus_one_name?: string;
  group?: string;
  notes?: string;
}

export type UpdateGuestInput = Partial<CreateGuestInput> & {
  invited_date?: string;
  confirmed_date?: string;
};

export const CoupleGuestsService = {
  list(actorSheetId: string) {
    return CoupleGuestsModel.findMany(actorSheetId);
  },

  create(actorSheetId: string, input: CreateGuestInput) {
    return CoupleGuestsModel.create(actorSheetId, {
      guest_id: randomUUID(),
      ...input,
    });
  },

  async update(actorSheetId: string, guestId: string, input: UpdateGuestInput) {
    await CoupleGuestsModel.update(actorSheetId, guestId, { ...input });
    return CoupleGuestsModel.findById(actorSheetId, guestId);
  },

  delete(actorSheetId: string, guestId: string) {
    return CoupleGuestsModel.delete(actorSheetId, guestId);
  },
};
