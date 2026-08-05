import type { Request, Response } from "express";
import { ContactMessagesService } from "../contact-messages/contact-messages.service.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PublicContactController = {
  async submit(req: Request, res: Response) {
    const { name, email, subject, message } = req.body ?? {};
    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !EMAIL_RE.test(email.trim()) ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      res.status(400).json({ error: "name, a valid email, and message are required" });
      return;
    }

    await ContactMessagesService.submit({
      name: name.trim(),
      email: email.trim(),
      subject: typeof subject === "string" ? subject.trim() : undefined,
      message: message.trim(),
    });
    res.status(201).json({ ok: true });
  },
};
