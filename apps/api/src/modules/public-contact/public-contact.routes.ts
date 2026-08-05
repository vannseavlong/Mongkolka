import { Router } from "express";
import { PublicContactController } from "./public-contact.controller.js";

export const publicContactRouter = Router();

publicContactRouter.post("/contact", PublicContactController.submit);
