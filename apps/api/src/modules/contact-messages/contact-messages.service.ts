import { randomUUID } from "node:crypto";
import { ContactMessagesModel } from "./contact-messages.model.js";

export interface SubmitContactMessageInput {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export const ContactMessagesService = {
  async list(status?: string) {
    const messages = await ContactMessagesModel.findMany(status ? { status } : undefined);
    return [...messages].sort((a, b) => {
      const aTime = String(a._created_at ?? "");
      const bTime = String(b._created_at ?? "");
      return bTime.localeCompare(aTime);
    });
  },

  submit(input: SubmitContactMessageInput) {
    return ContactMessagesModel.create({
      message_id: randomUUID(),
      ...input,
      status: "unread",
    });
  },

  async markStatus(messageId: string, status: "unread" | "read") {
    await ContactMessagesModel.update(messageId, { status });
    return ContactMessagesModel.findById(messageId);
  },

  delete(messageId: string) {
    return ContactMessagesModel.delete(messageId);
  },
};
