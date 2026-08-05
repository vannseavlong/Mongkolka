import type { Request, Response } from "express";
import { ContactMessagesService } from "./contact-messages.service.js";

export const ContactMessagesController = {
  async list(req: Request, res: Response) {
    const status = typeof req.query.status === "string" ? req.query.status : undefined;
    const messages = await ContactMessagesService.list(status);
    res.json({ messages });
  },

  async updateStatus(req: Request, res: Response) {
    const { status } = req.body ?? {};
    if (status !== "unread" && status !== "read") {
      res.status(400).json({ error: 'status must be "unread" or "read"' });
      return;
    }
    const message = await ContactMessagesService.markStatus(req.params.messageId as string, status);
    if (!message) {
      res.status(404).json({ error: "Message not found" });
      return;
    }
    res.json({ message });
  },

  async remove(req: Request, res: Response) {
    await ContactMessagesService.delete(req.params.messageId as string);
    res.status(204).end();
  },
};
