import { Router } from "express";
import { ContactMessagesController } from "./contact-messages.controller.js";

export const contactMessagesRouter = Router();

contactMessagesRouter.get("/contact-messages", ContactMessagesController.list);
contactMessagesRouter.patch("/contact-messages/:messageId", ContactMessagesController.updateStatus);
contactMessagesRouter.delete("/contact-messages/:messageId", ContactMessagesController.remove);
