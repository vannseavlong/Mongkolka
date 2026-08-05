import { adminContext } from "../../config/database.js";

export const ContactMessagesModel = {
  findMany(where?: Record<string, unknown>) {
    return adminContext().table("contact_messages").findMany({ where });
  },

  findById(messageId: string) {
    return adminContext()
      .table("contact_messages")
      .findOne({ where: { message_id: messageId } });
  },

  create(data: Record<string, unknown>) {
    return adminContext().table("contact_messages").create(data);
  },

  update(messageId: string, data: Record<string, unknown>) {
    return adminContext()
      .table("contact_messages")
      .update({ where: { message_id: messageId }, data });
  },

  delete(messageId: string) {
    return adminContext()
      .table("contact_messages")
      .delete({ where: { message_id: messageId } });
  },
};
