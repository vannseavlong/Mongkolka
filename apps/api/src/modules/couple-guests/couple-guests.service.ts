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
  gift_status?: "none" | "reported" | "received";
  gift_type?: "cash" | "gift" | "other";
  gift_amount?: number;
  gift_currency?: "USD" | "KHR";
  gift_received_date?: string;
  gift_note?: string;
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
    const data: Record<string, unknown> = { ...input };
    // Marking a gift received stamps the date once; clearing the gift clears the amount
    // so totals can't drift from what the list shows.
    if (input.gift_status === "received" && !input.gift_received_date) {
      const existing = await CoupleGuestsModel.findById(actorSheetId, guestId);
      if (!existing?.gift_received_date) data.gift_received_date = new Date().toISOString();
    }
    if (input.gift_status === "none") {
      data.gift_amount = 0;
      data.gift_type = undefined;
      data.gift_currency = undefined;
      data.gift_received_date = undefined;
    }
    await CoupleGuestsModel.update(actorSheetId, guestId, data);
    return CoupleGuestsModel.findById(actorSheetId, guestId);
  },

  delete(actorSheetId: string, guestId: string) {
    return CoupleGuestsModel.delete(actorSheetId, guestId);
  },
};
